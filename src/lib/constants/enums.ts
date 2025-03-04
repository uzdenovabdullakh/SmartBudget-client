export enum AccountType {
  CASH = "cash",
  CARD = "card",
  SAVINGS = "savings",
}

export enum BudgetCurrency {
  USD = "USD",
  RUB = "RUB",
  EUR = "EUR",
}

export enum CurrencyPlacement {
  BEFORE = "before",
  AFTER = "after",
}

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export enum Period {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export enum CategoryFilter {
  SPENT = "spent",
  AVAILABLE = "available",
  LIMIT_REACHED = "limit_reached",
  ASSIGNED = "assigned",
}
