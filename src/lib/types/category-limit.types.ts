import { Period } from "../constants/enums";

export type CategoryLimit = {
  id: string;
  spentAmount: number;
  periodStart: Date;
  periodEnd: Date;
  limitAmount: number;
  limitResetPeriod: Period;
};
