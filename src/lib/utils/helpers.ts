import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
} from "date-fns";
import i18n from "@/app/i18n";
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

export const transactionsTableReduce = (state: any, action: any) => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, currentPage: action.page };
    case "SET_EDITING":
      return {
        ...state,
        editingCell: action.payload,
        editedValue: action.payload?.value || "",
      };
    case "SET_SELECTED":
      return { ...state, selected: action.selected };
    case "UPDATE_VALUE":
      return { ...state, editedValue: action.value };
    default:
      return state;
  }
};

export const formatCurrency = (
  value: number = 0,
  currency: string = "$",
  placement: "before" | "after" = "before",
) => {
  const formattedAmount = new Intl.NumberFormat(i18n.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return placement === "before"
    ? `${currency}${formattedAmount}`
    : `${formattedAmount}${currency}`;
};
