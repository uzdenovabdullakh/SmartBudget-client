import { z } from "zod";
import i18n from "@/app/i18n";
import { passwordSchema } from "./password.schema";

export const ConfirmSignUpSchema = z
  .object({
    token: z.string().min(1, i18n.t("validation.Token is required")),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: i18n.t("validation.Passwords must match"),
    path: ["confirmPassword"],
  });

export type ConfirmSignUpDto = z.infer<typeof ConfirmSignUpSchema>;
