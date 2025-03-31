"use client";

import { format } from "date-fns";
import { PageHeader } from "@/components/ui/PageHeader";
import { ru, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { BudgetBalance } from "@/components/budget/BudgetBalance";
import { BudgetCategories } from "@/components/budget/BudgetCategories";
import { CategoryPanel } from "@/components/budget/CategoryPanel";
import { CategoryFilter } from "@/lib/constants/enums";
import { Box, useBreakpointValue } from "@chakra-ui/react";

export default function Budget() {
  const { i18n } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const [date, setDate] = useState("");
  const [activeFilter, setActiveFilter] = useState<CategoryFilter | null>(null);

  useEffect(() => {
    const locale = i18n.language === "ru" ? ru : enUS;
    const formattedDate = format(new Date(), "MMM yyyy", { locale });

    setDate(formattedDate);
  }, [i18n.language]);

  return (
    <>
      <PageHeader
        text={date}
        buttons={isMobile ? undefined : <BudgetBalance />}
      />
      {isMobile && (
        <Box pl={16} pr={16}>
          <BudgetBalance />
        </Box>
      )}
      <CategoryPanel onFilterChange={setActiveFilter} />
      <BudgetCategories filter={activeFilter} />
    </>
  );
}
