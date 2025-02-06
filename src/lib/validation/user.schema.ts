import { z } from "zod";

export const UpdateUserSchema = z.object({
  login: z.string().min(3).max(64).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
