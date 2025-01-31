"use client";

import { BudgetCard } from "@/components/cards/BudgetCard";
import { AddBudgetModal } from "@/components/modals/add-budget/AddBudget";
import { PageHeader } from "@/components/ui/PageHeader";
import { useLazyGetBudgetsQuery } from "@/lib/services/budget.api";
import { Box, Button, SimpleGrid, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import { FiPlus } from "react-icons/fi";

export default function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [getBudgets, { data: budgets = [] }] = useLazyGetBudgetsQuery();

  useEffect(() => {
    getBudgets();
  }, [getBudgets]);

  return (
    <>
      <PageHeader text="Your budgets" />
      <Box p={8}>
        <SimpleGrid
          rowGap={4}
          columnGap={12}
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        >
          {budgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
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
            <Text>Create New Budget</Text>
          </Box>
        </SimpleGrid>
        <AddBudgetModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </>
  );
}
