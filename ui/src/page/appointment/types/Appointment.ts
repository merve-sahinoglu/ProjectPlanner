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
  id: number;
  appointmenId: string;
  chieldId: string | null;
  chieldName: string;
  playgroupId?: string;
  playgroupName?: string;
  roomId?: string;
  roomName?: string;
  therapistId: string;
  therapistName: string;
  typeId: string;
  statusId: string;
  name: string;
  description: string;
  appointmentDays?: SelectedDates[];
}
interface CallenderProps {
  id: number;
  appointmenId: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  chieldId: string;
  playgroupId?: string;
  playgroupName?: string;
  roomId?: string;
  roomName?: string;
  therapistId: string;
  therapistName: string;
  typeId: string;
  statusId: string;
  name: string;
  description: string;
  appointmentDays?: SelectedDates[];
  chieldName: string;
}

interface SelectedDates {
  id?: string;
  start: Date;
  end: Date;
  lineStatusId: number;
}

type AppointmentResponse = Omit<Appointment, "typeId"> & {
  typeId: number;
};

interface UserInformationResponse {
  id: string;
  name: string;
  surname: string;
}

export type {
  Appointment,
  SelectedDates,
  CallenderProps,
  UserInformationResponse,
  AppointmentResponse,
};

export { AppointmentType, LineStatus };
