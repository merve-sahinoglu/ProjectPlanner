interface UserRowProps {
  id: string;
  userName: string;
  email: string;
  password?: string | null | undefined;
  cardNumber?: string | null;
  searchText: string;
  title?: string | null;
  name: string;
  surname: string;
  birthDate?: Date | null;
  gender: string;
  isActive: boolean;
  profilePicture?: File | null;
}

export type { UserRowProps };
