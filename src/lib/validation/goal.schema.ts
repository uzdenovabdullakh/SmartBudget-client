import i18n from "@/app/i18n";
import { z } from "zod";

const BaseCreateGoalSchema = z.object({
  name: z
    .string()
    .max(128, i18n.t("validation.Name too long"))
    .min(1, i18n.t("validation.Name is required")),
  targetAmount: z.number().positive().min(1),
  currentAmount: z.number().nonnegative().optional(),
  achieveDate: z.string(),
});

export const CreateGoalSchema = BaseCreateGoalSchema;
export const UpdateGoalSchema = BaseCreateGoalSchema.partial();

export type CreateGoalDto = z.infer<typeof CreateGoalSchema>;
export type UpdateGoalDto = z.infer<typeof UpdateGoalSchema>;
