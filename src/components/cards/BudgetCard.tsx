import { Box, Text, HStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BaseBudget } from "@/lib/types/budget.types";
import { useTranslation } from "react-i18next";
import { BudgetCardMenuPopover } from "../popovers/budget-menu/BudgetCardMenuPopover";
import { BaseCard } from "../ui/BaseCard";

type BudgetCardProps = {
  budget: BaseBudget;
};

export function BudgetCard({ budget }: BudgetCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <BaseCard height="200px" width="250px" position="relative">
      <HStack justifyContent="space-between" alignItems="start">
        <Box onClick={() => router.push(`/dashboard/${budget.id}`)} flex={1}>
          <Text fontSize="xl" fontWeight="bold">
            {budget.name}
          </Text>
          <Text fontSize="md">
            {t("created")}: {new Date(budget.createdAt).toLocaleDateString()}
          </Text>
        </Box>
        <BudgetCardMenuPopover budget={budget} />
      </HStack>
    </BaseCard>
  );
}
