import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultModalProps } from "@/lib/types/types";
import { Button, VStack } from "@chakra-ui/react";
import {
  CreateTransactionDto,
  CreateTransactionSchema,
} from "@/lib/validation/transaction.schema";
import { showToast } from "@/lib/utils/toast";
import FormInputUI from "@/components/ui/FormInputUI";
import FormSelectUI from "@/components/ui/FormSelectUI";
import { useTranslation } from "react-i18next";
import { TransactionType } from "@/lib/constants/enums";
import { useCreateTransactionMutation } from "@/lib/services/transaction.api";
import FormDatePicker from "@/components/ui/FormDatePicker";
import { DefaultModal } from "..";

type AddTransactionModalProps = {
  accountId: string;
} & DefaultModalProps;

export const AddTransactionModal = ({
  isOpen,
  onClose,
  accountId,
}: AddTransactionModalProps) => {
  const { t } = useTranslation();

  const [createTransaction, { isLoading }] = useCreateTransactionMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateTransactionDto>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      accountId,
    },
  });

  const onSubmit = async (data: CreateTransactionDto) => {
    try {
      const { message } = await createTransaction(data).unwrap();

      showToast({
        title: message,
        status: "success",
      });

      reset();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("Create new transaction")}
      size="md"
      body={
        <VStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={5}
          align="stretch"
        >
          <FormInputUI
            type="number"
            placeholder={t("Enter transaction amount")}
            {...register("amount", { valueAsNumber: true })}
            error={errors.amount?.message}
            label={t("Amount")}
          />
          <FormInputUI
            type="text"
            placeholder={t("Enter transaction description")}
            {...register("description")}
            error={errors.description?.message}
            label={t("Description")}
          />
          <FormSelectUI
            label={t("Type")}
            {...register("type")}
            error={errors.type?.message}
            options={Object.values(TransactionType).map((currency) => ({
              value: currency,
              label: currency,
            }))}
          />
          <FormDatePicker
            control={control}
            error={errors.date?.message}
            label={t("Date")}
            placeholder={t("Select date")}
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
          {t("Create Transaction")}
        </Button>
      }
    />
  );
};
