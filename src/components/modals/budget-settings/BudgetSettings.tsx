import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultModalProps } from "@/lib/types/types";
import {
  useLazyGetBudgetInfoQuery,
  useUpdateBudgetMutation,
} from "@/lib/services/budget.api";
import { Button, VStack } from "@chakra-ui/react";
import {
  UpdateBudgetDto,
  UpdateBudgetSchema,
} from "@/lib/validation/budget.schema";
import { showToast } from "@/lib/utils/toast";
import { BudgetCurrency, CurrencyPlacement } from "@/lib/constants/enums";
import FormSelectUI from "@/components/ui/FormSelectUI";
import { useParams } from "next/navigation";
import { Budget } from "@/lib/types/budget.types";
import { useTranslation } from "react-i18next";
import { DefaultModal } from "..";

const reverseCurrencyMap = {
  $: BudgetCurrency.USD,
  "₽": BudgetCurrency.RUB,
  "€": BudgetCurrency.EUR,
};

export const ChangeBudgetSettingsModal = ({
  isOpen,
  onClose,
}: DefaultModalProps) => {
  const { t } = useTranslation();

  const params = useParams();
  const budgetId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [getBudgetInfo] = useLazyGetBudgetInfoQuery();
  const [updateBudget, { isLoading }] = useUpdateBudgetMutation();

  const [budgetInfo, setBudgetInfo] = useState<Budget | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateBudgetDto>({
    resolver: zodResolver(UpdateBudgetSchema),
    defaultValues: {
      settings: {
        currency:
          budgetInfo?.settings.currency &&
          reverseCurrencyMap[budgetInfo?.settings.currency],
        currencyPlacement: budgetInfo?.settings.currencyPlacement,
      },
    },
  });

  const onSubmit = async (data: UpdateBudgetDto) => {
    if (!budgetId) return;

    try {
      const { message } = await updateBudget({
        id: budgetId,
        ...data,
      }).unwrap();

      showToast({ title: message, status: "success" });

      reset();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBudgetInfo = useCallback(async () => {
    if (!budgetId) return;

    try {
      const result = await getBudgetInfo(budgetId).unwrap();
      setBudgetInfo(result);

      reset({
        settings: {
          currency: result.settings.currency
            ? reverseCurrencyMap[result.settings.currency]
            : undefined,
          currencyPlacement: result.settings.currencyPlacement,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, [budgetId, getBudgetInfo, reset]);

  useEffect(() => {
    fetchBudgetInfo();
  }, [fetchBudgetInfo]);

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("Change budget settings")}
      size="md"
      body={
        <VStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={5}
          align="stretch"
        >
          <FormSelectUI
            label={t("Currency")}
            {...register("settings.currency")}
            error={errors.settings?.currency?.message}
            options={Object.values(BudgetCurrency).map((currency) => ({
              value: currency,
              label: currency,
            }))}
          />
          <FormSelectUI
            label={t("Currency Placement:")}
            {...register("settings.currencyPlacement")}
            error={errors.settings?.currencyPlacement?.message}
            options={[
              {
                value: CurrencyPlacement.BEFORE,
                label: t("Before Amount ($100)"),
              },
              {
                value: CurrencyPlacement.AFTER,
                label: t("After Amount (100$)"),
              },
            ]}
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
    />
  );
};
