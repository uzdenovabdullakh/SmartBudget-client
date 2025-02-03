"use client";

import { BudgetCard } from "@/components/cards/BudgetCard";
import { AddBudgetModal } from "@/components/modals/add-budget/AddBudget";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkeletonUI } from "@/components/ui/SkeletonUI";
import { useGetBudgetsQuery } from "@/lib/services/budget.api";
import { Box, Button, SimpleGrid, Text, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";

export default function Dashboard() {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: budgets = [], isLoading } = useGetBudgetsQuery();

  return (
    <>
      <PageHeader text={t("budgets_header")} />
      <Box p={8}>
        <SimpleGrid minChildWidth="3xs" columnGap={6} rowGap={4}>
          {isLoading ? (
            <SkeletonUI length={4} height="200px" width="250px" />
          ) : (
            budgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))
          )}
          <Box
            as={Button}
            onClick={onOpen}
            colorScheme="blue"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="200px"
            width="250px"
            gap={2}
            cursor="pointer"
          >
            <FiPlus size={32} />
            <Text>{t("create_budget")}</Text>
          </Box>
        </SimpleGrid>
        <AddBudgetModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </>
  );
}
