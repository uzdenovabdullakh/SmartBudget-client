import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Spinner, VStack, Text, Box } from "@chakra-ui/react";
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
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useGetCheckByQrMutation } from "@/lib/services/check.api";
import { DefaultModal } from "..";

type AddTransactionModalProps = {
  accountId: string;
} & DefaultModalProps;

type StepType = "choice" | "manual" | "scan" | "afterScan";

export const AddTransactionModal = ({
  isOpen,
  onClose,
  accountId,
}: AddTransactionModalProps) => {
  const { t } = useTranslation();

  const boxRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<StepType>("choice");
  const [checkData, setCheckData] = useState<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const [createTransaction, { isLoading }] = useCreateTransactionMutation();
  const [getCheckByQr, { isLoading: isFetchingReceipt }] =
    useGetCheckByQrMutation();

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

  const onSubmit = async (dto: CreateTransactionDto) => {
    try {
      const { message } = await createTransaction(dto).unwrap();
      showToast({ title: message, status: "success" });

      reset();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleScan = async (data: IDetectedBarcode[]) => {
    if (data.length) {
      const qrraw = data[0].rawValue;
      setStep("afterScan");

      try {
        const result = await getCheckByQr(qrraw).unwrap();
        setCheckData(result);
      } catch (error: any) {
        setScanError(error.message);
        console.log(error);
      }
    }
  };

  const handleError = (error: any) => {
    setScanError(error.message);
    console.log(error);
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
          control={control}
          error={errors.date?.message}
          label={t("Date")}
          placeholder={t("Select date")}
        />
        <CategorySelect
          label={t("Category")}
          {...register("category")}
          placeholder={t("Select Category")}
          defaultValue={undefined}
          error={errors.category?.message}
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
      <VStack spacing={5} minH="470px">
        <Scanner
          onScan={(result) => handleScan(result)}
          onError={(error) => handleError(error)}
        />
      </VStack>
    ),
    afterScan: (
      <VStack spacing={4}>
        {isFetchingReceipt && <Spinner />}
        {scanError && <Text color="red.500">{scanError}</Text>}
        {checkData && (
          <Box
            ref={boxRef}
            width="full"
            p={4}
            borderWidth="1px"
            borderRadius="md"
            dangerouslySetInnerHTML={{ __html: checkData.data.html }}
          />
        )}
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
    afterScan: t("Scan result"),
  };

  useEffect(() => {
    if (inflowValue) setValue("outflow", null);
  }, [inflowValue, setValue]);

  useEffect(() => {
    if (outflowValue) setValue("inflow", null);
  }, [outflowValue, setValue]);

  useEffect(() => {
    if (step === "afterScan" && checkData && boxRef.current) {
      const images = boxRef.current.querySelectorAll("img");
      images.forEach((img) => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("http")) {
          img.setAttribute("src", `${process.env.OFD_API_URL}${src}`);
        }
      });
    }
  }, [step, checkData]);

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title={titles[step]}
      body={screens[step]}
      footer={
        (step === "manual" || step === "afterScan") && (
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
