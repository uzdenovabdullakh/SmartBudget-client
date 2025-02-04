import i18n from "@/app/i18n";
import { z } from "zod";

export const TokenSchema = z
  .object({
    refreshToken: z.string().min(1, i18n.t("validation.Token is required")),
  })
  .required();

export type TokenDto = z.infer<typeof TokenSchema>;
