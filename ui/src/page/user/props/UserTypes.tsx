type UserRowProps = {
  id: string;
  relativeId?: string | null | undefined;
  relativeName?: string | null | undefined;
  userName: string;
  email: string;
  password?: string | null | undefined;
  cardNumber?: string | null;
  searchText: string;
  typeId?: string | null;
  name: string;
  surname: string;
  birthDate?: Date | null;
  gender: string;
  isActive: boolean;
  profilePicture?: File | null | string | Blob | number[];
};

type UserResponse = Omit<UserRowProps, "typeId"> & {
  typeId: number;
};

const getNewItem = (): UserRowProps => {
  const id = crypto.randomUUID();
  return {
    id: id,
    userName: "",
    email: "",
    password: null,
    cardNumber: null,
    searchText: "",
    name: "",
    surname: "",
    birthDate: null,
    gender: "0",
    isActive: true,
    relativeId: "",
    typeId: "0",
  };
};

export type { UserResponse, UserRowProps };

    export { getNewItem };

