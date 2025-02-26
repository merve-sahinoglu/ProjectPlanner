export enum RoomType {
  Single = "Single",
  Double = "Double",
}

type RoomRowProps = {
  id: string;
  name: string;
  description: string;
  maxCapacity: number;
  isAvailable: boolean;
  roomTypeId: string;
  amenities: string[];
};

type RoomResponse = Omit<RoomRowProps, "roomTypeId"> & {
  roomTypeId: number;
};

export type { RoomRowProps, RoomResponse };
