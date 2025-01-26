import { Account } from "@/lib/types/account.types";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

type AccountTableProps = {
  accounts: Account[];
};

export const AccountsTable = ({ accounts }: AccountTableProps) => (
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
        <Tr key={account.id}>
          <Td>{account.name}</Td>
          <Td>{new Date(account.createdAt).toLocaleDateString()}</Td>
          <Td>{account.type}</Td>
          <Td>{account.amount}</Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);
