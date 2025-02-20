import { useBudgetContext } from "@/lib/context/BudgetContext";
import { Account } from "@/lib/types/account.types";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

type AccountTableProps = {
  accounts: Account[];
};

export const AccountsTable = ({ accounts }: AccountTableProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { budget } = useBudgetContext();

  const handleAccountClick = (accountId: string) => {
    if (budget?.id) {
      router.push(`/dashboard/${budget.id}/account/${accountId}`);
    }
  };

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
          >
            <Td>{account.name}</Td>
            <Td>{new Date(account.createdAt).toLocaleDateString()}</Td>
            <Td>{account.type}</Td>
            <Td>{account.amount}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
