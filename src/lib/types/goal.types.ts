export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  achieveDate: Date;
  updatedAt: Date;
};

export type GoalWithSavings = {
  goal: Omit<Goal, "updatedAt">;
  savings: {
    daily: number;
    weekly: number;
    monthly: number;
  };
};
