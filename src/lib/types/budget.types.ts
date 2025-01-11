export type Budget = {
  id: string;
  name: string;
  settings: {
    currency?: "USD" | "RUB" | "EUR";
    currencyPlacement?: "before" | "after";
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};
