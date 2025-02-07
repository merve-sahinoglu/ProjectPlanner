import { z } from "zod";

const InstructorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  surname: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  type: z.union([
    z.literal("dil terapisi"),
    z.literal("müzik terapisi"),
    z.literal("özel eğitim"),
  ]),
  profilePicture: z.instanceof(File).nullable().optional(),
});

type Instructor = z.infer<typeof InstructorSchema>;

export type { Instructor };
