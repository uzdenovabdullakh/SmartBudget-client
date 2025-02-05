import i18n from "@/app/i18n";
import { z } from "zod";

export const OauthSchema = z
  .object({
    email: z.string().email(i18n.t("validation.Invalid email address")),
    login: z.string(),
    yandexId: z.string(),
  })
  .required();

export type OauthDto = z.infer<typeof OauthSchema>;
