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
  const { t } = useTranslation();

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
