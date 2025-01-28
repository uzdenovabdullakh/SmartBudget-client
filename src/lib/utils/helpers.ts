import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
} from "date-fns";
import { DateRange, PredefinedRange } from "../types/types";

export const getDateRange = (range: PredefinedRange): DateRange => {
  const now = new Date();

  const periodCalculationMap: Record<string, () => DateRange> = {
    "This month": () => ({
      from: startOfMonth(now),
      to: endOfMonth(now),
    }),
    "Latest 3 Months": () => {
      const to = endOfMonth(subMonths(now, 1));
      const from = startOfMonth(subMonths(to, 2));
      return { from, to };
    },
    "This Year": () => ({
      from: startOfYear(now),
      to: endOfYear(now),
    }),
  };

  const selectedRange = periodCalculationMap[range];

  return selectedRange();
};
