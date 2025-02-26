import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button, HStack, Input, Td, Tfoot, Tr } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Transaction } from "@/lib/types/transaction.types";
import {
  UpdateTransactionDto,
  UpdateTransactionSchema,
} from "@/lib/validation/transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateTransactionMutation } from "@/lib/services/transaction.api";
import { showToast } from "@/lib/utils/toast";
import { CategorySelect } from "@/components/forms/CategorySelect";
import DatePickerUI from "../../components/ui/DatePickerUI";
import { useBudgetContext } from "../context/BudgetContext";
import { formatCurrency } from "../utils/helpers";

const columnHelper = createColumnHelper<Transaction>();

type TransactioColumnsProps = {
  editingId: string | null;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  transactions: Transaction[];
};

export const useTransactionColumns = ({
  editingId,
  setEditingId,
  transactions,
}: TransactioColumnsProps) => {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();

  const { handleSubmit, register, control, setValue, reset } =
    useForm<UpdateTransactionDto>({
      resolver: zodResolver(UpdateTransactionSchema),
    });

  const inflowValue = useWatch({ control, name: "inflow" });
  const outflowValue = useWatch({ control, name: "outflow" });

  const [updateTransaction] = useUpdateTransactionMutation();

  const handleSave = useCallback(
    async (dto: UpdateTransactionDto) => {
      try {
        const { message } = await updateTransaction({
          id: editingId!,
          ...dto,
        }).unwrap();
        showToast({ title: message, status: "success" });

        setEditingId(null);
      } catch (error) {
        console.log(error);
      }
    },
    [editingId, setEditingId, updateTransaction],
  );

  const handleCancel = useCallback(() => {
    setEditingId(null);
  }, [setEditingId]);

  const handleSetCategory = useCallback((value: any) => {
    if (!value) {
      return undefined;
    }
    if (typeof value === "object") {
      return value.id;
    }
    return value;
  }, []);

  useEffect(() => {
    if (inflowValue) setValue("outflow", null);
  }, [inflowValue, setValue]);

  useEffect(() => {
    if (outflowValue) setValue("inflow", null);
  }, [outflowValue, setValue]);

  useEffect(() => {
    if (editingId) {
      const transaction = transactions.find((tx) => tx.id === editingId);
      if (transaction) {
        reset(transaction as UpdateTransactionDto);
      }
    }
  }, [editingId, transactions, reset]);

  const columns = [
    columnHelper.accessor("date", {
      header: t("Date"),
      cell: (info) =>
        editingId === info.row.original.id ? (
          <Controller
            name="date"
            control={control}
            defaultValue={info.getValue()}
            render={({ field }) => (
              <DatePickerUI
                selected={field.value ? new Date(field.value) : new Date()}
                onChange={(date) => field.onChange(date)}
              />
            )}
          />
        ) : (
          new Date(info.getValue()).toLocaleDateString()
        ),
    }),
    columnHelper.accessor("description", {
      header: t("Description"),
      cell: (info) =>
        editingId === info.row.original.id ? (
          <Input
            {...register("description")}
            defaultValue={info.getValue() || undefined}
          />
        ) : (
          info.getValue()
        ),
    }),
    columnHelper.accessor("category.name", {
      header: t("Category"),
      cell: (info) =>
        editingId === info.row.original.id ? (
          <CategorySelect
            {...register("category", {
              setValueAs: handleSetCategory,
            })}
            defaultValue=""
          />
        ) : (
          info.row.original.category?.name
        ),
    }),
    columnHelper.accessor("inflow", {
      header: t("Inflow"),
      cell: (info) =>
        editingId === info.row.original.id ? (
          <Input
            {...register("inflow", { valueAsNumber: true })}
            defaultValue={info.getValue() || undefined}
            type="number"
          />
        ) : (
          info.getValue() &&
          formatCurrency(info.getValue() as number, budget?.settings)
        ),
    }),
    columnHelper.accessor("outflow", {
      header: t("Outflow"),
      cell: (info) =>
        editingId === info.row.original.id ? (
          <Input
            {...register("outflow", { valueAsNumber: true })}
            defaultValue={info.getValue() || undefined}
            type="number"
          />
        ) : (
          info.getValue() &&
          formatCurrency(info.getValue() as number, budget?.settings)
        ),
    }),
  ];

  const footer = () =>
    editingId ? (
      <Tfoot>
        <Tr>
          <Td colSpan={6}>
            <HStack justify="flex-end" p={2}>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={handleSubmit(handleSave)}
              >
                {t("Save Changes")}
              </Button>
              <Button colorScheme="gray" size="sm" onClick={handleCancel}>
                {t("Cancel")}
              </Button>
            </HStack>
          </Td>
        </Tr>
      </Tfoot>
    ) : null;

  return { columns, footer };
};
