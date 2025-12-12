import { z } from 'zod';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const userQuerySchema = z.object({
  q: z.string().optional(),
  role: z.enum(['all', 'admin', 'editor', 'user']).optional().default('all'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export const userParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type UserQuery = z.infer<typeof userQuerySchema>;
export type UserParams = z.infer<typeof userParamsSchema>;
