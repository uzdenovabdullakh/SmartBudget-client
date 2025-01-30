import { Budget } from "@/lib/types/budget.types";
import { Box, Text, HStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BudgetCardMenuPopover } from "../popovers/budget-menu/BudgetCardMenuPopover";
import { BaseCard } from "../ui/BaseCard";

type BudgetCardProps = {
  budget: Budget;
};

export function BudgetCard({ budget }: BudgetCardProps) {
  const router = useRouter();

  return (
    <BaseCard height="200px" width="250px" position="relative">
      <HStack justifyContent="space-between" alignItems="start">
        <Box onClick={() => router.push(`/dashboard/${budget.id}`)} flex={1}>
          <Text fontSize="xl" fontWeight="bold">
            {budget.name}
          </Text>
          <Text fontSize="md">
            Created: {new Date(budget.createdAt).toLocaleDateString()}
          </Text>
        </Box>
        <BudgetCardMenuPopover budget={budget} />
      </HStack>
    </BaseCard>
  );
}
