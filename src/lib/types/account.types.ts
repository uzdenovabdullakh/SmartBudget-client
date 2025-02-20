export type Account = {
  id: string;
  name: string;
  amount: number;
  createdAt: Date;
  type: string;
};

export type AccountsResult = {
  accounts: Account[];
  totalPages: number;
  totalBalance: number;
};
