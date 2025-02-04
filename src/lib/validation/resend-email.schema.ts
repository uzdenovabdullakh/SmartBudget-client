import { z } from "zod";
import i18n from "@/app/i18n";
import { TokenType } from "../types/auth.types";

export const ResendEmailSchema = z
  .object({
    email: z.string().email(i18n.t("validation.Invalid email address")),
    type: z.nativeEnum(TokenType),
  })
  .required();

export type ResendEmailDto = z.infer<typeof ResendEmailSchema>;
