import { z } from "zod";
import { TokenType } from "../types/auth.types";

export const ResendEmailSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    type: z.nativeEnum(TokenType),
  })
  .required();

export type ResendEmailDto = z.infer<typeof ResendEmailSchema>;
