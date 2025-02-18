import i18n from "@/app/i18n";
import { z } from "zod";

export const CategorySchema = z
  .object({
    name: z
      .string()
      .max(128, i18n.t("validation.Name too long"))
      .min(1, i18n.t("validation.Name is required")),
    groupId: z.string().uuid(i18n.t("validation.Invalid uuid")),
  })
  .required();

export const AssigningChangeSchema = z
  .object({
    assigned: z.number(),
  })
  .required();

export const MoveAvaliableSchema = z
  .object({
    from: z.string().uuid(i18n.t("validation.Invalid uuid")),
    to: z.string().uuid(i18n.t("validation.Invalid uuid")),
    amount: z.number(),
  })
  .required();

export const CreateCategorySchema = CategorySchema;
export const UpdateCategorySchema = CategorySchema.partial();

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
export type AssigningChangeDto = z.infer<typeof AssigningChangeSchema>;
export type MoveAvaliableDto = z.infer<typeof MoveAvaliableSchema>;
