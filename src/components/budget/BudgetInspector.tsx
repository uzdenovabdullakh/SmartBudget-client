import { useBudgetInspector } from "@/lib/context/BudgetInspectorContext";
import { CategoryGroup } from "@/lib/types/category.types";
import { Box, Heading } from "@chakra-ui/react";
import { formatCurrency } from "@/lib/utils/helpers";
import { BudgetSettings } from "@/lib/types/budget.types";
import { useMemo } from "react";
import { BalanceCard } from "../cards/BalanceCard";
import { LimitCard } from "../cards/LimitCard";

type BudgetInspectorProps = {
  categoryGroups: CategoryGroup[];
  budgetSettings?: BudgetSettings;
};

export const BudgetInspector = ({
  categoryGroups,
  budgetSettings,
}: BudgetInspectorProps) => {
  const { selectedCategory } = useBudgetInspector();

  const totalAvailable = useMemo(
    () =>
      categoryGroups.reduce((sum, group) => {
        return (
          sum +
          group.categories.reduce(
            (groupSum, category) => groupSum + category.available,
            0,
          )
        );
      }, 0),
    [categoryGroups],
  );

  const totalAssigned = useMemo(
    () =>
      categoryGroups.reduce((sum, group) => {
        return (
          sum +
          group.categories.reduce(
            (groupSum, category) => groupSum + category.assigned,
            0,
          )
        );
      }, 0),
    [categoryGroups],
  );

  const totalSpent = useMemo(
    () =>
      categoryGroups.reduce((sum, group) => {
        return (
          sum +
          group.categories.reduce(
            (groupSum, category) => groupSum + category.spent,
            0,
          )
        );
      }, 0),
    [categoryGroups],
  );

  if (!selectedCategory) {
    return (
      <BalanceCard
        spent={formatCurrency(totalSpent, budgetSettings)}
        available={formatCurrency(totalAvailable, budgetSettings)}
        assigned={formatCurrency(totalAssigned, budgetSettings)}
      />
    );
  }

  const categoryAvailable = formatCurrency(
    selectedCategory?.available,
    budgetSettings,
  );

  const categoryAssigned = formatCurrency(
    selectedCategory?.assigned,
    budgetSettings,
  );

  const categorySpent = formatCurrency(selectedCategory?.spent, budgetSettings);

  return (
    <Box>
      <Heading size="md" mb={4}>
        {selectedCategory.name}
      </Heading>
      <BalanceCard
        available={categoryAvailable}
        assigned={categoryAssigned}
        spent={categorySpent}
      />
      <LimitCard category={selectedCategory} budgetSettings={budgetSettings} />
    </Box>
  );
};
