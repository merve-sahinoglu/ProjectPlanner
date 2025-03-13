import { SetStateAction, useEffect, useRef, useState } from "react";
import { Avatar, Button, Group, Modal } from "@mantine/core";
import AppointmentModal from "./AppointmentModal";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS as enUsLocale } from "date-fns/locale";
import { tr } from "date-fns/locale/tr"; // Türkçe dili desteği
import { useDisclosure } from "@mantine/hooks";
import { Appointment, CallenderProps } from "./types/Appointment";
import Dictionary from "../../constants/dictionary";
import { useTranslation } from "react-i18next";
import useRequestHandler from "../../hooks/useRequestHandler";
import { never } from "zod";
import { apiUrl, createRequestUrl } from "../../config/app.config";

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
  const [appointments, setAppointments] = useState([] as Appointment[]);

  const [callenders, setCallenders] = useState([] as CallenderProps[]);

  const [opened, { open, close }] = useDisclosure(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  const handleCallenderProp = (callenderList: CallenderProps[]) => {
    if (!callenderList) return;

    setCallenders([...callenders, ...callenderList]);
  };

  const handleAppointments = (app: Appointment[]) => {
    if (!app) return;

    setAppointments([...appointments, ...app]);
  };

  const createdItemGuid = useRef<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
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
      const retVal: Appointment[] = [];

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
          }));
        }
      );

      setCallenders(calendarEvents);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const names = [
    "John Doe",
    "Jane Mol",
    "Alex Lump",
    "Sarah Condor",
    "Mike Johnson",
    "Kate Kok",
    "Tom Smith",
  ];

  const avatars = names.map((name) => (
    <Avatar key={name} name={name} color="initials" />
  ));

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
            // selectable
            // onSelectSlot={handleSelectSlot}
            // onSelectEvent={handleEditSlot}
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
      <Group grow mt={10}>
        <Button onClick={openAppointment} variant="gradient">
          Add Appointment
        </Button>
      </Group>
    </>
  );
};

export default CalendarComponent;
