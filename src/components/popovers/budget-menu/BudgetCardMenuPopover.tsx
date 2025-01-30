import { useDisclosure, IconButton, Button, VStack } from "@chakra-ui/react";
import { FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";
import { EditBudgetModal } from "@/components/modals/edit-budget/EditBudget";
import { DeleteModal } from "@/components/modals/delete/Delete";
import { BasePopover } from "..";

export const BudgetCardMenuPopover = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const triggerButton = (
    <IconButton
      icon={<FiMoreVertical />}
      aria-label="Options"
      onClick={onToggle}
    />
  );

  const bodyContent = (
    <VStack spacing={4} align="stretch">
      <Button leftIcon={<FiEdit />} onClick={onEditModalOpen}>
        Edit
      </Button>
      <Button leftIcon={<FiTrash2 />} onClick={onDeleteModalOpen}>
        Delete
      </Button>
    </VStack>
  );

  return (
    <>
      <BasePopover
        triggerButton={triggerButton}
        isOpen={isOpen}
        onClose={onClose}
        bodyContent={bodyContent}
        footerContent=""
      />
      <EditBudgetModal isOpen={isEditModalOpen} onClose={onEditModalClose} />
      <DeleteModal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} />
    </>
  );
};
