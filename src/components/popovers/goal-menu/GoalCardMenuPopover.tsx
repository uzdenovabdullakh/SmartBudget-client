import { useDisclosure, IconButton, Button, VStack } from "@chakra-ui/react";
import { FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";
import { DeleteModal } from "@/components/modals/delete/Delete";
import { showToast } from "@/lib/utils/toast";
import { useTranslation } from "react-i18next";
import { Goal } from "@/lib/types/goal.types";
import { EditGoalModal } from "@/components/modals/goal/EditGoalModal";
import { useRemoveGoalMutation } from "@/lib/services/goal.api";
import { BasePopover } from "..";

type GoalCardMenuPopoverProps = {
  goal: Goal;
};

export const GoalCardMenuPopover = ({ goal }: GoalCardMenuPopoverProps) => {
  const { t } = useTranslation();

  const { isOpen, onToggle, onClose } = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const [deleteGoal, { isLoading }] = useRemoveGoalMutation();

  const handleDelete = async () => {
    try {
      const { message } = await deleteGoal(goal.id).unwrap();
      deleteModal.onClose();

      showToast({
        title: message,
        status: "info",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const triggerButton = (
    <IconButton
      icon={<FiMoreVertical />}
      aria-label="Options"
      onClick={onToggle}
    />
  );

  const bodyContent = (
    <VStack spacing={4} align="stretch">
      <Button leftIcon={<FiEdit />} onClick={editModal.onOpen}>
        {t("Edit")}
      </Button>
      <Button leftIcon={<FiTrash2 />} onClick={deleteModal.onOpen}>
        {t("Delete", {
          entity: "",
        })}
      </Button>
    </VStack>
  );

  const entity = { type: t("goal"), name: goal.name };

  return (
    <>
      <BasePopover
        triggerButton={triggerButton}
        isOpen={isOpen}
        onClose={onClose}
        bodyContent={bodyContent}
        footerContent=""
      />
      <EditGoalModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        goal={goal}
      />
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        isLoading={isLoading}
        onDelete={handleDelete}
        entity={entity}
      />
    </>
  );
};
