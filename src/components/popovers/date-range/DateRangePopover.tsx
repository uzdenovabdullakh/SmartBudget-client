import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Text, Button, HStack, VStack, useDisclosure } from "@chakra-ui/react";
import { DateRange, PredefinedRange } from "@/lib/types/types";
import { getDateRange } from "@/lib/utils/helpers";
import { BasePopover } from "..";

type DateRangePopoverProps = {
  applyDate: (data: DateRange) => void;
};

export const DateRangePopover = ({ applyDate }: DateRangePopoverProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [selectedRange, setSelectedRange] = useState<PredefinedRange | "">("");

  const predefinedRanges: PredefinedRange[] = [
    "This month",
    "Latest 3 Months",
    "This Year",
    "Custom",
  ];

  const resetState = () => {
    setDateRange({
      from: null,
      to: null,
    });
    setSelectedRange("");
  };

  const handleRangeSelection = (range: PredefinedRange) => {
    if (range !== "Custom") {
      const { from, to } = getDateRange(range);

      setDateRange({
        from,
        to,
      });
    }
    setSelectedRange(range);
  };

  const handleDateChange = (field: keyof DateRange, value: Date | null) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    applyDate(dateRange);
    resetState();
  };

  const triggerButton = (
    <Button pr={6} pl={6} onClick={onToggle}>
      View Options
    </Button>
  );

  const bodyContent = (
    <VStack spacing={6} align="stretch">
      <HStack spacing={4} justify="center">
        {predefinedRanges.map((range) => (
          <Button
            key={range}
            variant={selectedRange === range ? "solid" : "outline"}
            onClick={() => handleRangeSelection(range)}
            flex="1"
          >
            {range}
          </Button>
        ))}
      </HStack>

      {selectedRange === "Custom" && (
        <HStack spacing={4} justifyContent="space-between">
          <HStack spacing={4} align="center">
            <Text>From:</Text>
            <DatePicker
              selected={dateRange.from}
              onChange={(date) => {
                if (dateRange.to && date && date > dateRange.to) return;
                handleDateChange("from", date);
              }}
              maxDate={dateRange.to ? dateRange.to : undefined}
              isClearable
              placeholderText="Select start date"
            />
          </HStack>
          <HStack spacing={4} align="center">
            <Text>To:</Text>
            <DatePicker
              selected={dateRange.to}
              onChange={(date) => {
                if (dateRange.from && date && date < dateRange.from) return;
                handleDateChange("to", date);
              }}
              minDate={dateRange.from ? dateRange.from : undefined}
              isClearable
              placeholderText="Select end date"
            />
          </HStack>
        </HStack>
      )}
    </VStack>
  );

  return (
    <BasePopover
      triggerButton={triggerButton}
      isOpen={isOpen}
      onClose={onClose}
      contentProps={{ minW: "600px" }}
      bodyProps={{ minH: "130px" }}
      headerText="View Options"
      bodyContent={bodyContent}
      onApply={handleApply}
      onCancel={resetState}
    />
  );
};
