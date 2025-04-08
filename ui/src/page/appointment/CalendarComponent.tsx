import {
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Avatar, Button, Group, Modal } from "@mantine/core";
import AppointmentModal from "./AppointmentModal";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS as enUsLocale } from "date-fns/locale";
import { tr } from "date-fns/locale/tr"; // Türkçe dili desteği
import { useDisclosure } from "@mantine/hooks";
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

const locales = {
  "en-US": enUsLocale,
  tr: tr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarComponent = () => {
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

  useEffect(() => {
    fetchAppointments();
    fetchTeachers();
  }, []);

  return (
    <>
      <Group grow>{avatars}</Group>
      <Group grow mt={10}>
        <div style={{ height: 500, top: 50 }}>
          <Calendar
            localizer={localizer}
            events={callenders}
            startAccessor="start"
            endAccessor="end"
            selectable
            // onSelectSlot={handleSelectSlot}
            onSelectEvent={handleEditSlot}
            style={{ height: "100%" }}
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
