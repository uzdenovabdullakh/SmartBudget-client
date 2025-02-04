import { z } from "zod";
import i18n from "@/app/i18n";
import { AccountType } from "../constants/enums";

export const CreateUnlinkedAccountSchema = z.object({
  name: z
    .string()
    .max(128, i18n.t("validation.Nickname too long"))
    .min(1, i18n.t("validation.Nickname is required")),
  budgetId: z.string().uuid(i18n.t("validation.Invalid uuid")),
  type: z.nativeEnum(AccountType, {
    message: i18n.t("validation.Cash, card or savings"),
  }),
  amount: z
    .number({ message: i18n.t("validation.Expected number") })
    .optional()
    .default(0),
});

export type CreateUnlinkedAccountDto = z.infer<
  typeof CreateUnlinkedAccountSchema
>;
