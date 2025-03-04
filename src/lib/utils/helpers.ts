import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
} from "date-fns";
import i18n from "@/app/i18n";
import { DateRange, PredefinedRange } from "../types/types";
import { BudgetSettings } from "../types/budget.types";

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

// NOTE - try use i18next to currency and number formatting https://www.i18next.com/translation-function/formatting
export const formatCurrency = (
  value: number = 0,
  settings?: BudgetSettings,
) => {
  const { currency = "$", currencyPlacement = "before" } = settings || {};

  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);

  const formattedAmount = new Intl.NumberFormat(i18n.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absoluteValue);

  if (isNegative) {
    return currencyPlacement === "before"
      ? `-${currency}${formattedAmount}`
      : `-${formattedAmount}${currency}`;
  }

  return currencyPlacement === "before"
    ? `${currency}${formattedAmount}`
    : `${formattedAmount}${currency}`;
};

export const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const getWeekRange = (date: Date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
};

export const getCurrentWeek = () => getWeekRange(new Date());

export const getCurrentMonth = () => {
  const now = new Date();
  return now.getMonth() + 1;
};

export const getCurrentYear = () => {
  const now = new Date();
  return now.getFullYear();
};

export const getStartAndEndDate = ({
  period,
  selectedYear,
  selectedMonth,
  selectedWeek,
}: {
  period: string;
  selectedYear: number;
  selectedMonth: number;
  selectedWeek: { start: Date; end: Date };
}) => {
  let startDate;
  let endDate;

  if (period === "year") {
    startDate = new Date(selectedYear, 0, 1);
    endDate = new Date(selectedYear, 11, 31);
  } else if (period === "month") {
    startDate = new Date(selectedYear, selectedMonth - 1, 1);
    endDate = new Date(selectedYear, selectedMonth, 0);
  } else if (period === "week") {
    startDate = selectedWeek.start;
    endDate = selectedWeek.end;
  }

  return { startDate, endDate };
};

export const getCurrencyColorStyles = (cur: number) => {
  if (cur === 0) {
    return {
      bgColor: "#edf1f5",
      color: "#6e7a88",
    };
  }
  if (cur > 0) {
    return {
      bgColor: "#c1ee9f",
      color: "#1d300d",
    };
  }
  return {
    bgColor: "#faada5",
    color: "#3c0d09",
  };
};
