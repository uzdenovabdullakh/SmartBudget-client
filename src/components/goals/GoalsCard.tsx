import { Box, Text, HStack, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Goal } from "@/lib/types/goal.types";
import { BaseCard } from "../ui/BaseCard";
import { GoalAnimation } from "../ui/Animations";
import { EditGoalModal } from "../modals/edit-goal/EditGoalModal";

type GoalsCardProps = {
  goal: Goal;
};

export function GoalsCard({ goal }: GoalsCardProps) {
  const { t } = useTranslation();
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <BaseCard height="250px" width="250px" position="relative">
      <HStack justifyContent="space-between" alignItems="start">
        <Box flex={1} onClick={onOpen}>
          <Text fontSize="xl" fontWeight="bold">
            {goal.name}
          </Text>
          <GoalAnimation loop={false} width={120} height={120} />
          <Text fontSize="md">
            {t("last_updated")}: {new Date(goal.updatedAt).toLocaleDateString()}
          </Text>
        </Box>
        <EditGoalModal onClose={onClose} isOpen={isOpen} goal={goal} />
      </HStack>
    </BaseCard>
  );
}
