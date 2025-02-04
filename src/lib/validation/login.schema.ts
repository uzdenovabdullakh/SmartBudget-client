import { z } from "zod";
import i18n from "@/app/i18n";
import { passwordSchema } from "./password.schema";

export const LoginSchema = z
  .object({
    email: z.string().email(i18n.t("validation.Invalid email address")),
    password: passwordSchema,
  })
  .required();

export type LoginDto = z.infer<typeof LoginSchema>;
