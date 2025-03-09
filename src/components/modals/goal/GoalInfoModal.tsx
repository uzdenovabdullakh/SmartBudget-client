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

  const formattedDate = achieveDate.toLocaleDateString();
  const formattedMonthly = formatCurrency(savings.monthly, budget?.settings);
  const formattedWeekly = formatCurrency(savings.weekly, budget?.settings);
  const formattedDaily = formatCurrency(savings.daily, budget?.settings);

  const remainAmountText = t("remain_amount", {
    date: "__DATE__",
    how_many_month: "__MONTHLY__",
    how_many_week: "__WEEKLY__",
    how_many_day: "__DAILY__",
  });

  const parts = remainAmountText.split(
    /(__DATE__|__MONTHLY__|__WEEKLY__|__DAILY__)/,
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
                {t("Achieve date")}
                <Text as="span" fontWeight="normal">
                  {formattedDate}
                </Text>
              </Text>
            </Box>
            <Box pb={4}>
              {progress === 100 ? (
                <Text>{t("You reached your target!")}</Text>
              ) : (
                <Text fontWeight="normal">
                  {parts.map((part) => {
                    switch (part) {
                      case "__DATE__":
                        return (
                          <Text
                            as="span"
                            key={part}
                            color="tan"
                            fontWeight="bold"
                          >
                            {formattedDate}
                          </Text>
                        );
                      case "__MONTHLY__":
                        return (
                          <Text
                            as="span"
                            key={part}
                            color="teal.500"
                            fontWeight="bold"
                          >
                            {formattedMonthly}
                          </Text>
                        );
                      case "__WEEKLY__":
                        return (
                          <Text
                            as="span"
                            key={part}
                            color="teal.500"
                            fontWeight="bold"
                          >
                            {formattedWeekly}
                          </Text>
                        );
                      case "__DAILY__":
                        return (
                          <Text
                            as="span"
                            key={part}
                            color="teal.500"
                            fontWeight="bold"
                          >
                            {formattedDaily}
                          </Text>
                        );
                      default:
                        return part;
                    }
                  })}
                </Text>
              )}
            </Box>
          </VStack>
        </VStack>
      }
      footer={null}
    />
  );
};
