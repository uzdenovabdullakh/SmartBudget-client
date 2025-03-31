import { Button, VStack } from "@chakra-ui/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  UpdateTransactionDto,
  UpdateTransactionSchema,
} from "@/lib/validation/transaction.schema";
import FormInputUI from "@/components/ui/FormInputUI";
import FormDatePicker from "@/components/ui/FormDatePicker";
import { CategorySelect } from "@/components/forms/CategorySelect";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect } from "react";
import { DefaultModalProps } from "@/lib/types/types";
import { Transaction } from "@/lib/types/transaction.types";
import { showToast } from "@/lib/utils/toast";
import { useUpdateTransactionMutation } from "@/lib/services/transaction.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultModal } from "..";

type EditTransactionMobileModalProps = {
  transaction: Transaction;
} & DefaultModalProps;

export const EditTransactionMobileModal = ({
  isOpen,
  onClose,
  transaction,
}: EditTransactionMobileModalProps) => {
  const { t } = useTranslation();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<UpdateTransactionDto>({
    resolver: zodResolver(UpdateTransactionSchema),
    defaultValues: {
      inflow: transaction.inflow,
      outflow: transaction.outflow,
      date: transaction.date,
      description: transaction.description,
      category: transaction.category?.id,
    },
  });

  const inflowValue = useWatch({ control, name: "inflow" });
  const outflowValue = useWatch({ control, name: "outflow" });

  const [updateTransaction, { isLoading }] = useUpdateTransactionMutation();

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const onSubmit = useCallback(
    async (dto: UpdateTransactionDto) => {
      try {
        const { message } = await updateTransaction({
          id: transaction.id,
          ...dto,
        }).unwrap();
        showToast({ title: message, status: "success" });

        handleClose();
      } catch (error) {
        console.log(error);
      }
    },
    [handleClose, transaction.id, updateTransaction],
  );

  useEffect(() => {
    if (inflowValue) setValue("outflow", null);
  }, [inflowValue, setValue]);

  useEffect(() => {
    if (outflowValue) setValue("inflow", null);
  }, [outflowValue, setValue]);

  useEffect(() => {
    if (transaction) {
      reset({
        ...transaction,
        category: transaction?.category?.id ?? null,
      } as UpdateTransactionDto);
    }
  }, [reset, transaction]);

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Редактирование"
      body={
        <VStack as="form" spacing={5} align="stretch">
          <FormInputUI
            type="number"
            placeholder={t("Enter inflow amount")}
            {...register("inflow", { valueAsNumber: true })}
            error={errors.inflow?.message}
            label={t("Inflow")}
          />
          <FormInputUI
            type="number"
            placeholder={t("Enter outflow amount")}
            {...register("outflow", { valueAsNumber: true })}
            error={errors.outflow?.message}
            label={t("Outflow")}
          />
          <FormDatePicker
            name="date"
            control={control}
            error={errors.date?.message}
            label={t("Date")}
            placeholder={t("Select date")}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <CategorySelect
                label={t("Category")}
                value={field.value ?? undefined}
                onChange={field.onChange}
                error={errors.category?.message}
              />
            )}
          />
          <FormInputUI
            type="text"
            placeholder={t("Enter description")}
            {...register("description")}
            error={errors.description?.message}
            label={t("Description")}
          />
        </VStack>
      }
      footer={
        <Button
          onClick={handleSubmit(onSubmit)}
          colorScheme="blue"
          isLoading={isLoading}
          width="full"
        >
          {t("Save Changes")}
        </Button>
      }
      size="md"
    />
  );
};
