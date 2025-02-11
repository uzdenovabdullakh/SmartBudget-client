import i18n from "@/app/i18n";
import { z } from "zod";
import { TransactionType } from "../constants/enums";

const transactionSchema = z.object({
  amount: z.number({ message: i18n.t("validation.Expected number") }),
  type: z.nativeEnum(TransactionType),
  description: z.string(),
  date: z.string(),
  accountId: z.string().uuid(i18n.t("validation.Invalid uuid")),
});

export const CreateTransactionSchema = transactionSchema;
export const UpdateTransactionSchema = transactionSchema
  .partial()
  .omit({ accountId: true });

export const GetTransactionsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.string().uuid(i18n.t("validation.Invalid uuid")).optional(),
  type: z.nativeEnum(TransactionType).optional(),
});

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;
export type GetTransactionsQuery = z.infer<typeof GetTransactionsSchema>;
