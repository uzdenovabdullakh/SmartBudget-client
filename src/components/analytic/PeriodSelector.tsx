import {
  getCurrentMonth,
  getCurrentYear,
  getWeekRange,
} from "@/lib/utils/helpers";
import { HStack, Button, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface PeriodSelectorProps {
  period: string;
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  selectedMonth: number;
  setSelectedMonth: Dispatch<SetStateAction<number>>;
  selectedWeek: { start: Date; end: Date };
  setSelectedWeek: Dispatch<
    SetStateAction<{
      start: Date;
      end: Date;
    }>
  >;
}

export const PeriodSelector = ({
  period,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedWeek,
  setSelectedWeek,
}: PeriodSelectorProps) => {
  const now = new Date();
  const currentYear = getCurrentYear();
  const currentMonth = getCurrentMonth();

  const handlePrevYear = () => setSelectedYear((prev) => prev - 1);
  const handleNextYear = () => {
    if (selectedYear < currentYear) {
      setSelectedYear((prev) => prev + 1);
    }
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 1 && selectedYear === currentYear) {
      // Если текущий месяц — январь и год равен текущему, ничего не делаем
      return;
    }
    setSelectedMonth((prev) => (prev === 1 ? 12 : prev - 1));
    if (selectedMonth === 1) setSelectedYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    if (
      selectedYear < currentYear ||
      (selectedYear === currentYear && selectedMonth < currentMonth)
    ) {
      setSelectedMonth((prev) => (prev === 12 ? 1 : prev + 1));
      if (selectedMonth === 12) setSelectedYear((prev) => prev + 1);
    }
  };

  const handlePrevWeek = () => {
    setSelectedWeek((prev) => {
      const prevWeekStart = new Date(prev.start);
      prevWeekStart.setDate(prevWeekStart.getDate() - 7);
      return getWeekRange(prevWeekStart);
    });
  };

  const handleNextWeek = () => {
    const nextWeekStart = new Date(selectedWeek.start);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    if (nextWeekStart <= now) {
      setSelectedWeek(getWeekRange(nextWeekStart));
    }
  };

  // Если текущий месяц — январь и год равен текущему, дизайблим кнопку
  const isPrevMonthDisabled =
    selectedMonth === 1 && selectedYear === currentYear;

  return (
    <>
      {period === "year" && (
        <HStack mt={4}>
          <Button onClick={handlePrevYear}>{"<"}</Button>
          <Text>{selectedYear}</Text>
          <Button
            onClick={handleNextYear}
            isDisabled={selectedYear >= currentYear}
          >
            {">"}
          </Button>
        </HStack>
      )}

      {period === "month" && (
        <HStack mt={4}>
          <Button onClick={handlePrevMonth} isDisabled={isPrevMonthDisabled}>
            {"<"}
          </Button>
          <Text>
            {new Date(selectedYear, selectedMonth - 1).toLocaleString(
              "default",
              {
                month: "long",
              },
            )}
          </Text>
          <Button
            onClick={handleNextMonth}
            isDisabled={
              selectedYear > currentYear ||
              (selectedYear === currentYear && selectedMonth >= currentMonth)
            }
          >
            {">"}
          </Button>
        </HStack>
      )}

      {period === "week" && (
        <HStack mt={4}>
          <Button onClick={handlePrevWeek}>{"<"}</Button>
          <Text>
            {selectedWeek.start.toLocaleDateString()} -{" "}
            {selectedWeek.end.toLocaleDateString()}
          </Text>
          <Button onClick={handleNextWeek} isDisabled={selectedWeek.end >= now}>
            {">"}
          </Button>
        </HStack>
      )}
    </>
  );
};
