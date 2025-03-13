enum LineStatus {
  Waiting = 0,
  Completed = 1,
  Canceled = 2,
}

enum AppointmentType {
  INITIAL_CONSULTATION = "0",
  SPEECH_THERAPY = "1",
  PSYCHOLOGICAL_THERAPY = "2",
  GAME_GROUPS = "3",
}

interface Appointment {
  id: string;
  chieldId: string;
  playgroupId?: string;
  roomId?: string;
  therapistId: string;
  typeId: string;
  statusId: string;
  name: string;
  description: string;
  appointmentDays?: SelectedDates[];
}
interface CallenderProps {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  appointmenId: string;
}

interface SelectedDates {
  start: Date;
  end: Date;
  lineStatusId: number;
}

export type { Appointment, SelectedDates, CallenderProps };

export { AppointmentType, LineStatus };
