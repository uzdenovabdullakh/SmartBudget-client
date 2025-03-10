import { VStack } from "@chakra-ui/react";
import { useFormContext, useWatch } from "react-hook-form";
import { CreateTransactionDto } from "@/lib/validation/transaction.schema";
import FormInputUI from "@/components/ui/FormInputUI";
import FormDatePicker from "@/components/ui/FormDatePicker";
import { CategorySelect } from "@/components/forms/CategorySelect";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export const TransactionForm = () => {
  const { t } = useTranslation();

  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<CreateTransactionDto>();

  const inflowValue = useWatch({ control, name: "inflow" });
  const outflowValue = useWatch({ control, name: "outflow" });

  useEffect(() => {
    if (inflowValue) setValue("outflow", null);
  }, [inflowValue, setValue]);

  useEffect(() => {
    if (outflowValue) setValue("inflow", null);
  }, [outflowValue, setValue]);

  return (
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
      <CategorySelect
        label={t("Category")}
        {...register("category")}
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
  );
};
