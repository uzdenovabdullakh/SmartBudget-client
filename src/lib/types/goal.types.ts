import { Period } from "../constants/enums";

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  achieveDate: Date;
  period: Period;
};

export type GoalsResult = {
  accounts: Goal[];
  totalPages: number;
};
