import { z } from "zod";
import i18n from "@/app/i18n";
import { passwordSchema } from "./password.schema";

export const ChangePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .required()
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: i18n.t("validation.Passwords must match"),
    path: ["confirmNewPassword"],
  });

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
