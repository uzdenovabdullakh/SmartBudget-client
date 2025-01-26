export type Account = {
  id: string;
  name: string;
  amount: string;
  createdAt: Date;
  type: string;
};

export type AccountsResult = {
  accounts: Account[];
  totalPages: number;
  totalBalance: string;
};
