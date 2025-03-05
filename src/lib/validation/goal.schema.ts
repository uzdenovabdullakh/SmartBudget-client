import i18n from "@/app/i18n";
import { z } from "zod";
import { Period } from "../constants/enums";

const BaseCreateGoalSchema = z.object({
  name: z
    .string()
    .max(128, i18n.t("validation.Name too long"))
    .min(1, i18n.t("validation.Name is required")),
  targetAmount: z.number().positive().min(1),
  currentAmount: z.number().positive().optional(),
  achieveDate: z.date(),
  period: z.nativeEnum(Period),
  budgetId: z.string().uuid(i18n.t("validation.Invalid uuid")),
});

export const CreateGoalSchema = BaseCreateGoalSchema;
export const UpdateGoalSchema = BaseCreateGoalSchema.partial().omit({
  budgetId: true,
});

export type CreateGoalDto = z.infer<typeof CreateGoalSchema>;
export type UpdateGoalDto = z.infer<typeof UpdateGoalSchema>;
