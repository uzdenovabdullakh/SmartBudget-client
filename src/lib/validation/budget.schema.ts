import i18n from "@/app/i18n";
import { z } from "zod";

const BudgetSettingsSchema = z.object({
  currency: z.enum(["USD", "RUB", "EUR"]),
  currencyPlacement: z.enum(["before", "after"]),
});

export const CreateBudgetSchema = z.object({
  name: z
    .string()
    .max(128, i18n.t("validation.Nickname too long"))
    .min(1, i18n.t("validation.Nickname is required")),
  settings: BudgetSettingsSchema.optional(),
});

export const UpdateBudgetSchema = CreateBudgetSchema.partial();

export type CreateBudgetDto = z.infer<typeof CreateBudgetSchema>;
export type UpdateBudgetDto = z.infer<typeof UpdateBudgetSchema>;
