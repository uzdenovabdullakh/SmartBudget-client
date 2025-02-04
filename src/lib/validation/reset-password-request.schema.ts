import i18n from "@/app/i18n";
import { z } from "zod";

export const ResetPasswordRequestSchema = z
  .object({
    email: z.string().email(i18n.t("validation.Invalid email address")),
  })
  .required();

export type ResetPasswordRequestDto = z.infer<
  typeof ResetPasswordRequestSchema
>;
