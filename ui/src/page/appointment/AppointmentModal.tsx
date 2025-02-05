import { useState } from "react";
import { TextInput, Button } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { addDays, isSameMinute, differenceInDays } from "date-fns";

interface AppointmentFormProps {
  model: Appointment;
  closeOnSave: () => void;
  handleAppointments: (appointments: Appointment[]) => void;
}

interface Appointment {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

const AppointmentModal: React.FC<AppointmentFormProps> = ({
  model,
  closeOnSave,
  handleAppointments,
}) => {
  const [appointment, setAppointment] = useState(
    model ? model : ({} as Appointment)
  );

  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>(
    undefined
  );

  const handleTitle = (value: string) => {
    setAppointment({ ...appointment, title: value });
  };

  const groupConsecutiveDatesWithSameTime = (
    dates: Date[]
  ): { start: Date; end: Date }[] => {
    if (!dates || dates.length === 0) return [];

    // 📅 Tarihleri ve saatleri sıralıyoruz
    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
    const groupedEvents: { start: Date; end: Date }[] = [];

    let start = sortedDates[0];
    let end = sortedDates[0];

    for (let i = 1; i < sortedDates.length; i++) {
      const diff = differenceInDays(sortedDates[i], end);

      if (diff === 1 && isSameMinute(start, sortedDates[i])) {
        // 📌 Eğer gün ardışık ve saatleri aynıysa -> Aynı randevu içinde devam et
        end = sortedDates[i];
      } else {
        // 📌 Yeni bir randevu başlat
        groupedEvents.push({ start, end });
        start = sortedDates[i];
        end = sortedDates[i];
      }
    }

    // 📌 Son grubu ekleyelim
    groupedEvents.push({ start, end });

    return groupedEvents;
  };

  const handleDateAppointments = (title: string) => {
    if (selectedDates) {
      const groupedEvents = groupConsecutiveDatesWithSameTime(
        selectedDates
      ).map(({ start, end }) => ({
        title: title,
        start,
        end: addDays(end, 1), // Takvim bitiş gününü de dahil etsin
        allDay: true,
      }));

      debugger;

      handleAppointments([...groupedEvents]);
    }
  };

  return (
    <>
      <TextInput
        label="Başlık"
        value={appointment.title}
        onChange={(e) => handleTitle(e.target.value)}
      />
      <DatePickerInput
        value={selectedDates}
        onChange={setSelectedDates}
        valueFormat="YYYY MMM DD  HH:mm"
        type="multiple"
        label="Pick date"
        placeholder="Pick date"
      />
      <Button
        mt="md"
        onClick={() => {
          closeOnSave();
          handleDateAppointments(appointment.title);
        }}
      >
        Kaydet
      </Button>
    </>
  );
};

export default AppointmentModal;
