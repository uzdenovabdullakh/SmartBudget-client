import { Account } from "@/lib/types/account.types";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";

type AccountTableProps = {
  accounts: Account[];
};

export const AccountsTable = ({ accounts }: AccountTableProps) => {
  const router = useRouter();
  const params = useParams();
  const budgetId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const handleAccountClick = (accountId: string) => {
    if (budgetId) {
      router.push(`/dashboard/${budgetId}/account/${accountId}`);
    }
  };

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Account</Th>
          <Th>Date</Th>
          <Th>Type</Th>
          <Th>Amount</Th>
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
