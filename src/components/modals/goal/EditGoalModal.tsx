import { useUpdateGoalMutation } from "@/lib/services/goal.api";
import { UpdateGoalDto, UpdateGoalSchema } from "@/lib/validation/goal.schema";
import { DefaultModalProps } from "@/lib/types/types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, VStack } from "@chakra-ui/react";
import FormInputUI from "@/components/ui/FormInputUI";
import FormDatePicker from "@/components/ui/FormDatePicker";
import { showToast } from "@/lib/utils/toast";
import { Goal } from "@/lib/types/goal.types";
import { DefaultModal } from "..";

type EditGoalModalProps = {
  goal: Goal;
} & DefaultModalProps;

export const EditGoalModal = ({
  isOpen,
  onClose,
  goal,
}: EditGoalModalProps) => {
  const { t } = useTranslation();
  const [updateGoal] = useUpdateGoalMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UpdateGoalDto>({
    resolver: zodResolver(UpdateGoalSchema),
    defaultValues: {
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      achieveDate: new Date(goal.achieveDate).toISOString().split("T")[0],
    },
  });

  const onSubmit = async (dto: UpdateGoalDto) => {
    try {
      const { message } = await updateGoal({ id: goal.id, ...dto }).unwrap();
      showToast({
        title: message,
        status: "success",
      });

      onClose();
      reset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title={goal.name}
      size="lg"
      body={
        <VStack spacing={6} align="stretch">
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormInputUI
                label={t("Goal name")}
                type="text"
                {...register("name")}
                error={errors.name?.message}
              />
              <FormInputUI
                label={t("Target amount")}
                type="number"
                {...register("targetAmount", { valueAsNumber: true })}
                error={errors.targetAmount?.message}
              />
              <FormInputUI
                label={t("Current amount")}
                type="number"
                {...register("currentAmount", { valueAsNumber: true })}
                error={errors.currentAmount?.message}
              />
              <FormDatePicker
                label={t("Achieve date")}
                name="achieveDate"
                control={control}
                error={errors.achieveDate?.message}
              />
            </VStack>
          </form>
        </VStack>
      }
      footer={
        <Flex gap={4}>
          <Button variant="outline" onClick={handleCancel}>
            {t("Cancel")}
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
            {t("Save")}
          </Button>
        </Flex>
      }
    />
  );
};
