import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, VStack } from "@chakra-ui/react";
import {
  CreateTransactionDto,
  CreateTransactionSchema,
} from "@/lib/validation/transaction.schema";
import { showToast } from "@/lib/utils/toast";
import FormInputUI from "@/components/ui/FormInputUI";
import FormDatePicker from "@/components/ui/FormDatePicker";
import { useTranslation } from "react-i18next";
import { useCreateTransactionMutation } from "@/lib/services/transaction.api";
import { DefaultModalProps } from "@/lib/types/types";
import { CategorySelect } from "@/components/category/CategorySelect";
import { ArrowBack } from "@/components/ui/ArrowBack";
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

  const [step, setStep] = useState<"choice" | "manual" | "scan">("choice");
  const [createTransaction, { isLoading }] = useCreateTransactionMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateTransactionDto>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: { accountId },
  });

  const inflowValue = useWatch({ control, name: "inflow" });
  const outflowValue = useWatch({ control, name: "outflow" });

  const onSubmit = async (data: CreateTransactionDto) => {
    try {
      const { message } = await createTransaction(data).unwrap();

      showToast({ title: message, status: "success" });

      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const goBack = () => setStep("choice");

  const screens = {
    choice: (
      <VStack spacing={4}>
        <Button
          onClick={() => setStep("manual")}
          colorScheme="blue"
          width="full"
        >
          {t("Enter manually")}
        </Button>
        <Button
          onClick={() => setStep("scan")}
          colorScheme="green"
          width="full"
        >
          {t("Scan QR Code")}
        </Button>
      </VStack>
    ),
    manual: (
      <VStack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={5}
        align="stretch"
      >
        <FormDatePicker
          control={control}
          error={errors.date?.message}
          label={t("Date")}
          placeholder={t("Select date")}
        />
        <CategorySelect
          label={t("Category")}
          {...register("category")}
          error={errors.category?.message}
        />
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
        <FormInputUI
          type="text"
          placeholder={t("Enter description")}
          {...register("description")}
          error={errors.description?.message}
          label={t("Description")}
        />
      </VStack>
    ),
    scan: (
      <VStack spacing={5}>
        <Button colorScheme="blue" width="full">
          {t("Scan QR Code")}
        </Button>
      </VStack>
    ),
  };

  const titles = {
    choice: t("Choose way"),
    manual: <ArrowBack text={t("Create new transaction")} onClick={goBack} />,
    scan: (
      <ArrowBack
        text={t("Just scan barcode or QR code on receipt")}
        onClick={goBack}
      />
    ),
  };

  useEffect(() => {
    if (inflowValue) setValue("outflow", null);
  }, [inflowValue, setValue]);

  useEffect(() => {
    if (outflowValue) setValue("inflow", null);
  }, [outflowValue, setValue]);

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title={titles[step]}
      body={screens[step]}
      footer={
        step === "manual" && (
          <Button
            onClick={handleSubmit(onSubmit)}
            colorScheme="blue"
            isLoading={isLoading}
            width="full"
          >
            {t("Create Transaction")}
          </Button>
        )
      }
      size={step !== "choice" ? "lg" : "sm"}
    />
  );
};
