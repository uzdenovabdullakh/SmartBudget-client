import i18n from "@/app/i18n";
import { z } from "zod";

export const RestoreAccountRequestSchema = z
  .object({
    email: z
      .string()
      .email(i18n.t("validation.Invalid email address"))
      .max(64, i18n.t("validation.Email is too long")),
  })
  .required();

export type RestoreAccountRequestDto = z.infer<
  typeof RestoreAccountRequestSchema
>;
