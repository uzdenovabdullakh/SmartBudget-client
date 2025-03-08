export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  achieveDate: Date;
  updatedAt: Date;
  autoReplenishments: {
    id: string;
    percentage: number;
  } | null;
};

export type GoalWithSavings = {
  goal: Omit<Goal, "updatedAt" | "autoReplenishments">;
  savings: {
    daily: number;
    weekly: number;
    monthly: number;
  };
};
