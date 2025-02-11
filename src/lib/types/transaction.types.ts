import { TransactionType } from "../constants/enums";

export type Transaction = {
  amount: string;
  type: TransactionType;
  date: Date;
  description: string;
  id: string;
};

export type ListTransactions = {
  transactions: Transaction[];
  totalPages: number;
};
