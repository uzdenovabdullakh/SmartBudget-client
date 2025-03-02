import { useGetDefaultCategoryQuery } from "@/lib/services/category.api";
import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { FaWallet } from "react-icons/fa";
import { formatCurrency, getCurrencyColorStyles } from "@/lib/utils/helpers";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { useMemo } from "react";
import { SkeletonUI } from "../ui/SkeletonUI";

export const BudgetBalance = () => {
  const { budget } = useBudgetContext();

  const { data: budgetBalance, isLoading } = useGetDefaultCategoryQuery(
    budget?.id!,
    {
      skip: !budget?.id,
    },
  );

  const availableBalance = useMemo(
    () => budgetBalance?.available ?? 0,
    [budgetBalance?.available],
  );
  const cardStyles = useMemo(
    () => getCurrencyColorStyles(availableBalance),
    [availableBalance],
  );

  return (
    <Box
      bg={isLoading ? "gray.100" : cardStyles.bgColor}
      p={2}
      borderRadius="lg"
      boxShadow="sm"
    >
      <HStack spacing={3} align="center">
        <Box color={isLoading ? "gray.100" : cardStyles.color}>
          <FaWallet size="24px" />
        </Box>
        {isLoading ? (
          <VStack spacing={1} align="flex-start">
            <SkeletonUI height="24px" width="100px" />
            <SkeletonUI height="16px" width="80px" />
          </VStack>
        ) : (
          <VStack spacing={1} align="flex-start">
            <Text fontSize="lg" fontWeight="bold" color={cardStyles.color}>
              {formatCurrency(budgetBalance?.available, budget?.settings)}
            </Text>
            <Text fontSize="sm" color={cardStyles.color}>
              {budgetBalance?.name}
            </Text>
          </VStack>
        )}
      </HStack>
    </Box>
  );
};
