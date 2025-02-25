import {
  getCurrentMonth,
  getCurrentYear,
  getWeekRange,
} from "@/lib/utils/helpers";
import { HStack, Button, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import DatePickerUI from "../ui/DatePickerUI";

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
  setCustomDate: Dispatch<
    SetStateAction<{
      start: Date | null;
      end: Date | null;
    }>
  >;
  customDate: {
    start: Date | null;
    end: Date | null;
  };
}

export const PeriodSelector = ({
  period,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedWeek,
  setSelectedWeek,
  setCustomDate,
  customDate,
}: PeriodSelectorProps) => {
  const { t } = useTranslation();

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

  const handleDateChange = (field: "start" | "end", value: Date | null) => {
    setCustomDate((prev) => ({ ...prev, [field]: value }));
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

      {period === "custom" && (
        <HStack mt={4} spacing={4}>
          <HStack spacing={4} align="center">
            <Text>{t("From")}</Text>
            <DatePickerUI
              selected={customDate.start}
              onChange={(date) => {
                if (customDate.end && date && date > customDate.end) return;
                handleDateChange("start", date);
              }}
              maxDate={customDate.end ? customDate.end : undefined}
              isClearable
              placeholderText={t("Select start date")}
            />
          </HStack>
          <HStack spacing={4} align="center">
            <Text>{t("To")}</Text>
            <DatePickerUI
              selected={customDate.end}
              onChange={(date) => {
                if (customDate.start && date && date < customDate.start) return;
                handleDateChange("end", date);
              }}
              minDate={customDate.start ? customDate.start : undefined}
              isClearable
              placeholderText={t("Select end date")}
            />
          </HStack>
        </HStack>
      )}
    </>
  );
};
