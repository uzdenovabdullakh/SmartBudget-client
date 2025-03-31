"use client";

import {
  Box,
  HStack,
  Text,
  TabList,
  Tab,
  Tabs,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
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
import { ForeCastCard } from "@/components/cards/ForecastCard";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function Analytic() {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [period, setPeriod] = useState("month");
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [customDate, setCustomDate] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

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
        let startDate;
        let endDate;

        if (period === "custom") {
          startDate = customDate?.start;
          endDate = customDate?.end;
        } else {
          const dates = getStartAndEndDate({
            period,
            selectedYear,
            selectedMonth,
            selectedWeek,
          });
          startDate = dates.startDate;
          endDate = dates.endDate;
        }

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
    customDate?.start,
    customDate?.end,
  ]);

  if (expensesDataLoading || incomesDataLoading) {
    return <WomanWithGraphics />;
  }

  return (
    <Box maxW="2xl" mx="auto" p={{ base: 2, md: 6 }}>
      <Tabs
        index={["week", "month", "year", "custom"].indexOf(period)}
        onChange={(index) =>
          setPeriod(["week", "month", "year", "custom"][index])
        }
        mt={{ base: 12, md: "0" }}
      >
        <TabList overflowX="auto" pb={2}>
          <Tab whiteSpace="nowrap">{t("Week")}</Tab>
          <Tab whiteSpace="nowrap">{t("Month")}</Tab>
          <Tab whiteSpace="nowrap">{t("Year")}</Tab>
          <Tab whiteSpace="nowrap">{t("Custom")}</Tab>
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
        setCustomDate={setCustomDate}
        customDate={customDate}
      />

      {isMobile ? (
        <Stack spacing={6} mt={6}>
          {!expensesData?.amounts.length ? (
            <NotFoundDataAnimation loop={false} />
          ) : (
            <PieChart
              data={expensesData}
              title="Expense"
              colors={expensesColors}
            />
          )}
          {!incomesData?.amounts.length ? (
            <NotFoundDataAnimation loop={false} />
          ) : (
            <PieChart
              data={incomesData}
              title="Income"
              colors={incomesColors}
            />
          )}
        </Stack>
      ) : (
        <HStack spacing={6} mt={6} align="flex-start">
          {!expensesData?.amounts.length ? (
            <NotFoundDataAnimation loop={false} />
          ) : (
            <PieChart
              data={expensesData}
              title="Expense"
              colors={expensesColors}
            />
          )}
          {!incomesData?.amounts.length ? (
            <NotFoundDataAnimation loop={false} />
          ) : (
            <PieChart
              data={incomesData}
              title="Income"
              colors={incomesColors}
            />
          )}
        </HStack>
      )}

      <Box mt={6}>
        <ForeCastCard />
      </Box>

      {!expensesData?.amounts.length ? (
        <Box />
      ) : (
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
      )}
    </Box>
  );
}
