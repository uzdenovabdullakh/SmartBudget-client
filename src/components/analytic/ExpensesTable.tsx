import { AnalyticResponseDto } from "@/lib/types/analytic.types";
import { BudgetSettings } from "@/lib/types/budget.types";
import { formatCurrency } from "@/lib/utils/helpers";
import {
  Box,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  HStack,
  useBreakpointValue,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type ExpensesTableProps = {
  data: AnalyticResponseDto;
  colors: string[];
  budgetSettings?: BudgetSettings;
};

export const ExpensesTable = ({
  data,
  colors,
  budgetSettings,
}: ExpensesTableProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();

  if (isMobile) {
    return (
      <Stack spacing={4} alignItems="center">
        {data?.categories.map((category: string, index: number) => (
          <Box
            key={category}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            minW="sm"
          >
            <Flex justifyContent="space-between" mb={2}>
              <HStack>
                <Box w="3" h="3" bg={colors[index]} borderRadius="full" />
                <Text fontWeight="medium">{category}</Text>
              </HStack>
              <Text fontWeight="bold">
                {formatCurrency(data.amounts[index], budgetSettings)}
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.500">
              {t("operationsWithCount", {
                count: data.operationsCount[index],
              })}
            </Text>
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>{t("Category")}</Th>
          <Th>{t("Amount")}</Th>
          <Th>{t("Operations")}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data?.categories.map((category: string, index: number) => (
          <Tr key={category}>
            <Td>
              <HStack>
                <Box w="4" h="4" bg={colors[index]} borderRadius="full" />
                <Text>{category}</Text>
              </HStack>
            </Td>
            <Td>{formatCurrency(data.amounts[index], budgetSettings)}</Td>
            <Td>
              {t("operationsWithCount", {
                count: data.operationsCount[index],
              })}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
