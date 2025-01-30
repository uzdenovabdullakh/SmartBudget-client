import React from "react";
import { DefaultModalProps } from "@/lib/types/types";
import { Button } from "@chakra-ui/react";
import { DefaultModal } from "..";

type DeleteModalProps = {
  entity: {
    type: string;
    name: string;
  };
  onDelete: () => void;
} & DefaultModalProps;

export const DeleteModal = ({
  isOpen,
  onClose,
  onDelete,
  entity,
}: DeleteModalProps) => (
  <DefaultModal
    isOpen={isOpen}
    onClose={onClose}
    title={`Delete ${entity.type}`}
    size="sm"
    body={`Do you want to delete ${entity.name}?`}
    footer={
      <Button colorScheme="red" onClick={onDelete}>
        Confirm Delete
      </Button>
    }
  />
);
