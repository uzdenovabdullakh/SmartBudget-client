import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultModalProps } from "@/lib/types/types";
import { Button, VStack } from "@chakra-ui/react";
import { showToast } from "@/lib/utils/toast";
import { useTranslation } from "react-i18next";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { useCreateGoalMutation } from "@/lib/services/goal.api";
import { CreateGoalDto, CreateGoalSchema } from "@/lib/validation/goal.schema";
import FormDatePicker from "@/components/ui/FormDatePicker";
import FormInputUI from "@/components/ui/FormInputUI";
import { DefaultModal } from "..";

export const AddGoalModal = ({ isOpen, onClose }: DefaultModalProps) => {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();
  const [createGoal, { isLoading }] = useCreateGoalMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateGoalDto>({
    resolver: zodResolver(CreateGoalSchema),
    defaultValues: {
      currentAmount: 0,
    },
  });

  const onSubmit = async (data: CreateGoalDto) => {
    if (!budget?.id) return;

    try {
      const { message } = await createGoal({ id: budget.id, ...data }).unwrap();
      showToast({ title: message, status: "success" });

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
      title={t("Add Goal")}
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
            placeholder={t("Goal name")}
            label={t("Goal name")}
            error={errors.name?.message}
            {...register("name")}
          />
          <FormInputUI
            type="number"
            placeholder={t("Target amount")}
            label={t("Target amount")}
            error={errors.targetAmount?.message}
            {...register("targetAmount", { valueAsNumber: true })}
          />
          <FormInputUI
            type="number"
            placeholder={t("Current amount")}
            label={t("Current amount")}
            error={errors.currentAmount?.message}
            {...register("currentAmount", { valueAsNumber: true })}
          />
          <FormDatePicker
            control={control}
            label={t("Achieve date")}
            placeholder={t("Select achieve date")}
            error={errors.achieveDate?.message}
            name="achieveDate"
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
