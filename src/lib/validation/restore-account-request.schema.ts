import { z } from "zod";

export const RestoreAccountRequestSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }).max(64),
  })
  .required();

export type RestoreAccountRequestDto = z.infer<
  typeof RestoreAccountRequestSchema
>;
