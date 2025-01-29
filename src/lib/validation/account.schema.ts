import { z } from "zod";
import { AccountType } from "../constants/enums";

export const CreateUnlinkedAccountSchema = z.object({
  name: z.string().max(128, "Nickname too long").min(1, "Nickname is required"),
  budgetId: z.string().uuid({ message: "Invalid uuid" }),
  type: z.nativeEnum(AccountType),
  amount: z.number({ message: "Excepted number" }).optional().default(0),
});

export type CreateUnlinkedAccountDto = z.infer<
  typeof CreateUnlinkedAccountSchema
>;
