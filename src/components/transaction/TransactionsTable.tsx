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
  Tooltip,
  useBreakpointValue,
  Flex,
  useDisclosure,
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
import { formatCurrency } from "@/lib/utils/helpers";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { Pagination } from "../ui/Pagination";
import { SkeletonUI } from "../ui/SkeletonUI";
import { EditTransactionMobileModal } from "../modals/edit-transaction-mobile/EditTransactionMobileModal";

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
  const { budget } = useBudgetContext();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState<OrderByType | null>(null);
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleRowClick = useCallback(
    (row: Row<Transaction>) => {
      if (isMobile) {
        setEditingTransaction(row.original);
        onOpen();
      } else {
        setEditingId(row.original.id);
      }
    },
    [isMobile, onOpen],
  );

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

  const { columns, renderEditFooter } = useTransactionColumns({
    editingId,
    setEditingId,
    transactions,
  });

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderMobileRow = (row: Row<Transaction>) => {
    return (
      <Tr key={row.id} _hover={{ bg: "gray.50" }}>
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
        <Td onClick={() => handleRowClick(row)}>
          <Flex direction="column">
            <Box fontWeight="bold">{row.original.description}</Box>
            <Box fontSize="sm" color="gray.500">
              {row.original.category?.name || "Без категории"}
            </Box>
            <Box fontSize="sm">
              {new Date(row.original.date).toLocaleDateString()}
            </Box>
          </Flex>
        </Td>
        <Td textAlign="right" onClick={() => handleRowClick(row)}>
          {row.original.inflow ? (
            <Box color="green.500">
              +{formatCurrency(row.original.inflow, budget?.settings)}
            </Box>
          ) : (
            <Box color="red.500">
              -
              {formatCurrency(row.original.outflow as number, budget?.settings)}
            </Box>
          )}
        </Td>
      </Tr>
    );
  };

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
        <Flex
          direction={isMobile ? "column" : "row"}
          gap={2}
          mb={4}
          alignItems={isMobile ? "stretch" : "center"}
        >
          <Button colorScheme="red" onClick={handleDelete}>
            {t("Delete Selected", {
              count: selectedRows.length,
            })}
          </Button>
          <Tooltip
            label={t("Categorize selected transactions using AI")}
            aria-label="Categorize tooltip"
            isDisabled={isMobile}
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
        </Flex>
      )}

      {isMobile ? (
        <Table variant="simple" mt={4}>
          <Thead>
            <Tr>
              <Th width="10%">
                <Checkbox
                  isChecked={isAllSelected}
                  onChange={(e) => {
                    setSelectedRows(
                      e.target.checked ? transactions.map((tx) => tx.id) : [],
                    );
                  }}
                />
              </Th>
              <Th>Транзакция</Th>
              <Th textAlign="right">{t("Amount")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => renderMobileRow(row))}
          </Tbody>
        </Table>
      ) : (
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
              <React.Fragment key={row.id}>
                <Tr key={row.id} _hover={{ bg: "gray.50" }}>
                  <Td>
                    <Checkbox
                      isChecked={selectedRows.includes(row.original.id)}
                      onChange={(e) => {
                        setSelectedRows(
                          e.target.checked
                            ? [...selectedRows, row.original.id]
                            : selectedRows.filter(
                                (id) => id !== row.original.id,
                              ),
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  ))}
                </Tr>
                {renderEditFooter(row)}
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {isMobile && editingTransaction && (
        <EditTransactionMobileModal
          isOpen={isOpen}
          onClose={onClose}
          transaction={editingTransaction}
        />
      )}
    </Box>
  );
};
