import { Category } from "./category.types";

export type Transaction = {
  date: string;
  description: string | null;
  id: string;
  category: Pick<Category, "id" | "name"> | null;
  outflow: number | null;
  inflow: number | null;
};

export type ListTransactions = {
  transactions: Transaction[];
  totalPages: number;
};
