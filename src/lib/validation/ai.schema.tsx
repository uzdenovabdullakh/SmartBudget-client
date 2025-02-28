import i18n from "@/app/i18n";
import { z } from "zod";

export const AutoCategorizeSchema = z.object({
  accountId: z.string().uuid(i18n.t("validation.Invalid uuid")),
});
export const ProvideFinancialAdviceSchema = z.object({
  message: z.string(),
  budgetId: z.string().uuid(i18n.t("validation.Invalid uuid")),
});

export type ProvideFinancialAdviceDto = z.infer<
  typeof ProvideFinancialAdviceSchema
>;
export type AutoCategorizeDto = z.infer<typeof AutoCategorizeSchema>;
