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
  Checkbox,
  HStack,
  Tooltip,
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
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { useCategorizeTransactionsMutation } from "@/lib/services/ai.api";
import { useTransactionColumns } from "@/lib/hooks/useTransactionColumns";
import { Pagination } from "../ui/Pagination";
import { SkeletonUI } from "../ui/SkeletonUI";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 500;

type TransactionsTableProps = {
  accountId: string;
  searchQuery: string;
  startDate?: Date | null;
  endDate?: Date | null;
};

type OrderByType = "inflow" | "outflow" | "category_name" | "date";

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
  const [orderBy, setOrderBy] = useState<OrderByType | null>(null);
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");

  const { data, isLoading } = useGetTransactionsQuery({
    id: accountId,
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    orderBy: orderBy ?? undefined,
    order: order ?? undefined,
  });
  const [deleteTransactions] = useDeleteTransactionsMutation();
  const [categorizeTransactions] = useCategorizeTransactionsMutation();

  const handleRowClick = useCallback((row: Row<Transaction>) => {
    setEditingId(row.original.id);
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

  const handleCategorize = useCallback(async () => {
    try {
      const { message } = await categorizeTransactions(selectedRows).unwrap();
      setSelectedRows([]);
      showToast({ title: message, status: "info" });
    } catch (error) {
      console.log(error);
    }
  }, [categorizeTransactions, selectedRows]);

  const handleSort = useCallback(
    (column: OrderByType) => {
      if (orderBy === column) {
        setOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
      } else {
        setOrderBy(column);
        setOrder("ASC");
      }
    },
    [orderBy],
  );

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
        <HStack>
          <Button colorScheme="red" onClick={handleDelete}>
            {t("Delete Selected", {
              count: selectedRows.length,
            })}
          </Button>
          <Tooltip
            label={t("Categorize selected transactions using AI")}
            aria-label="Categorize tooltip"
          >
            <Button
              colorScheme="yellow"
              color="neutrals.midnight"
              onClick={handleCategorize}
            >
              {t("Categorize Selected", {
                count: selectedRows.length,
              })}
            </Button>
          </Tooltip>
        </HStack>
      )}
      <Table variant="simple" mt={4}>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              <Th>
                <Checkbox
                  isChecked={isAllSelected}
                  onChange={(e) => {
                    setSelectedRows(
                      e.target.checked ? transactions.map((tx) => tx.id) : [],
                    );
                  }}
                />
              </Th>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  onClick={() => {
                    if (
                      ["inflow", "outflow", "category_name", "date"].includes(
                        header.id,
                      )
                    ) {
                      handleSort(header.id as OrderByType);
                    }
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {orderBy === header.id && (order === "ASC" ? " ↑" : " ↓")}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              <Td>
                <Checkbox
                  isChecked={selectedRows.includes(row.original.id)}
                  onChange={(e) => {
                    setSelectedRows(
                      e.target.checked
                        ? [...selectedRows, row.original.id]
                        : selectedRows.filter((id) => id !== row.original.id),
                    );
                  }}
                />
              </Td>
              {row.getVisibleCells().map((cell) => (
                <Td
                  key={cell.id}
                  height="75px"
                  onClick={() => handleRowClick(row)}
                >
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
