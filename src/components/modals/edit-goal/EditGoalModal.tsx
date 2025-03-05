import { useUpdateGoalMutation } from "@/lib/services/goal.api";
import { UpdateGoalDto, UpdateGoalSchema } from "@/lib/validation/goal.schema";
import { Goal } from "@/lib/types/goal.types";
import { DefaultModalProps } from "@/lib/types/types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import FormInputUI from "@/components/ui/FormInputUI";
import FormDatePicker from "@/components/ui/FormDatePicker";
import { DonutChart } from "@/components/analytic/DonutChart";
import { showToast } from "@/lib/utils/toast";
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
  const [isEditing, setIsEditing] = useState(false);

  const achieveDate = new Date(goal.achieveDate);

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
      achieveDate: achieveDate.toISOString().split("T")[0],
    },
  });

  const progress = Math.min(
    (goal.currentAmount * 100) / goal.targetAmount,
    100,
  );

  const onSubmit = async (data: UpdateGoalDto) => {
    try {
      const { message } = await updateGoal({ id: goal.id, ...data }).unwrap();
      showToast({
        title: message,
        status: "success",
      });

      setIsEditing(false);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  if (!isOpen) return null;

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title={goal.name}
      size="lg"
      body={
        <VStack spacing={6} align="stretch">
          {!isEditing ? (
            <>
              <DonutChart
                spentAmount={goal.currentAmount}
                limitAmount={goal.targetAmount}
                progress={progress}
                reverseColor
              />
              <VStack spacing={4} align="start">
                <Box>
                  <Text fontSize="md" fontWeight="bold">
                    {t("Target amount")}:{" "}
                    <Text as="span" fontWeight="normal">
                      {goal.targetAmount}
                    </Text>
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="md" fontWeight="bold">
                    {t("Current amount")}:{" "}
                    <Text as="span" fontWeight="normal">
                      {goal.currentAmount}
                    </Text>
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="md" fontWeight="bold">
                    {t("Achieve date")}:{" "}
                    <Text as="span" fontWeight="normal">
                      {achieveDate.toLocaleDateString()}
                    </Text>
                  </Text>
                </Box>
              </VStack>
            </>
          ) : (
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
          )}
        </VStack>
      }
      footer={
        <Flex gap={4}>
          {!isEditing ? (
            <Button colorScheme="blue" onClick={handleEditClick}>
              {t("Edit")}
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                {t("Cancel")}
              </Button>
              <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
                {t("Save")}
              </Button>
            </>
          )}
        </Flex>
      }
    />
  );
};
