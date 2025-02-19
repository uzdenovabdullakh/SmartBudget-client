import i18n from "@/app/i18n";
import { z } from "zod";

const baseTransactionSchema = z.object({
  inflow: z
    .number()
    .optional()
    .nullable()
    .transform((data) => {
      if (Number.isNaN(data)) {
        return null;
      }
      return data;
    }),
  outflow: z
    .number()
    .optional()
    .nullable()
    .transform((data) => {
      if (Number.isNaN(data)) {
        return null;
      }
      return data;
    }),
  description: z.string().optional().nullable(),
  date: z.string(),
  category: z
    .string()
    .uuid(i18n.t("validation.Invalid uuid"))
    .optional()
    .nullable()
    .transform((data) => {
      if (!data) {
        return null;
      }
      return data;
    }),
  accountId: z.string().uuid(i18n.t("validation.Invalid uuid")),
});

export const CreateTransactionSchema = baseTransactionSchema;

export const UpdateTransactionSchema = baseTransactionSchema
  .partial()
  .omit({ accountId: true });

export const GetTransactionsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.string().uuid(i18n.t("validation.Invalid uuid")).optional(),
});

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;
export type GetTransactionsQuery = z.infer<typeof GetTransactionsSchema>;
