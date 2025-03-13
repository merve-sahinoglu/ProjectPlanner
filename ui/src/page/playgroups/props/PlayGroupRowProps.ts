type PlayGroupRowProps = {
  id: string;
  name: string;
  minAge: number; // Minimum yaş
  maxAge: number; // Maksimum yaş
  maxParticipants: number; // Maksimum kişi sayısı
  playgroupTherapists: PlaygroupTherapist[];
  isActive: boolean;
};

type PlaygroupTherapist = {
  id: string;
  therapistId: string;
  therapistName: string;
};

type PlayGroupResponse = Omit<PlayGroupRowProps, "PlayGroupTypeId"> & {
  PlayGroupTypeId: number;
};

export type { PlayGroupRowProps, PlayGroupResponse };
