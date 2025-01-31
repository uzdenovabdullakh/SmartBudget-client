import { useDisclosure, IconButton, Button, VStack } from "@chakra-ui/react";
import { FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";
import { EditBudgetModal } from "@/components/modals/edit-budget/EditBudget";
import { DeleteModal } from "@/components/modals/delete/Delete";
import { useDeleteBudgetMutation } from "@/lib/services/budget.api";
import { Budget } from "@/lib/types/budget.types";
import { showToast } from "@/lib/utils/toast";
import { BasePopover } from "..";

type BudgetCardMenuPopoverProps = {
  budget: Budget;
};

export const BudgetCardMenuPopover = ({
  budget,
}: BudgetCardMenuPopoverProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const [deleteBudgetMutation] = useDeleteBudgetMutation();

  const handleDelete = async () => {
    try {
      const { message } = await deleteBudgetMutation(budget.id).unwrap();
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
        Edit
      </Button>
      <Button leftIcon={<FiTrash2 />} onClick={deleteModal.onOpen}>
        Delete
      </Button>
    </VStack>
  );

  const entity = { type: "Budget", name: budget.name };

  return (
    <>
      <BasePopover
        triggerButton={triggerButton}
        isOpen={isOpen}
        onClose={onClose}
        bodyContent={bodyContent}
        footerContent=""
      />
      <EditBudgetModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        budget={budget}
      />
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onDelete={handleDelete}
        entity={entity}
      />
    </>
  );
};
