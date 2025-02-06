interface Appointment {
  id: number;
  appointmenId: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

export type { Appointment };
