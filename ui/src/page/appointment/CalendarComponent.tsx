import {
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
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";
import {
  Appointment,
  CallenderProps,
  UserInformationResponse,
} from "./types/Appointment";
import { useTranslation } from "react-i18next";
import useRequestHandler from "../../hooks/useRequestHandler";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import EditAppointmentModal from "./compoonent/EditAppointmentModal";
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
  const [agendas, setAgendas] = useState<CallenderProps[]>([]);
  const [agendaListView, setAgendaListView] = useState<Appointment[]>([]);
  const [selectedEventSlotDate, setSelectedEventSlotDate] = useState(null as DateModel | null);
  const [showAddCloseAppointment, setShowAddCloseAppointment] = useState(false);
  const [view, setView] = useState(true);
  const [isDailyView, setIsDailyView] = useState(true);
  const [title, setTitle] = useState("");
  const [searchField, setSearchField] = useState({
    userId: undefined,
    theacherId: undefined,
    startDate: moment(new Date()).startOf("day").format("DD.MMM.YYYY HH:mm"),
    endDate: moment(new Date()).add(1, "days").format("DD.MMM.YYYY HH:mm"),
  });

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
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isDisabledNew, setIsDisabledNew] = useState<boolean>(false);

  const [teachers, setTeachers] = useState<
    { id: string; nameSurname: string }[]
  >([]);

  const [canAddItem, setCanAddItem] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<Appointment>();

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
      playgroupId:  "",
      playgroupName:  "",
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
    const request: { [key: string]: any } = {
      userId: searchField.userId,
      theacherId: searchField.theacherId,
      startDate: searchField.startDate,
      endDate: searchField.endDate,
    };

    if(request.userId === undefined) {
      delete request.userId;
    }

    if(request.theacherId === undefined) {
      delete request.theacherId;
    }


    const response = await fetchData<Appointment[]>(
      createRequestUrl(apiUrl.appointmentUrl),
      request
    );

    if (response.isSuccess) {
      
      const calendarEvents: CallenderProps[] = response.value.flatMap(
        (appointment) => {
          if (!appointment.appointmentDays) return []; // Eğer appointmentDays yoksa boş dizi döndür
          return appointment.appointmentDays.map((day) => ({
            id: appointment.id, // Rastgele bir id oluştur
            title: appointment.name,
            start: new Date(day.start),
            end: new Date(day.end),
            allDay: false, // allDay varsayılan olarak false
            appointmenId: appointment.appointmenId, // Appointment'ın id'sini string olarak kullan
            therapistId: appointment.therapistId, // Therapist'ın id'sini kullan
            chieldId: appointment.chieldId || "", // Default value if missing
            typeId: appointment.typeId || "", // Default value if missing
            statusId: appointment.statusId.toString(), // Default value if missing
            name: appointment.name || "", // Default value if missing
            description: appointment.description || "", // Default value if missing
            chieldName: appointment.chieldName || "", // Default value if missing
            therapistName: appointment.therapistName || "", // Added missing property
            borderColor: "transparent",
            appointmentDays: appointment.appointmentDays || [],
            playgroupId: appointment.playgroupId || "",
            playgroupName: appointment.playgroupName || "",
            roomId: appointment.roomId || "",
            roomName: appointment.roomName || "",
          }));
        }
      );
      


      setAgendaListView(response.value);
      setAgendas(calendarEvents);
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
      callender.therapistId.includes(teacherId)
    );

    setCallenders(filtered);
    // Add your logic here for handling calendar selection
  };

  function handleEditSlot(
    event: CallenderProps,
  ): void {
    
    const selectedAppointment = agendas.find(
      (appointment) => appointment.appointmenId === event.appointmenId
    );
    if (selectedAppointment) {
      setAppointment({
        roomId: selectedAppointment.roomId || "",
        roomName: selectedAppointment.roomName || "",
        id: Math.floor(Math.random() * 100000), // Generate a random id
        appointmenId: selectedAppointment.appointmenId,
        chieldId: selectedAppointment.chieldId || "",
        therapistId: selectedAppointment.therapistId || "",
        typeId: selectedAppointment.typeId || "",
        statusId: selectedAppointment.statusId || "",
        name: selectedAppointment.name || "",
        description: selectedAppointment.description || "",
        chieldName: selectedAppointment.chieldName || "", // Default value if missing
        therapistName: selectedAppointment.therapistName || "", // Added missing property
        appointmentDays: selectedAppointment.appointmentDays || [],
        playgroupId: selectedAppointment.playgroupId || "",
        playgroupName: selectedAppointment.playgroupName || "",
      });

      
      editopen();
    } else {
      console.warn("Appointment not found for the selected event.");
    }
  }

  const handleEventMouseEnter = (eventInfo:any) => {
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

  const getColorForFullCalendar = (agenda: Appointment) => {
    if (!agenda) return "";
    if (agenda.typeId == "1")
      // Surgery
      return "#800080";
    if (agenda.typeId == "3") return "#CFCACA";
    if (agenda.statusId == "0") return "#A9A9A9";
    else if (agenda.statusId == "1")
      // Singup
      return "#0284c7";
    else if (agenda.statusId == "2")
      // In Examination Room
      return "#d97706";
    else if (agenda.statusId == "3") return "#16a34a";
  };

  const getAgendaTitle = (agenda: any) => {
    if (!agenda) return "";
    return agenda.chieldName;
  };


  const onDropdownClick = async (e:string, item:any) => {
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
            {getAgendaTitle(extendedProps)}
          </div>
          {extendedProps?.typeId !== 3 && (
            <OverlayTrigger
              key={calendarRefresh}
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

  const onEvent = async (e: any) => {
    if (
      e?.jsEvent?.target?.className.includes("tooltip-menu") ||
      e?.jsEvent?.target?.className.includes("ate-icon-dots-menu")
    )
      return;
      if (e.event?.extendedProps) {
      handleEditSlot(e.event?.extendedProps);

      }
    console.log(e.event?.extendedProps);
 
  };

  const viewClick = (id:string) => {
    
    id === "graphic" ? setView(true) : setView(false);
  };

  const handleToday = () => {
    if (calendarComponentRef.current) {
      // @ts-ignore
      let calendarApi = calendarComponentRef.current.getApi();
      calendarApi.today();
      calendarApi.changeView("timeGridDay");
      let startDate = moment(calendarApi.view.currentStart).format(
        "DD.MMM.YYYY HH:mm"
      );
      let endDate = moment(calendarApi.view.currentEnd).format(
        "DD.MMM.YYYY HH:mm"
      );
      setSearchField({
        ...searchField,
        startDate: startDate,
        endDate: endDate,
      });
      setTitle(calendarApi.view.title);
    }

    setIsDailyView(true);
  };

  const handleMonth = async () => {
    if (calendarComponentRef.current) {
      // @ts-ignore
      let calendarApi = calendarComponentRef.current.getApi();
      calendarApi.changeView("dayGridMonth");
      let startDate = moment(calendarApi.view.currentStart).format(
        "DD.MMM.YYYY HH:mm"
      );
      let endDate = moment(calendarApi.view.currentEnd).format(
        "DD.MMM.YYYY HH:mm"
      );
      setSearchField({ ...searchField, startDate: startDate, endDate: endDate });
      setTitle(calendarApi.view.title);
    }

    setIsDailyView(false);
  };

  const handleWeek = () => {
    if (calendarComponentRef.current) {
      // @ts-ignore
      let calendarApi = calendarComponentRef.current.getApi();
      calendarApi.changeView("timeGridWeek");

      let startDate = moment(calendarApi.view.currentStart).format(
        "DD.MMM.YYYY HH:mm"
      );
      let endDate = moment(calendarApi.view.currentEnd).format(
        "DD.MMM.YYYY HH:mm"
      );
      setSearchField({ ...searchField, startDate: startDate, endDate: endDate });
      setTitle(calendarApi.view.title);
    }
 
    setIsDailyView(false);
  };

  const agendaViewHandler = (e:string) => {
    
    if (e == "1") handleMonth();
    else if (e == "2") handleWeek();
    else if (e == "3") handleToday();
  };

  const refreshAgentasAfterEdite = () =>{
    fetchAppointments();
    editclose();
  }

  const refreshAgentasAfterCreate = () => {
    fetchAppointments();
    close();
  };


  useEffect(() => {
    fetchAppointments();
  }, [searchField]);

  return (
    <>
      <Group grow>
        <div>
          <Radio.Group
            name="favoriteFramework"
            onChange={(e) => agendaViewHandler(e)}
            withAsterisk
          >
            <Group mt="xs">
              <Radio value="1" label="monthly" />
              <Radio value="2" label="weekly" />
              <Radio value="3" label="daily" />
            </Group>
          </Radio.Group>
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
            closeOnSave={refreshAgentasAfterCreate}
            selectedAppointment={appointment}
            handleAppointments={handleAppointments}
            createdItemGuid={createdItemGuid.current}
            disabled={isDisabledNew}
            changeCreatedItemGuid={changeCreatedItemGuid}
            changeSelectedItem={changeSelectedItem}
            handleUpdateItemWithId={function (
              item: Appointment,
              id: string
            ): void {
              console.log(item);
            }}
            setDisabled={setIsDisabledNew}
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
          onClose={refreshAgentasAfterEdite}
          title=""
          centered
        >
          <EditAppointmentModal
            closeOnSave={refreshAgentasAfterEdite}
            itemGuid={appointment.appointmenId}
            appointment={appointment}
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
