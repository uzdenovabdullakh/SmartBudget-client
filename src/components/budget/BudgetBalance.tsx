import { useGetDefaultCategoryQuery } from "@/lib/services/category.api";
import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { FaWallet } from "react-icons/fa";
import { formatCurrency } from "@/lib/utils/helpers";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { SkeletonUI } from "../ui/SkeletonUI";

export const BudgetBalance = () => {
  const { budget } = useBudgetContext();

  const { data: budgetBalance, isLoading } = useGetDefaultCategoryQuery(
    budget?.id!,
    {
      skip: !budget?.id,
    },
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
              {formatCurrency(
                budgetBalance?.available || 0,
                budget?.settings.currency || "$",
                budget?.settings.currencyPlacement || "before",
              )}
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
