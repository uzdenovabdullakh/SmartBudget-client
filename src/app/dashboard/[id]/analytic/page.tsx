"use client";

import { Box, HStack, Text, TabList, Tab, Tabs } from "@chakra-ui/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  useLazyGetExpensesByCategoryQuery,
  useLazyGetIncomesByCategoryQuery,
} from "@/lib/services/analytic.api";
import { useState, useEffect } from "react";
import {
  generateRandomColor,
  getCurrentMonth,
  getCurrentWeek,
  getCurrentYear,
  getStartAndEndDate,
} from "@/lib/utils/helpers";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import {
  NotFoundDataAnimation,
  WomanWithGraphics,
} from "@/components/ui/Animations";
import { useTranslation } from "react-i18next";
import { PieChart } from "@/components/analytic/PieChart";
import { ExpensesTable } from "@/components/analytic/ExpensesTable";
import { AnalyticResponseDto } from "@/lib/types/analytic.types";
import { PeriodSelector } from "@/components/analytic/PeriodSelector";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function Analytic() {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();

  const [period, setPeriod] = useState("month");
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());

  const [expensesData, setExpensesData] = useState<AnalyticResponseDto | null>(
    null,
  );
  const [incomesData, setIncomesData] = useState<AnalyticResponseDto | null>(
    null,
  );

  const [fetchExpenses, { isLoading: expensesDataLoading }] =
    useLazyGetExpensesByCategoryQuery();
  const [fetchIncomes, { isLoading: incomesDataLoading }] =
    useLazyGetIncomesByCategoryQuery();

  const expensesColors =
    expensesData?.categories.map(() => generateRandomColor()) || [];
  const incomesColors =
    incomesData?.categories.map(() => generateRandomColor()) || [];

  useEffect(() => {
    if (budget?.id) {
      const loadData = async () => {
        const { startDate, endDate } = getStartAndEndDate({
          period,
          selectedYear,
          selectedMonth,
          selectedWeek,
        });

        const [expensesResponse, incomesResponse] = await Promise.all([
          fetchExpenses({
            budgetId: budget.id,
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
          }).unwrap(),
          fetchIncomes({
            budgetId: budget.id,
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
          }).unwrap(),
        ]);

        setExpensesData(expensesResponse);
        setIncomesData(incomesResponse);
      };

      loadData();
    }
  }, [
    period,
    budget?.id,
    selectedYear,
    selectedMonth,
    selectedWeek,
    fetchExpenses,
    fetchIncomes,
  ]);

  if (expensesDataLoading || incomesDataLoading) {
    return <WomanWithGraphics />;
  }

  if (!expensesData || !incomesData) {
    return <NotFoundDataAnimation />;
  }

  return (
    <Box maxW="2xl" mx="auto" p={{ base: 4, md: 6 }}>
      <Tabs
        index={["week", "month", "year"].indexOf(period)}
        onChange={(index) => setPeriod(["week", "month", "year"][index])}
      >
        <TabList>
          <Tab>{t("Week")}</Tab>
          <Tab>{t("Month")}</Tab>
          <Tab>{t("Year")}</Tab>
        </TabList>
      </Tabs>

      <PeriodSelector
        period={period}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
      />

      <HStack spacing={6} mt={6}>
        <PieChart data={expensesData} title="Expense" colors={expensesColors} />
        <PieChart data={incomesData} title="Income" colors={incomesColors} />
      </HStack>

      <Box mt={6}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          {t("Expenses Details")}
        </Text>
        <ExpensesTable
          data={expensesData}
          colors={expensesColors}
          budgetSettings={budget?.settings}
        />
      </Box>
    </Box>
  );
}
