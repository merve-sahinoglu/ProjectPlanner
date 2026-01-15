/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";

import { CalendarApi } from "@fullcalendar/core/index.js";
import trLocale from "@fullcalendar/core/locales/tr";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Button, Grid, Group, Modal, Radio } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import useRequestManager from "@hooks/useRequestManager";
import FormAutocomplete from "../../components/Autocomplete/FormAutocomplete";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import { nameof } from "../../helpers/name-of";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import AppointmentModal from "./AppointmentModal";
import EditAppointmentModal from "./compoonent/EditAppointmentModal";
import { Appointment, CallenderProps, SearchSchema } from "./types/Appointment";

interface DateModel {
  date: string;
  startTime: string;
  endTime: string;
}

interface EventSlotClickArg {
  start: Date;
  end: Date;
  view?: {
    type?: string;
  };
  event?: {
    extendedProps?: {
      agenda?: any;
      agendaId?: string;
      [key: string]: any;
    };
  };
}

const PALETTE = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#22c55e",
  "#06b6d4",
  "#e11d48",
];

// 2) Basit bir string -> int hash
function hashCode(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}

// 3) therapistId -> color map (cache)
const therapistColorMap = new Map<string, string>();
function getColorForTherapist(id?: string) {
  const key = id ?? "";
  if (!key) return "#6b7280"; // therapistId yoksa gri
  if (therapistColorMap.has(key)) return therapistColorMap.get(key)!;
  const idx = Math.abs(hashCode(key)) % PALETTE.length;
  const color = PALETTE[idx];
  therapistColorMap.set(key, color);
  return color;
}

// (Opsiyonel) Zemin rengine göre okunabilir metin rengi seç
function pickTextColor(bgHex: string) {
  const hex = bgHex.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  // Relative luminance approx
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 160 ? "#111827" : "#ffffff"; // açık zeminde koyu, koyu zeminde beyaz
}

const CalendarComponent = () => {
  const calendarApiRef = useRef<CalendarApi | null>(null);
  const { t, i18n } = useTranslation();

  const [agendas, setAgendas] = useState<CallenderProps[]>([]);
  const [agendaListView, setAgendaListView] = useState<Appointment[]>([]);
  const [selectedEventSlotDate, setSelectedEventSlotDate] =
    useState<DateModel | null>(null);
  const [showAddCloseAppointment, setShowAddCloseAppointment] = useState(false);

  const form = useForm<SearchSchema>({
    initialValues: {
      childId: undefined,
      therapistId: undefined,
      startDate: moment(new Date()).startOf("day").format("DD.MMM.YYYY HH:mm"),
      endDate: moment(new Date()).add(1, "days").format("DD.MMM.YYYY HH:mm"),
    },
  });

  const { fetchData } = useRequestManager();
  const [opened, { open, close }] = useDisclosure(false);
  const [editopened, { open: editopen, close: editclose }] =
    useDisclosure(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  const { userId: IdFromUrl } = useParams();
  const [createdItemGuid, setCreatedItemGuid] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isDisabledNew, setIsDisabledNew] = useState<boolean>(false);

  const handleAppointments = (app: Appointment[]) => {
    if (!app) return;
    setAppointments((prev) => [...prev, ...app]);
  };

  const openAppointment = () => {
    const model: Appointment = {
      id: 0,
      chieldId: "",
      appointmenId: "",
      therapistId: "",
      typeId: "",
      statusId: "",
      name: "",
      description: "",
      chieldName: "",
      therapistName: "",
      playgroupId: "",
      playgroupName: "",
    };
    setAppointment(model);
    open();
  };

  const changeCreatedItemGuid = (id: string) => {
    setCreatedItemGuid(id);
  };

  // Şimdilik bu component içinde kullanılmıyor, ama modal props’ları bozulmasın diye no-op bırakıldı.
  const changeSelectedItem = (_item: Appointment | null) => {
    // Intentionally left blank
  };

  const { childId, therapistId, startDate, endDate } = form.values;

  const fetchAppointments = useCallback(async () => {
    const request: { [key: string]: any } = {
      chieldId: childId,
      therapistId: IdFromUrl ?? therapistId,
      startDate: startDate,
      endDate: endDate,
    };

    if (request.chieldId === undefined) {
      delete request.chieldId;
    }

    if (request.therapistId === undefined) {
      delete request.therapistId;
    }

    const response = await fetchData<Appointment[]>(
      createRequestUrl(apiUrl.appointmentUrl),
      request
    );

    if (response.isSuccess) {
      const calendarEvents: CallenderProps[] = response.value.flatMap(
        (appointment) => {
          if (!appointment.appointmentDays) return [];

          const color = getColorForTherapist(appointment.therapistId);
          const textColor = pickTextColor(color);

          return appointment.appointmentDays.map((day) => ({
            id: appointment.id.toString(),
            title: appointment.name,
            start: new Date(day.start),
            end: new Date(day.end),
            allDay: false,

            appointmenId: appointment.appointmenId,
            therapistId: appointment.therapistId,
            chieldId: appointment.chieldId || "",
            typeId: appointment.typeId || "",
            statusId: appointment.statusId?.toString() ?? "",
            name: appointment.name || "",
            description: appointment.description || "",
            chieldName: appointment.chieldName || "",
            therapistName: appointment.therapistName || "",
            appointmentDays: appointment.appointmentDays || [],
            playgroupId: appointment.playgroupId || "",
            playgroupName: appointment.playgroupName || "",
            roomId: appointment.roomId || "",
            roomName: appointment.roomName || "",

            // Ek: eventContent içinde kullanmak için orijinal appointment’ı extendedProps altında taşıyoruz
            agenda: appointment,

            // FullCalendar stil alanları:
            backgroundColor: color,
            borderColor: color,
            textColor: textColor,
          }));
        }
      );

      setAgendaListView(response.value);
      setAgendas(calendarEvents);
    }
  }, [childId, therapistId, startDate, endDate, IdFromUrl, fetchData]);

  const handleEventMouseEnter = (eventInfo: any) => {
    const eventElement = eventInfo.el;
    const event = eventInfo.event;

    const tooltipContent = `
      <div>
        <strong>${event.title}</strong>
      </div>
    `;

    const tooltipElement = document.createElement("div");
    tooltipElement.classList.add("event-tooltip");
    tooltipElement.innerHTML = tooltipContent;

    const eventElementRect = eventElement.getBoundingClientRect();
    tooltipElement.style.top = eventElementRect.bottom + "px";
    tooltipElement.style.left = eventElementRect.left + "px";

    document.body.appendChild(tooltipElement);
  };

  const handleEventMouseLeave = () => {
    const tooltipElement = document.querySelectorAll(".event-tooltip");
    tooltipElement.forEach((element) => {
      element.remove();
    });
  };

  const getColorForFullCalendar = (agenda: Appointment | undefined) => {
    if (!agenda) return "";
    if (agenda.typeId === "1") return "#800080"; // Surgery
    if (agenda.typeId === "3") return "#CFCACA";
    if (agenda.statusId === "0") return "#A9A9A9";
    if (agenda.statusId === "1") return "#0284c7"; // Signup
    if (agenda.statusId === "2") return "#d97706"; // In Examination Room
    if (agenda.statusId === "3") return "#16a34a";

    return "";
  };

  const getAgendaTitle = (agenda: any) => {
    if (!agenda) return "";
    return agenda.chieldName;
  };

  const eventContainerWrapper = (event: EventSlotClickArg) => {
    const isDayGridMonth = event?.view?.type === "dayGridMonth";
    const extendedProps = event?.event?.extendedProps;

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center w-100">
          {isDayGridMonth && (
            <div
              className="fc-daygrid-event-dot"
              style={{
                borderColor: getColorForFullCalendar(
                  extendedProps?.agenda as Appointment | undefined
                ),
              }}
            ></div>
          )}

          <div className="text-truncate max-w-100">
            {getAgendaTitle(extendedProps)}
          </div>

          {extendedProps?.typeId !== 3 && (
            <OverlayTrigger
              trigger="click"
              placement="auto-start"
              overlay={
                <Tooltip className="tooltip-transparent">
                  <p>Degistirmek icin tiklayin</p>
                </Tooltip>
              }
            >
              <span>
                <p>{extendedProps?.description}</p>
              </span>
            </OverlayTrigger>
          )}
        </div>
      </div>
    );
  };

  const ParseDateFromISOString = (date: Date, format = "DD.MMM.YYYY") => {
    return moment(date).format(format);
  };

  const onEventSlotClick = (e: EventSlotClickArg) => {
    if (e && e.view?.type !== "dayGridMonth") {
      const dateModel: DateModel = {
        date: ParseDateFromISOString(e.start),
        startTime: `${e.start.getHours().toString().padStart(2, "0")}:${e.start
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
        endTime: `${e.end.getHours().toString().padStart(2, "0")}:${e.end
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      };
      setSelectedEventSlotDate(dateModel);
      setShowAddCloseAppointment(true);
    }
  };

  const onEvent = async (e: any) => {
    if (
      e?.jsEvent?.target?.className.includes("tooltip-menu") ||
      e?.jsEvent?.target?.className.includes("ate-icon-dots-menu")
    )
      return;

    if (e.event?.extendedProps) {
      handleEditSlot(e.event?.extendedProps);
    }
  };

  const handleEditSlot = (event: CallenderProps): void => {
    const selectedAppointment = agendas.find(
      (appointment) => appointment.appointmenId === event.appointmenId
    );

    if (!selectedAppointment) {
      console.warn("Appointment not found for the selected event.");
      return;
    }

    setAppointment({
      roomId: selectedAppointment.roomId || "",
      roomName: selectedAppointment.roomName || "",
      id: Math.floor(Math.random() * 100000),
      appointmenId: selectedAppointment.appointmenId,
      chieldId: selectedAppointment.chieldId || "",
      therapistId: selectedAppointment.therapistId || "",
      typeId: selectedAppointment.typeId || "",
      statusId: selectedAppointment.statusId || "",
      name: selectedAppointment.name || "",
      description: selectedAppointment.description || "",
      chieldName: selectedAppointment.chieldName || "",
      therapistName: selectedAppointment.therapistName || "",
      appointmentDays: selectedAppointment.appointmentDays || [],
      playgroupId: selectedAppointment.playgroupId || "",
      playgroupName: selectedAppointment.playgroupName || "",
    });

    editopen();
  };

  const handleToday = () => {
    const calendarApi = calendarApiRef.current;
    if (!calendarApi) return;

    calendarApi.today();
    calendarApi.changeView("timeGridDay");

    const start = moment(calendarApi.view.currentStart).format(
      "DD.MMM.YYYY HH:mm"
    );
    const end = moment(calendarApi.view.currentEnd).format("DD.MMM.YYYY HH:mm");

    form.setFieldValue("startDate", start);
    form.setFieldValue("endDate", end);
  };

  const handleMonth = () => {
    const calendarApi = calendarApiRef.current;
    if (!calendarApi) return;

    calendarApi.changeView("dayGridMonth");

    const start = moment(calendarApi.view.currentStart).format(
      "DD.MMM.YYYY HH:mm"
    );
    const end = moment(calendarApi.view.currentEnd).format("DD.MMM.YYYY HH:mm");

    form.setFieldValue("startDate", start);
    form.setFieldValue("endDate", end);
  };

  const handleWeek = () => {
    const calendarApi = calendarApiRef.current;
    if (!calendarApi) return;

    calendarApi.changeView("timeGridWeek");

    const start = moment(calendarApi.view.currentStart).format(
      "DD.MMM.YYYY HH:mm"
    );
    const end = moment(calendarApi.view.currentEnd).format("DD.MMM.YYYY HH:mm");

    form.setFieldValue("startDate", start);
    form.setFieldValue("endDate", end);
  };

  const agendaViewHandler = (e: string) => {
    if (e === "dayGridMonth") handleMonth();
    else if (e === "timeGridWeek") handleWeek();
    else if (e === "timeGridDay") handleToday();
  };

  const refreshAgentasAfterEdite = () => {
    fetchAppointments();
    editclose();
  };

  const refreshAgentasAfterCreate = () => {
    fetchAppointments();
    close();
  };

  const clearChieldId = () => {
    form.setFieldValue("chieldId", "");
  };

  const clearTherapistId = () => {
    form.setFieldValue("therapistId", "");
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <Grid>
      {IdFromUrl === undefined && (
        <Grid.Col span={{ xs: 2 }}>
          <Group grow mt={40}>
            <>
              <FormAutocomplete
                searchInputLabel={t(Dictionary.Appointment.CHILD_ID)}
                placeholder={t(Dictionary.Appointment.CHILD_ID)}
                description=""
                apiUrl={createRequestUrl(apiUrl.userUrl)}
                form={form}
                {...form.getInputProps(nameof<SearchSchema>("childId"))}
                formInputProperty="childId"
                clearValue={clearChieldId}
              />
              <FormAutocomplete
                searchInputLabel={t(Dictionary.Appointment.THERAPIST_ID)}
                placeholder={t(Dictionary.Appointment.THERAPIST_ID)}
                description=""
                apiUrl={createRequestUrl(apiUrl.userUrl)}
                form={form}
                {...form.getInputProps(nameof<SearchSchema>("therapistId"))}
                formInputProperty="therapistId"
                clearValue={clearTherapistId}
              />
            </>
          </Group>
        </Grid.Col>
      )}

      <Grid.Col span={{ xs: IdFromUrl === undefined ? 10 : 12 }}>
        <Group grow>
          <Radio.Group
            name="agendaView"
            onChange={agendaViewHandler}
            withAsterisk
          >
            <Group mt="xs">
              <Radio value="dayGridMonth" label={t(Dictionary.Appointment.MONTHLY)} />
              <Radio value="timeGridWeek" label={t(Dictionary.Appointment.WEEKLY)} />
              <Radio value="timeGridDay" label={t(Dictionary.Appointment.DAILY)} />
            </Group>
          </Radio.Group>
        </Group>

        <Group grow mt={10}>
          <div className="agenda-fullcalendar">
            <FullCalendar
              allDaySlot={false}
              ref={(fc) => {
                if (fc) {
                  calendarApiRef.current = fc.getApi();
                } else {
                  calendarApiRef.current = null;
                }
              }}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              locales={[trLocale]}
              locale={i18n.language}
              headerToolbar={{
                left: "",
                center: "",
                right: "",
              }}
              nowIndicator={true}
              initialView="timeGridDay"
              height="auto"
              slotMinTime="07:00:00"
              slotMaxTime="20:00:00"
              selectable={true}
              selectMirror={false}
              dayMaxEvents={true}
              select={onEventSlotClick}
              eventClick={onEvent}
              events={agendas}
              eventMouseEnter={handleEventMouseEnter}
              eventMouseLeave={handleEventMouseLeave}
              eventMinHeight={50}
              eventContent={eventContainerWrapper}
              eventDisplay="block"
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                meridiem: false,
                hour12: false,
              }}
              slotLabelFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
            />
          </div>
        </Group>

        {appointment && (
          <Modal size={"xl"} opened={opened} onClose={close} title="" centered>
            <AppointmentModal
              closeOnSave={refreshAgentasAfterCreate}
              selectedAppointment={appointment}
              handleAppointments={handleAppointments}
              createdItemGuid={createdItemGuid}
              disabled={isDisabledNew}
              changeCreatedItemGuid={changeCreatedItemGuid}
              changeSelectedItem={changeSelectedItem}
              handleUpdateItemWithId={function (
                item: Appointment,
                id: string
              ): void {
                console.log("handleUpdateItemWithId", item, id);
              }}
              setDisabled={setIsDisabledNew}
              handleDeleteItem={function (itemId: string): void {
                console.warn("handleDeleteItem not implemented", itemId);
              }}
              handleUpdateItem={function (item: Appointment): void {
                console.log("handleUpdateItem", item);
              }}
            />
          </Modal>
        )}

        {appointment && (
          <Modal
            size={"xl"}
            opened={editopened}
            onClose={refreshAgentasAfterEdite}
            title=""
            centered
          >
            <EditAppointmentModal
              closeOnSave={refreshAgentasAfterEdite}
              itemGuid={appointment.appointmenId || ""}
              appointment={appointment}
              disabled={isDisabled}
              changeSelectedItem={changeSelectedItem}
              setDisabled={setIsDisabled}
              handleUpdateItem={function (item: Appointment): void {
                console.log("edit handleUpdateItem", item);
              }}
            />
          </Modal>
        )}

        {IdFromUrl === undefined && (
          <Group grow mt={10}>
            <Button onClick={openAppointment} variant="gradient">
              Add Appointment
            </Button>
          </Group>
        )}
      </Grid.Col>
    </Grid>
  );
};

export default CalendarComponent;
