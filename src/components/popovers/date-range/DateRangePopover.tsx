import { useState } from "react";
import {
  Text,
  Button,
  HStack,
  VStack,
  useDisclosure,
  useBreakpointValue,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react";
import { DateRange, PredefinedRange } from "@/lib/types/types";
import { getDateRange } from "@/lib/utils/helpers";
import { useTranslation } from "react-i18next";
import DatePickerUI from "@/components/ui/DatePickerUI";
import { IoFilter } from "react-icons/io5";
import { BasePopover } from "..";

type DateRangePopoverProps = {
  applyDate: (data: DateRange) => void;
};

export const DateRangePopover = ({ applyDate }: DateRangePopoverProps) => {
  const { t } = useTranslation();

  const { isOpen, onToggle, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

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

  const popoverWidth = useBreakpointValue({
    base: "90vw", // На мобильных устройствах занимает 90% ширины экрана
    md: "600px", // На планшетах и выше - фиксированная ширина
  });

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
    onClose();
    resetState();
  };

  const triggerButton = isMobile ? (
    <IconButton
      aria-label="Open views"
      icon={<IoFilter />}
      onClick={onToggle}
    />
  ) : (
    <Button pr={6} pl={6} onClick={onToggle}>
      {t("View Options")}
    </Button>
  );

  const bodyContent = (
    <VStack spacing={6} align="stretch" w="full">
      <SimpleGrid columns={2} spacing={2}>
        {predefinedRanges.map((range) => (
          <Button
            key={range}
            variant={selectedRange === range ? "solid" : "outline"}
            onClick={() => handleRangeSelection(range)}
            size="sm"
            whiteSpace="normal"
            height="auto"
            py={2}
          >
            {t(range)}
          </Button>
        ))}
      </SimpleGrid>

      {selectedRange === "Custom" && (
        <VStack spacing={4} align="stretch">
          <HStack spacing={2} align="center" wrap="wrap">
            <Text minW="50px">{t("From")}</Text>
            <DatePickerUI
              selected={dateRange.from}
              onChange={(date) => {
                if (dateRange.to && date && date > dateRange.to) return;
                handleDateChange("from", date);
              }}
              maxDate={dateRange.to ? dateRange.to : undefined}
              isClearable
              placeholderText={t("Select start date")}
            />
          </HStack>
          <HStack spacing={2} align="center" wrap="wrap">
            <Text minW="50px">{t("To")}</Text>
            <DatePickerUI
              selected={dateRange.to}
              onChange={(date) => {
                if (dateRange.from && date && date < dateRange.from) return;
                handleDateChange("to", date);
              }}
              minDate={dateRange.from ? dateRange.from : undefined}
              isClearable
              placeholderText={t("Select end date")}
            />
          </HStack>
        </VStack>
      )}
    </VStack>
  );

  return (
    <BasePopover
      triggerButton={triggerButton}
      isOpen={isOpen}
      onClose={() => {
        resetState();
        onClose();
      }}
      contentProps={{
        minW: popoverWidth,
        maxW: popoverWidth,
        w: "auto",
      }}
      bodyProps={{ minH: "130px", p: 3 }}
      headerText={t("View Options")}
      bodyContent={bodyContent}
      onApply={handleApply}
      onCancel={() => {
        resetState();
        onClose();
      }}
    />
  );
};
