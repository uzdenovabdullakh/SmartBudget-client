import i18n from "@/app/i18n";
import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .email(i18n.t("validation.Invalid email address"))
      .max(64, i18n.t("validation.Email is too long")),
    login: z
      .string()
      .min(3, i18n.t("validation.Login is too short"))
      .max(64, i18n.t("validation.Login is too long")),
  })
  .required();

export type RegisterDto = z.infer<typeof RegisterSchema>;
