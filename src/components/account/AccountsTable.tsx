import { useBudgetContext } from "@/lib/context/BudgetContext";
import { Account } from "@/lib/types/account.types";
import { formatCurrency } from "@/lib/utils/helpers";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
  Stack,
  Box,
  Divider,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

type AccountTableProps = {
  accounts: Account[];
};

export const AccountsTable = ({ accounts }: AccountTableProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { budget } = useBudgetContext();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleAccountClick = (accountId: string) => {
    if (budget?.id) {
      router.push(`/dashboard/${budget.id}/account/${accountId}`);
    }
  };

  if (isMobile) {
    return (
      <Stack spacing={4}>
        {accounts.map((account) => (
          <Box
            key={account.id}
            onClick={() => handleAccountClick(account.id)}
            cursor="pointer"
            p={4}
            borderWidth="1px"
            borderRadius="lg"
          >
            <Text fontWeight="bold">{account.name}</Text>
            <Text fontSize="sm" color="gray.500">
              {new Date(account.createdAt).toLocaleDateString()}
            </Text>
            <Divider my={2} />
            <Stack direction="row" justifyContent="space-between">
              <Text fontSize="sm">{account.type}</Text>
              <Text fontWeight="medium">
                {formatCurrency(account.amount, budget?.settings)}
              </Text>
            </Stack>
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>{t("Account")}</Th>
          <Th>{t("Date")}</Th>
          <Th>{t("Type")}</Th>
          <Th>{t("Amount")}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {accounts.map((account) => (
          <Tr
            key={account.id}
            onClick={() => handleAccountClick(account.id)}
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
          >
            <Td>{account.name}</Td>
            <Td>{new Date(account.createdAt).toLocaleDateString()}</Td>
            <Td>{account.type}</Td>
            <Td>{formatCurrency(account.amount, budget?.settings)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
