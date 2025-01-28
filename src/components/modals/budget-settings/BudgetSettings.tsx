import React from "react";
import { DefaultModalProps } from "@/lib/types/types";
import { DefaultModal } from "..";

export const ChangeBudgetSettingsModal = ({
  isOpen,
  onClose,
}: DefaultModalProps) => {
  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title="Change budget settings"
      body={<>Change</>}
      size="md"
    />
  );
};
