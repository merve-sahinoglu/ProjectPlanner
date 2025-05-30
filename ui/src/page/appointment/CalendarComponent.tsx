import {
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ActionIcon, Avatar, Button, Group, Modal, Radio } from "@mantine/core";
import AppointmentModal from "./AppointmentModal";
import { useDisclosure } from "@mantine/hooks";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import moment from "moment";
import {
  Appointment,
  CallenderProps,
  UserInformationResponse,
} from "./types/Appointment";
import { useTranslation } from "react-i18next";
import useRequestHandler from "../../hooks/useRequestHandler";
import { never } from "zod";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import EditAppointmentModal from "./compoonent/EditAppointmentModal";
import CustomButton from "../../components/CustomButton/CustomButton";
import { IconGraphFilled, IconList } from "@tabler/icons-react";

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

const CalendarComponent = () => {
  const calendarComponentRef = useRef(null);
  const [calendarRefresh, setCalendarRefresh] = useState(0);
  const [tooltipShow, setTooltipShow] = useState({});
  const [agendas, setAgendas] = useState([]);
  const [agendaListView, setAgendaListView] = useState([]);
  const [selectedEventSlotDate, setSelectedEventSlotDate] = useState(null as DateModel | null);
  const [showAddCloseAppointment, setShowAddCloseAppointment] = useState(false);
  const [view, setView] = useState(true);
  const [isDailyView, setIsDailyView] = useState(true);

  const { sendData, fetchData } = useRequestHandler();
  const [callenders, setCallenders] = useState([] as CallenderProps[]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editopened, { open: editopen, close: editclose }] =
    useDisclosure(false);

  const [appointments, setAppointments] = useState([] as Appointment[]);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  const handleAppointments = (app: Appointment[]) => {
    if (!app) return;

    setAppointments([...appointments, ...app]);
  };

  const createdItemGuid = useRef<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [teachers, setTeachers] = useState<
    { id: string; nameSurname: string }[]
  >([]);

  const [canAddItem, setCanAddItem] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<Appointment>();

  const openAppointment = () => {
    const model: Appointment = {
      id: "",
      chieldId: "",
      therapistId: "",
      typeId: "",
      statusId: "",
      name: "",
      description: "",
      teacherId: "",
      chieldName: "",
      teacherName: "",
    };
    setAppointment(model);
    open();
  };

  const changeCreatedItemGuid = (id: string) => {
    createdItemGuid.current = id;
  };

  const changeSelectedItem = (item: Appointment | null) => {
    if (item) {
      setSelectedItem(item);
    }
  };

  const fetchAppointments = async () => {
    const response = await fetchData<Appointment[]>(
      createRequestUrl(apiUrl.appointmentUrl)
    );

    if (response.isSuccess) {
      const calendarEvents: CallenderProps[] = response.value.flatMap(
        (appointment) => {
          if (!appointment.appointmentDays) return []; // Eğer appointmentDays yoksa boş dizi döndür

          return appointment.appointmentDays.map((day) => ({
            id: Math.floor(Math.random() * 100000), // Rastgele bir id oluştur
            title: appointment.name,
            start: new Date(day.start),
            end: new Date(day.end),
            allDay: false, // allDay varsayılan olarak false
            appointmenId: appointment.id, // Appointment'ın id'sini kullan
            therapistId: appointment.therapistId, // Therapist'ın id'sini kullan
            teacherId: appointment.teacherId, // Teacher'ların id'lerini kullan
            chieldId: appointment.chieldId || "", // Default value if missing
            typeId: appointment.typeId || "", // Default value if missing
            statusId: appointment.statusId || "", // Default value if missing
            name: appointment.name || "", // Default value if missing
            description: appointment.description || "", // Default value if missing
            chieldName: appointment.chieldName || "", // Default value if missing
            teacherName: appointment.teacherName || "", // Default value if missing
          }));
        }
      );

      setCallenders(calendarEvents);
    }
  };

  const fetchTeachers = async () => {
    const request: { [key: string]: any } = {
      pageSize: 1000,
      typeId: 0,
    };

    const response = await fetchData<UserInformationResponse[]>(
      createRequestUrl(apiUrl.userUrl)
    );

    if (response.isSuccess) {
      const teacherAvatars = response.value.map((teacher) => ({
        id: teacher.id,
        nameSurname: teacher.name + " " + teacher.surname,
      }));

      setTeachers(teacherAvatars);
    }
  };

  const handleCallenderSelect = (teacherId: string) => {
    console.log(`Selected teacher ID: ${teacherId}`);

    const filtered = callenders.filter((callender) =>
      callender.teacherId.includes(teacherId)
    );

    setCallenders(filtered);
    // Add your logic here for handling calendar selection
  };

  const avatars = teachers.map((teacher) => (
    <Avatar
      key={teacher.id}
      name={teacher.nameSurname}
      color="initials"
      onClick={() => handleCallenderSelect(teacher.id)}
      alt={teacher.nameSurname}
    />
  ));

  function handleEditSlot(
    event: CallenderProps,
    e: SyntheticEvent<HTMLElement, Event>
  ): void {
    const selectedAppointment = callenders.find(
      (appointment) => appointment.appointmenId === event.appointmenId
    );

    if (selectedAppointment) {
      setAppointment({
        id: selectedAppointment.appointmenId,
        chieldId: selectedAppointment.chieldId || "",
        therapistId: selectedAppointment.therapistId || "",
        typeId: selectedAppointment.typeId || "",
        statusId: selectedAppointment.statusId || "",
        name: selectedAppointment.name || "",
        description: selectedAppointment.description || "",
        teacherId: selectedAppointment.teacherId || "",
        chieldName: selectedAppointment.chieldName || "", // Default value if missing
        teacherName: selectedAppointment.teacherName || "", // Default value if missing
      });
      editopen();
    } else {
      console.warn("Appointment not found for the selected event.");
    }
  }

  const handleEventMouseEnter = (eventInfo) => {
    const eventElement = eventInfo.el;
    const event = eventInfo.event;

    const tooltipContent = `
      <div>
        <strong>${event.title}</strong>
      </div>
    `;

    // create tooltip element
    const tooltipElement = document.createElement("div");
    tooltipElement.classList.add("event-tooltip");
    tooltipElement.innerHTML = tooltipContent;

    // Place the tooltip element according to the position of the event element
    const eventElementRect = eventElement.getBoundingClientRect();
    tooltipElement.style.top = eventElementRect.bottom + "px";
    tooltipElement.style.left = eventElementRect.left + "px";

    // Add to page tooltip element
    document.body.appendChild(tooltipElement);
  };

  const handleEventMouseLeave = () => {
    const tooltipElement = document.querySelectorAll(".event-tooltip");
    tooltipElement.forEach((element) => {
      element.remove();
    });
  };

  const getColorForFullCalendar = (agenda) => {
    if (agenda.typeId == 4)
      // Surgery
      return "#800080";
    if (agenda.typeId == 3) return "#CFCACA";
    if (agenda.statusId == 0) return "#A9A9A9";
    else if (agenda.statusId == 1)
      // Singup
      return "#0284c7";
    else if (agenda.statusId == 2)
      // In Examination Room
      return "#d97706";
    else if (agenda.statusId == 3)
      //Completed
      return "#16a34a";
  };

  const getAgendaTitle = (agenda) => {
    if (agenda.typeId == 1)
      return `${agenda.gender} ${
        agenda.fullText ?? agenda.initialName
      } (${moment(agenda.birthDate).format("DD-MM-YYYY")}) ${
        agenda.patientId
      } ${agenda.serviceName}`;
    else if (agenda.typeId == 2)
      return `${agenda.gender} ${
        agenda.fullText ?? agenda.initialName
      } (${moment(agenda.birthDate).format("DD-MM-YYYY")}) ${
        agenda.patientId
      } ${agenda.serviceName}`;
    else if (agenda.typeId == 3)
      return `${
        agenda.reasonDescription ? agenda.reasonDescription : agenda.note
      }`;
    else if (agenda.typeId == 4)
      return `${agenda.gender} ${
        agenda.fullText ?? agenda.initialName
      } (${moment(agenda.birthDate).format("DD-MM-YYYY")}) ${
        agenda.patientId
      } ${agenda.serviceName}`;
  };


  const onDropdownClick = async (e:string, item) => {
console.log("Dropdown clicked:", e, item);
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
                  event?.event?.extendedProps?.agenda
                ),
                //  backgroundColor: getColorForFullCalendar(event?.event?.extendedProps?.agenda),
              }}
            ></div>
          )}

          <div className="text-truncate max-w-100">
            {" "}
            {getAgendaTitle(extendedProps?.agenda)}
          </div>
          {extendedProps?.agenda?.typeId !== 3 && (
            <OverlayTrigger
              key={calendarRefresh}
              trigger="click"
              placement="auto-start"
              // show={tooltipShow[extendedProps?.agendaId]}
              overlay={
                <Tooltip className="tooltip-transparent">
                  <p>Burda dropdown</p>
                  {/* <Dropdown
                    color="primary"
                    view="outline"
                    rounded="full"
                    size="sm"
                    hidden="hidden"
                    icon="ate-icon-dots-menu"
                    tooltip={true}
                    items={[
                      {
                        id: "3",
                        text: intl.completeAppointment,
                        hidden:
                          extendedProps.agenda.statusId !== 2 ||
                          !filters?.find(
                            (x) =>
                              x.parameterId ===
                              "22b7a7b2-daf1-4f1a-b33f-d19d45b58f5c"
                          )?.isShow,
                      },
                      {
                        id: "2",
                        text: intl.inExaminationRoom,
                        hidden:
                          extendedProps.agenda.statusId !== 1 &&
                          extendedProps.agenda.statusId !== 4,
                      },
                      {
                        id: "4",
                        text: intl.onHold,
                        hidden:
                          extendedProps.agenda.statusId !== 1 &&
                          extendedProps.agenda.statusId !== 2,
                      },
                      {
                        id: "5",
                        text: intl.history,
                      },
                    ]}
                    onClick={(e) => onDropdownClick(e, extendedProps)}
                  /> */}
                </Tooltip>
              }
            >
              <span>
                <p>Buton vardi burda</p>
              </span>
            </OverlayTrigger>
          )}
        </div>
      </div>
    );
  };

   const ParseDateFromISOString = (date:Date, format = "DD.MMM.YYYY") => {
    return moment(date).format(format);
  };



  const onEventSlotClick = (e: EventSlotClickArg) => {
    if (e && e.view?.type != "dayGridMonth") {
      let dateModel: DateModel = {
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

  const onEvent = async (e) => {
    if (
      e?.jsEvent?.target?.className.includes("tooltip-menu") ||
      e?.jsEvent?.target?.className.includes("ate-icon-dots-menu")
    )
      return;
    console.log(e.event?.extendedProps);
 
  };

  const viewClick = (id:string) => {
    debugger;
    id === "graphic" ? setView(true) : setView(false);
  };

  const handleToday = () => {
    let calendarApi = calendarComponentRef.current.getApi();
    calendarApi.today();
    calendarApi.changeView("timeGridDay");
    let startDate = moment(calendarApi.view.currentStart).format(
      "DD.MMM.YYYY HH:mm"
    );
    let endDate = moment(calendarApi.view.currentEnd).format(
      "DD.MMM.YYYY HH:mm"
    );
    // setSearchField({ ...searchField, startDate: startDate, endDate: endDate });
    // setTitle(calendarApi.view.title);
    setIsDailyView(true);
  };

  const handleMonth = async () => {
    let calendarApi = calendarComponentRef.current.getApi();
    calendarApi.changeView("dayGridMonth");
    let startDate = moment(calendarApi.view.currentStart).format(
      "DD.MMM.YYYY HH:mm"
    );
    let endDate = moment(calendarApi.view.currentEnd).format(
      "DD.MMM.YYYY HH:mm"
    );
    // setSearchField({ ...searchField, startDate: startDate, endDate: endDate });
    // setTitle(calendarApi.view.title);
    setIsDailyView(false);
  };

  const handleWeek = () => {
    let calendarApi = calendarComponentRef.current.getApi();
    calendarApi.changeView("timeGridWeek");
    let startDate = moment(calendarApi.view.currentStart).format(
      "DD.MMM.YYYY HH:mm"
    );
    let endDate = moment(calendarApi.view.currentEnd).format(
      "DD.MMM.YYYY HH:mm"
    );
    // setSearchField({ ...searchField, startDate: startDate, endDate: endDate });
    // setTitle(calendarApi.view.title);
    setIsDailyView(false);
  };

  const agendaViewHandler = (e) => {
    if (e.target.value == 1) handleMonth();
    else if (e.target.value == 2) handleWeek();
    else if (e.target.value == 3) handleToday();
  };

  useEffect(() => {
    fetchAppointments();
    fetchTeachers();
  }, []);

  return (
    <>
      <Group grow>
        <div>
          <Radio
            items={[
              {
                value: "1",
                text: 'monthly',
                checked: false,
              },
              {
                value: "2",
                text: 'weekly',
                checked: false,
              },
              {
                value: "3",
                text: 'daily',
                checked: true,
              },
            ]}
            className="agenda-view-radio mb-4"
            onChange={(e) => agendaViewHandler(e)}
          />
        </div>
        <div className="flex justify-items-end">
          <OverlayTrigger overlay={<Tooltip>{"intl.agendaView"}</Tooltip>}>
            <div>
              <ActionIcon
                variant="flat"
                color={view ? "primary" : "secondary"}
                onClick={(id) => viewClick("graphic")}
              >
                <IconGraphFilled />
              </ActionIcon>
            </div>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>{"intl.listView"}</Tooltip>}>
            <div>
              <ActionIcon
                color={view ? "secondary" : "primary"}
                variant="flat"
                onClick={(id) => viewClick("list")}
              >
                <IconList />
              </ActionIcon>
            </div>
          </OverlayTrigger>
        </div>
      </Group>
      <Group grow mt={10}>
        <div
          className="agenda-fullcalendar"
          style={{ display: view ? "block" : "none" }}
        >
          <FullCalendar
            allDaySlot={false}
            ref={calendarComponentRef}
            // className="mx-n3"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "",
              center: "",
              right: "",
            }}
            nowIndicator={true}
            initialView="timeGridDay"
            height="auto"
            // locale={intl.translateLocale}
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            selectable={true}
            selectMirror={false}
            dayMaxEvents={true}
            select={(e) => onEventSlotClick(e)}
            eventClick={(e) => onEvent(e)}
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
            closeOnSave={close}
            selectedAppointment={appointment}
            handleAppointments={handleAppointments}
            createdItemGuid={createdItemGuid.current}
            disabled={isDisabled}
            changeCreatedItemGuid={changeCreatedItemGuid}
            changeSelectedItem={changeSelectedItem}
            handleUpdateItemWithId={function (
              item: Appointment,
              id: string
            ): void {
              console.log(item);
            }}
            setDisabled={setIsDisabled}
            handleDeleteItem={function (itemId: string): void {
              throw new Error("Function not implemented.");
            }}
            handleUpdateItem={function (item: Appointment): void {
              console.log(item);
            }}
          />
        </Modal>
      )}

      {appointment && (
        <Modal
          size={"xl"}
          opened={editopened}
          onClose={editclose}
          title=""
          centered
        >
          <EditAppointmentModal
            closeOnSave={editclose}
            itemGuid={appointment.id}
            disabled={isDisabled}
            changeSelectedItem={changeSelectedItem}
            setDisabled={setIsDisabled}
            handleUpdateItem={function (item: Appointment): void {
              console.log(item);
            }}
          />
        </Modal>
      )}
      <Group grow mt={10}>
        <Button onClick={openAppointment} variant="gradient">
          Add Appointment
        </Button>
      </Group>
    </>
  );
};

export default CalendarComponent;
