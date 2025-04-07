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
  chieldName: string;
  playgroupId?: string;
  playgroupName?: string;
  roomId?: string;
  roomName?: string;
  therapistId: string;
  typeId: string;
  statusId: string;
  name: string;
  description: string;
  appointmentDays?: SelectedDates[];
  teacherId: string;
  teacherName: string;
}
interface CallenderProps {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  appointmenId: string;
  chieldId: string;
  playgroupId?: string;
  roomId?: string;
  therapistId: string;
  typeId: string;
  statusId: string;
  name: string;
  description: string;
  appointmentDays?: SelectedDates[];
  teacherId: string;
}

interface SelectedDates {
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
