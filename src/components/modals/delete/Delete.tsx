import React from "react";
import { DefaultModalProps } from "@/lib/types/types";
import { DefaultModal } from "..";

export const DeleteModal = ({ isOpen, onClose }: DefaultModalProps) => {
  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete"
      size="md"
      body={<>Delete</>}
      footer={<>Delete</>}
    />
  );
};
