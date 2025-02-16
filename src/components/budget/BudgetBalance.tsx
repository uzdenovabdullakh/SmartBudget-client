import { useGetDefaultCategoryQuery } from "@/lib/services/category.api";
import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { FaWallet } from "react-icons/fa";
import { useParams } from "next/navigation";
import { useGetBudgetInfoQuery } from "@/lib/services/budget.api";
import { useMemo } from "react";
import { SkeletonUI } from "../ui/SkeletonUI";

export const BudgetBalance = () => {
  const params = useParams();
  const budgetId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const { data: budgetBalance, isLoading } = useGetDefaultCategoryQuery(
    budgetId!,
    {
      skip: !budgetId,
    },
  );
  const { data: budgetInfo } = useGetBudgetInfoQuery(budgetId!, {
    skip: !budgetId,
  });

  const balance = useMemo(
    () =>
      budgetInfo?.settings.currencyPlacement === "before"
        ? `${budgetInfo?.settings.currency}${budgetBalance?.available}`
        : `${budgetBalance?.available}${budgetInfo?.settings.currency}`,
    [
      budgetBalance?.available,
      budgetInfo?.settings.currency,
      budgetInfo?.settings.currencyPlacement,
    ],
  );

  return (
    <Box
      bg={isLoading ? "gray.100" : "green.100"}
      p={2}
      borderRadius="lg"
      boxShadow="sm"
    >
      <HStack spacing={3} align="center">
        <Box color="green.600">
          <FaWallet size="24px" />
        </Box>
        {isLoading ? (
          <VStack spacing={1} align="flex-start">
            <SkeletonUI height="24px" width="100px" />
            <SkeletonUI height="16px" width="80px" />
          </VStack>
        ) : (
          <VStack spacing={1} align="flex-start">
            <Text fontSize="lg" fontWeight="bold" color="green.800">
              {balance}
            </Text>
            <Text fontSize="sm" color="green.600">
              {budgetBalance?.name}
            </Text>
          </VStack>
        )}
      </HStack>
    </Box>
  );
};
