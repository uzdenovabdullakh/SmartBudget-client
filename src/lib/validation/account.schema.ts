import { z } from "zod";
import { UnlinkedAccountType } from "../constants/enums";

export const CreateUnlinkedAccountSchema = z.object({
  name: z.string().max(128, "Nickname too long").min(1, "Nickname is required"),
  budgetId: z.string().uuid({ message: "Invalid uuid" }),
  type: z.nativeEnum(UnlinkedAccountType),
  amount: z.number({ message: "Excepted number" }).optional().default(0),
});

export type CreateUnlinkedAccountDto = z.infer<
  typeof CreateUnlinkedAccountSchema
>;
