import { Box, Text, HStack, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Goal } from "@/lib/types/goal.types";
import { BaseCard } from "../ui/BaseCard";
import { GoalAnimation } from "../ui/Animations";
import { GoalInfoModal } from "../modals/goal/GoalInfoModal";
import { GoalCardMenuPopover } from "../popovers/goal-menu/GoalCardMenuPopover";

type GoalsCardProps = {
  goal: Goal;
};

export function GoalsCard({ goal }: GoalsCardProps) {
  const { t } = useTranslation();
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <BaseCard height="250px" width="300px" position="relative">
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
        <GoalCardMenuPopover goal={goal} />
        <GoalInfoModal onClose={onClose} isOpen={isOpen} goalId={goal.id} />
      </HStack>
    </BaseCard>
  );
}
