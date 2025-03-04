import { CategoryLimit } from "./category-limit.types";

export type Category = {
  id: string;
  name: string;
  assigned: number;
  spent: number;
  available: number;
  order: number;
  categorySpending: Pick<CategoryLimit, "limitAmount" | "spentAmount"> | null;
};

export type CategoryGroup = {
  id: string;
  name: string;
  order: number;
  categories: Category[];
};
