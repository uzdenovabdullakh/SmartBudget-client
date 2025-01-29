import React from "react";
import { DefaultModalProps } from "@/lib/types/types";
import { DefaultModal } from "..";

export const AddBudgetModal = ({ isOpen, onClose }: DefaultModalProps) => {
  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create new budget"
      body={<>Add</>}
      size="md"
    />
  );
};
