"use client";

import { format } from "date-fns";
import { PageHeader } from "@/components/ui/PageHeader";
import { ru, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { BudgetBalance } from "@/components/budget/BudgetBalance";
import { BudgetCategories } from "@/components/budget/BudgetCategories";

export default function Budget() {
  const { i18n } = useTranslation();

  const [date, setDate] = useState("");

  useEffect(() => {
    const locale = i18n.language === "ru" ? ru : enUS;
    const formattedDate = format(new Date(), "MMM yyyy", { locale });

    setDate(formattedDate);
  }, [i18n.language]);

  return (
    <>
      <PageHeader text={date} buttons={<BudgetBalance />} />
      <BudgetCategories />
    </>
  );
}
