"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  useLazyGetBudgetInfoQuery,
  useLazyGetBudgetsQuery,
} from "@/lib/services/budget.api";
import { BudgetData } from "@/lib/types/budget.types";
import { useParams } from "next/navigation";

interface BudgetContextType {
  budget: BudgetData;
  setBudget: (budget: BudgetData) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const budgetId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [budget, setBudget] = useState<BudgetData | null>(null);
  const [getBudgets] = useLazyGetBudgetsQuery();
  const [getBudgetInfo] = useLazyGetBudgetInfoQuery();

  const fetchBudget = useCallback(async () => {
    try {
      if (!budgetId) {
        const budgetResponse = await getBudgets().unwrap();
        if (budgetResponse.length > 0) {
          setBudget(budgetResponse[0]);
        }
      } else {
        const budgetResponse = await getBudgetInfo(budgetId).unwrap();
        setBudget(budgetResponse);
      }
    } catch (error) {
      console.error("Error fetching budget:", error);
    }
  }, [budgetId, getBudgetInfo, getBudgets]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  const contextValue = useMemo(
    () => ({ budget, setBudget }),
    [budget, setBudget],
  );

  return (
    <BudgetContext.Provider value={contextValue}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgetContext() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudgetContext must be used within a BudgetProvider");
  }
  return context;
}
