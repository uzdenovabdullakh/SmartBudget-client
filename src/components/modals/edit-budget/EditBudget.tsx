import React from "react";
import { DefaultModalProps } from "@/lib/types/types";
import { DefaultModal } from "..";

export const EditBudgetModal = ({ isOpen, onClose }: DefaultModalProps) => {
  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit budget"
      size="md"
      body={<>Edit budget</>}
      footer={<>Edit budget</>}
    />
  );
};
