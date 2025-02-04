import { z } from "zod";
import i18n from "@/app/i18n";
import { passwordSchema } from "./password.schema";

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, i18n.t("validation.Token is required")),
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: i18n.t("validation.Passwords must match"),
    path: ["confirmNewPassword"],
  });

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
