import Gender from "src/enum/gender.enum";
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  externalId: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  cardNumber: z.string().optional().nullable(),
  searchText: z.string(),
  title: z.string().optional().nullable(),
  name: z.string(),
  surname: z.string(),
  birthDate: z.date().optional().nullable(),
  gender: z.nativeEnum(Gender),
  isActive: z.boolean(),
  createDate: z.date(),
  updateDate: z.date().optional().nullable(),
  updateUser: z.string().uuid().optional().nullable(),
  hasOneTimePw: z.boolean().optional().nullable(),
  profilePicture: z.instanceof(File).nullable().optional(),
});

const UsersSchema = z.array(UserSchema);

type User = z.infer<typeof UserSchema>;

export { UserSchema, UsersSchema };

export type { User };
