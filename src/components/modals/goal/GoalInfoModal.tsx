import { useGetGoalQuery } from "@/lib/services/goal.api";
import { DefaultModalProps } from "@/lib/types/types";
import { useTranslation } from "react-i18next";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { DonutChart } from "@/components/analytic/DonutChart";
import { NotFoundDataAnimation } from "@/components/ui/Animations";
import { formatCurrency } from "@/lib/utils/helpers";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { DefaultModal } from "..";

type GoalInfoModalProps = {
  goalId: string;
} & DefaultModalProps;

export const GoalInfoModal = ({
  isOpen,
  onClose,
  goalId,
}: GoalInfoModalProps) => {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();

  const { data, isLoading, error } = useGetGoalQuery(goalId);

  if (!isOpen) return null;
  if (isLoading) return <Spinner />;
  if (error || !data?.goal) return <NotFoundDataAnimation />;

  const { goal, savings } = data;
  const achieveDate = new Date(goal.achieveDate);
  const progress = Math.min(
    (goal.currentAmount * 100) / goal.targetAmount,
    100,
  );

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title={goal.name}
      size="lg"
      body={
        <VStack spacing={6} align="stretch">
          <DonutChart
            spentAmount={goal.currentAmount}
            limitAmount={goal.targetAmount}
            progress={progress}
            reverseColor
          />
          <VStack spacing={4} align="start">
            <Box>
              <Text as="span" fontWeight="normal">
                {t("out of", {
                  currentAmount: goal.currentAmount,
                  targetAmount: goal.targetAmount,
                })}
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
            <Box>
              <Text as="span" fontWeight="normal">
                {t("remain_amount", {
                  date: achieveDate.toLocaleDateString(),
                  how_many_month: formatCurrency(
                    savings.monthly,
                    budget?.settings,
                  ),
                  how_many_week: formatCurrency(
                    savings.weekly,
                    budget?.settings,
                  ),
                  how_many_day: formatCurrency(savings.daily, budget?.settings),
                })}
              </Text>
            </Box>
          </VStack>
        </VStack>
      }
      footer={null}
    />
  );
};
