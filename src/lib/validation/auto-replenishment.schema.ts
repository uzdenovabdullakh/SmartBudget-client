import { z } from "zod";
import i18n from "@/app/i18n";

export const CreateAutoReplenishmentSchema = z.object({
  goal: z.string().uuid(i18n.t("validation.Invalid uuid")),
  percentage: z.number().min(1).max(100),
});

export const UpdateAutoReplenishmentSchema = CreateAutoReplenishmentSchema.pick(
  {
    percentage: true,
  },
).partial();

export type CreateAutoReplenishmentDto = z.infer<
  typeof CreateAutoReplenishmentSchema
>;
export type UpdateAutoReplenishmentDto = z.infer<
  typeof UpdateAutoReplenishmentSchema
>;
