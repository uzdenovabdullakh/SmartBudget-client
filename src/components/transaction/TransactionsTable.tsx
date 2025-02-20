import React, { useCallback, useMemo, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Stack,
} from "@chakra-ui/react";
import {
  useDeleteTransactionsMutation,
  useGetTransactionsQuery,
} from "@/lib/services/transaction.api";
import { Transaction } from "@/lib/types/transaction.types";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { showToast } from "@/lib/utils/toast";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pagination } from "../ui/Pagination";
import { SkeletonUI } from "../ui/SkeletonUI";
import { useTransactionColumns } from "../../lib/hooks/useTransactionColumns";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 500;

type TransactionsTableProps = {
  accountId: string;
  searchQuery: string;
  startDate?: Date | null;
  endDate?: Date | null;
};

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  accountId,
  searchQuery,
  startDate,
  endDate,
}) => {
  const { t } = useTranslation();
  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useGetTransactionsQuery({
    id: accountId,
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
  });
  const [deleteTransactions] = useDeleteTransactionsMutation();

  const handleEdit = useCallback((transaction: Transaction) => {
    setEditingId(transaction.id);
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      const { message } = await deleteTransactions(selectedRows).unwrap();
      setSelectedRows([]);
      showToast({ title: message, status: "success" });
    } catch (error) {
      console.log(error);
    }
  }, [deleteTransactions, selectedRows]);

  const transactions = useMemo(
    () => data?.transactions || [],
    [data?.transactions],
  );
  const isAllSelected = useMemo(
    () =>
      selectedRows.length === transactions.length && selectedRows.length > 0,
    [selectedRows.length, transactions.length],
  );
  const totalPages = useMemo(() => data?.totalPages || 0, [data?.totalPages]);

  const { columns, footer } = useTransactionColumns({
    editingId,
    setEditingId,
    selectedRows,
    setSelectedRows,
    isAllSelected,
    transactions,
  });

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <Stack>
        <SkeletonUI length={PAGE_SIZE} height={8} />
      </Stack>
    );
  }

  return (
    <Box>
      {selectedRows.length > 0 && (
        <Button colorScheme="red" onClick={handleDelete}>
          {t("Delete Selected")} ({selectedRows.length})
        </Button>
      )}
      <Table variant="simple">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id} onClick={() => handleEdit(row.original)}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id} height="75px">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
        {footer()}
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Box>
  );
};
