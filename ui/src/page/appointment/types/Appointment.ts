interface Appointment {
  id: number;
  appointmenId: string;
  chieldId: string;
  playgroupId?: string;
  roomId?: string;
  therapistId: string;
  typeId: string;
  statusId: string;
  title: string;
  start?: Date;
  end?: Date;
  allDay: boolean;
}

export type { Appointment };
