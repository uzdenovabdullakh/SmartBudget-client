import { createContext, useContext, useMemo, useState } from "react";
import { Category } from "../types/category.types";

type BudgetInspectorContextType = {
  selectedCategory: Category | null;
  setSelectedCategory: (categogry: Category | null) => void;
};

const BudgetInspectorContext = createContext<BudgetInspectorContextType | null>(
  null,
);

export const useBudgetInspector = () => {
  const context = useContext(BudgetInspectorContext);
  if (!context) {
    throw new Error(
      "useBudgetInspector must be used within a BudgetInspectorProvider",
    );
  }
  return context;
};

export const BudgetInspectorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const contextValue = useMemo(
    () => ({ selectedCategory, setSelectedCategory }),
    [selectedCategory],
  );

  return (
    <BudgetInspectorContext.Provider value={contextValue}>
      {children}
    </BudgetInspectorContext.Provider>
  );
};
