import { SetStateAction, useState } from "react";
import { Button, Modal } from "@mantine/core";
import AppointmentModal from "./AppointmentModal";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS as enUsLocale } from "date-fns/locale";
import { tr } from "date-fns/locale/tr"; // Türkçe dili desteği
import { useDisclosure } from "@mantine/hooks";
import { Appointment } from "./types/Appointment";

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
  const [appointments, setAppointments] = useState([] as Appointment[]);
  const [opened, { open, close }] = useDisclosure(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  const handleAppointments = (appointments: Appointment[]) => {
    if (!appointment) return;

    setAppointments([...appointments, appointment]);
  };

  const handleEditSlot = (event: {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
  }) => {
    const model: Appointment = {
      id: Math.random(),
      appointmenId: crypto.randomUUID(),
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      chieldId: "",
      therapistId: "",
      typeId: "",
      statusId: "",
    };
    setAppointment(model);
    open();
  };

  const handleSelectSlot = (event: { start: Date; end: Date }) => {
    const model: Appointment = {
      id: Math.random(),
      appointmenId: crypto.randomUUID(),
      title: "",
      start: event.start,
      end: event.end,
      allDay: false,
      chieldId: "",
      therapistId: "",
      typeId: "",
      statusId: "",
    };
    setAppointment(model);
    open();
  };

  const openAppointment = () => {
    const model: Appointment = {
      id: Math.random(),
      appointmenId: crypto.randomUUID(),
      chieldId: "",
      therapistId: "",
      typeId: "",
      statusId: "",
      title: "",
      start: undefined,
      end: undefined,
      allDay: false,
    };
    setAppointment(model);
    open();
  };

  return (
    <>
      <button onClick={openAppointment}>Add Appointment</button>
      <div style={{ height: 500, top: 50 }}>
        <Calendar
          localizer={localizer}
          // events={appointments}
          startAccessor="start"
          endAccessor="end"
          // selectable
          // onSelectSlot={handleSelectSlot}
          // onSelectEvent={handleEditSlot}
          style={{ height: "100%" }}
        />
      </div>
      {appointment && (
        <Modal
          size={"xl"}
          opened={opened}
          onClose={close}
          title="New Instructor"
          centered
        >
          <AppointmentModal
            closeOnSave={close}
            selectedAppointment={appointment}
            handleAppointments={handleAppointments}
            createdItemGuid={""}
            disabled={false}
            changeCreatedItemGuid={function (id: string): void {
              throw new Error("Function not implemented.");
            }}
            changeSelectedItem={function (item: Appointment | null): void {
              throw new Error("Function not implemented.");
            }}
            handleUpdateItemWithId={function (
              item: Appointment,
              id: string
            ): void {
              throw new Error("Function not implemented.");
            }}
            setDisabled={function (value: SetStateAction<boolean>): void {
              throw new Error("Function not implemented.");
            }}
            handleDeleteItem={function (itemId: string): void {
              throw new Error("Function not implemented.");
            }}
            handleUpdateItem={function (item: Appointment): void {
              throw new Error("Function not implemented.");
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default CalendarComponent;
