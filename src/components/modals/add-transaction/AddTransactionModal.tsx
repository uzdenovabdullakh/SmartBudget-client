import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import {
  CreateTransactionDto,
  CreateTransactionSchema,
} from "@/lib/validation/transaction.schema";
import { showToast } from "@/lib/utils/toast";
import { useTranslation } from "react-i18next";
import { useCreateTransactionMutation } from "@/lib/services/transaction.api";
import { DefaultModalProps } from "@/lib/types/types";
import { ArrowBack } from "@/components/ui/ArrowBack";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { DefaultModal } from "..";
import { TransactionChoice } from "./TransactionChoice";
import { TransactionForm } from "./TransactionForm";
import { ScanTransaction } from "./ScanTransaction";

type AddTransactionModalProps = {
  accountId: string;
} & DefaultModalProps;

type StepType = "choice" | "manual" | "scan";

export const AddTransactionModal = ({
  isOpen,
  onClose,
  accountId,
}: AddTransactionModalProps) => {
  const { t } = useTranslation();

  const [step, setStep] = useState<StepType>("choice");
  const [checkData, setCheckData] = useState<any | null>(null);

  const [createTransaction, { isLoading }] = useCreateTransactionMutation();

  const formMethods = useForm<CreateTransactionDto>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: { accountId },
  });

  const { handleSubmit, reset } = formMethods;

  const handleClose = () => {
    reset();
    setStep("choice");
    setCheckData(null);
    onClose();
  };

  const onSubmit = async (dto: CreateTransactionDto) => {
    try {
      const { message } = await createTransaction(dto).unwrap();
      showToast({ title: message, status: "success" });

      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const goBack = () => setStep("choice");

  const onScanComplete = (data: any) => {
    formMethods.setValue("date", data.date);
    formMethods.setValue("outflow", data.outflow);
    formMethods.setValue("inflow", null);
    formMethods.setValue("description", data.description);
    setCheckData(data);
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

  const screens = {
    choice: <TransactionChoice onSelect={setStep} />,
    manual: <TransactionForm />,
    scan: <ScanTransaction onScanComplete={onScanComplete} />,
  };

  return (
    <FormProvider {...formMethods}>
      <DefaultModal
        isOpen={isOpen}
        onClose={handleClose}
        title={titles[step]}
        body={screens[step]}
        footer={
          ((step === "scan" && checkData) || step === "manual") && (
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
    </FormProvider>
  );
};
