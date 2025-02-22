export type Currency = "$" | "₽" | "€";
export type CurrencyPlacement = "before" | "after";

export type BudgetSettings = {
  currency?: Currency;
  currencyPlacement?: CurrencyPlacement;
};

export type BaseBudget = {
  id: string;
  name: string;
  createdAt: Date;
  settings: BudgetSettings;
};

export type BudgetData = BaseBudget | null;
