import { z } from "zod";
import { passwordSchema } from "./password.schema";

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: "Token is required" }),
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords must match",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
