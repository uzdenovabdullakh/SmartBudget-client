type BudgetSettings = {
  currency?: "$" | "₽" | "€";
  currencyPlacement?: "before" | "after";
};

export type Budget = {
  id: string;
  name: string;
  settings: BudgetSettings;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};
