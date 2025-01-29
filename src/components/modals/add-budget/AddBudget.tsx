import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultModalProps } from "@/lib/types/types";
import { useCreateBudgetMutation } from "@/lib/services/budget.api";
import { Button, VStack } from "@chakra-ui/react";
import {
  CreateBudgetDto,
  CreateBudgetSchema,
} from "@/lib/validation/budget.schema";
import { showToast } from "@/lib/utils/toast";
import { BudgetCurrency, CurrencyPlacement } from "@/lib/constants/enums";
import FormInputUI from "@/components/ui/FormInputUI";
import FormSelectUI from "@/components/ui/FormSelectUI";
import { DefaultModal } from "..";

export const AddBudgetModal = ({ isOpen, onClose }: DefaultModalProps) => {
  const [createBudget, { isLoading }] = useCreateBudgetMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBudgetDto>({
    resolver: zodResolver(CreateBudgetSchema),
    defaultValues: {
      name: "",
      settings: {
        currency: BudgetCurrency.USD,
        currencyPlacement: CurrencyPlacement.BEFORE,
      },
    },
  });

  const onSubmit = async (data: CreateBudgetDto) => {
    try {
      const { message, data: newBudget } = await createBudget(data).unwrap();

      showToast({
        title: message,
        description: `You have new budget ${newBudget.name}`,
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
      title="Create new budget"
      size="md"
      body={
        <VStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={5}
          align="stretch"
        >
          <FormInputUI
            type="text"
            placeholder="Enter budget name"
            {...register("name")}
            error={errors.name?.message}
            label="Budget Name:"
          />

          <FormSelectUI
            label="Currency:"
            {...register("settings.currency")}
            error={errors.settings?.currency?.message}
            options={Object.values(BudgetCurrency).map((currency) => ({
              value: currency,
              label: currency,
            }))}
          />
          <FormSelectUI
            label="Currency Placement:"
            {...register("settings.currencyPlacement")}
            error={errors.settings?.currencyPlacement?.message}
            options={[
              {
                value: CurrencyPlacement.BEFORE,
                label: "Before Amount ($100)",
              },
              { value: CurrencyPlacement.AFTER, label: "After Amount (100$)" },
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
          Create Budget
        </Button>
      }
    />
  );
};
