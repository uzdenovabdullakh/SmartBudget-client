import i18n from "@/app/i18n";
import { z } from "zod";

export const CreateCategoryGroupSchema = z
  .object({
    name: z
      .string()
      .max(128, i18n.t("validation.Name too long"))
      .min(1, i18n.t("validation.Name is required")),
    budgetId: z.string().uuid(i18n.t("validation.Invalid uuid")),
  })
  .required();

export const UpdateCategoryGroupSchema =
  CreateCategoryGroupSchema.partial().pick({ name: true });

export type CreateCategoryGroupDto = z.infer<typeof CreateCategoryGroupSchema>;
export type UpdateCategoryGroupDto = z.infer<typeof UpdateCategoryGroupSchema>;
