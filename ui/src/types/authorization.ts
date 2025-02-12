import { z } from 'zod';

const AuthorizationSchema = z.object({
  id: z.string().uuid(),
  parentId: z.string().uuid().optional(),
  application: z.string().uuid(),
  name: z.string(),
  route: z.string().optional(),
  authorizationCode: z.string().optional(),
  menuOrder: z.number().optional(),
  iconType: z.number().optional(),
});

type Authorization = z.infer<typeof AuthorizationSchema>;

export { AuthorizationSchema };
export type { Authorization };
