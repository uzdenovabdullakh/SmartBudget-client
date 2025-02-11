import {
  useDeleteTransactionsMutation,
  useGetTransactionsQuery,
  useUpdateTransactionMutation,
} from "@/lib/services/transaction.api";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  Flex,
  IconButton,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import { useCallback, useMemo, useReducer, useState } from "react";
import { Transaction } from "@/lib/types/transaction.types";
import { showToast } from "@/lib/utils/toast";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { transactionsTableReduce } from "@/lib/utils/helpers";
import { TransactionType } from "@/lib/constants/enums";
import { SkeletonUI } from "../ui/SkeletonUI";
import { Pagination } from "../ui/Pagination";
import { EditableCell } from "./EditableCell";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 500;

type TransactionsTableProps = {
  accountId: string;
  searchQuery: string;
  startDate?: Date | null;
  endDate?: Date | null;
};
type EditState = {
  rowId: string;
  field: keyof Transaction;
  value: string;
} | null;

export const TransactionsTable = ({
  accountId,
  searchQuery,
  startDate,
  endDate,
}: TransactionsTableProps) => {
  const { t } = useTranslation();
  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);
  const [state, dispatch] = useReducer(transactionsTableReduce, {
    currentPage: 1,
    editingCell: null as EditState,
    editedValue: "",
    selected: [] as string[],
  });
  const [typeFilter, setTypeFilter] = useState<"" | TransactionType>("");

  const { data, isLoading } = useGetTransactionsQuery(
    {
      id: accountId!,
      page: state.currentPage,
      pageSize: PAGE_SIZE,
      search: debouncedSearchQuery,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      type: typeFilter || undefined,
    },
    { skip: !accountId },
  );

  const [updateTransaction] = useUpdateTransactionMutation();
  const [deleteTransactions] = useDeleteTransactionsMutation();

  const transactions = useMemo(
    () => data?.transactions || [],
    [data?.transactions],
  );
  const totalPages = data?.totalPages || 0;

  const handleSaveEdit = useCallback(async () => {
    if (!state.editingCell) return;

    try {
      const payload = {
        [state.editingCell.field]:
          state.editingCell.field === "date"
            ? new Date(state.editedValue).toISOString()
            : state.editedValue,
      };

      const { message } = await updateTransaction({
        id: state.editingCell.rowId,
        ...payload,
      }).unwrap();

      showToast({ title: message, status: "success" });
      dispatch({ type: "SET_EDITING", payload: null });
    } catch (error) {
      console.log(error);
    }
  }, [state.editedValue, state.editingCell, updateTransaction]);

  const handleDeleteSelected = useCallback(async () => {
    if (!state.selected.length) return;

    try {
      const { message } = await deleteTransactions(state.selected).unwrap();

      showToast({ title: message, status: "success" });
      dispatch({ type: "SET_SELECTED", selected: [] });
    } catch (error) {
      console.log(error);
    }
  }, [deleteTransactions, state.selected]);

  const renderEditableCell = useCallback(
    (rowId: string, field: keyof Transaction, value: string) => {
      const isEditing =
        state.editingCell?.rowId === rowId &&
        state.editingCell?.field === field;

      return (
        <EditableCell
          field={field}
          value={value}
          isEditing={isEditing}
          editedValue={state.editedValue}
          onValueChange={(val) => {
            dispatch({ type: "UPDATE_VALUE", value: val });
          }}
        />
      );
    },
    [state.editedValue, state.editingCell],
  );

  const toggleTypeFilter = useCallback(() => {
    setTypeFilter((prev) => {
      if (prev === TransactionType.INCOME) return TransactionType.EXPENSE;
      if (prev === TransactionType.EXPENSE) return "";
      return TransactionType.INCOME;
    });
  }, []);

  const isAllSelected = useMemo(
    () =>
      state.selected.length === transactions.length &&
      state.selected.length > 0,
    [state.selected, transactions],
  );

  if (isLoading) {
    return (
      <Stack>
        <SkeletonUI length={PAGE_SIZE} height={8} />
      </Stack>
    );
  }

  return (
    <Box>
      {state.selected.length > 0 && (
        <Button colorScheme="red" onClick={handleDeleteSelected} mb={4}>
          {t("Delete Selected")} ({state.selected.length})
        </Button>
      )}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                isChecked={isAllSelected}
                onChange={(e) =>
                  dispatch({
                    type: "SET_SELECTED",
                    selected: e.target.checked
                      ? transactions.map((tx) => tx.id)
                      : [],
                  })
                }
              />
            </Th>
            <Th>{t("Amount")}</Th>
            <Th onClick={toggleTypeFilter} cursor="pointer">
              {t("Type")} ({typeFilter})
            </Th>
            <Th>{t("Date")}</Th>
            <Th>{t("Description")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr key={transaction.id}>
              <Td>
                <Checkbox
                  isChecked={state.selected.includes(transaction.id)}
                  onChange={() =>
                    dispatch({
                      type: "SET_SELECTED",
                      selected: state.selected.includes(transaction.id)
                        ? state.selected.filter(
                            (id: string) => id !== transaction.id,
                          )
                        : [...state.selected, transaction.id],
                    })
                  }
                />
              </Td>
              {(
                [
                  "amount",
                  "type",
                  "date",
                  "description",
                ] as (keyof Transaction)[]
              ).map((field) => (
                <Td
                  key={field}
                  onClick={() =>
                    dispatch({
                      type: "SET_EDITING",
                      payload: {
                        rowId: transaction.id,
                        field,
                        value: transaction[field],
                      },
                    })
                  }
                >
                  {renderEditableCell(
                    transaction.id,
                    field,
                    field === "date"
                      ? new Date(transaction[field]).toLocaleDateString()
                      : transaction[field],
                  )}
                </Td>
              ))}
              <Td>
                {state.editingCell?.rowId === transaction.id && (
                  <Flex>
                    <IconButton
                      aria-label="Save"
                      icon={<CheckIcon />}
                      onClick={handleSaveEdit}
                      colorScheme="green"
                      size="sm"
                      mr={2}
                    />
                    <IconButton
                      aria-label="Cancel"
                      icon={<CloseIcon />}
                      onClick={() =>
                        dispatch({ type: "SET_EDITING", payload: null })
                      }
                      colorScheme="red"
                      size="sm"
                    />
                  </Flex>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Pagination
        currentPage={state.currentPage}
        totalPages={totalPages}
        onPageChange={(page) => dispatch({ type: "SET_PAGE", page })}
      />
    </Box>
  );
};
