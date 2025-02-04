import i18n from "@/app/i18n";
import { z } from "zod";

export const RestoreAccountSchema = z.object({
  token: z.string().min(1, i18n.t("validation.Token is required")),
});

export type RestoreAccountDto = z.infer<typeof RestoreAccountSchema>;
