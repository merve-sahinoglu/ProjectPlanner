import { useState } from "react";
import { Modal } from "@mantine/core";
import AppointmentModal from "./AppointmentModal";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUsLocale from "date-fns/locale/en-US";
import tr from "date-fns/locale/tr"; // Türkçe dili desteği
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
    };
    setAppointment(model);
    open();
  };

  return (
    <>
      <div style={{ height: 500, top: 50 }}>
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEditSlot}
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
            model={appointment}
            handleAppointments={handleAppointments}
          />
        </Modal>
      )}
    </>
  );
};

export default CalendarComponent;
