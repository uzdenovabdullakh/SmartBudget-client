import React from "react";
import { DefaultModalProps } from "@/lib/types/types";
import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DefaultModal } from "..";

type DeleteModalProps = {
  entity: {
    type: string;
    name: string;
  };
  onDelete: () => void;
  isLoading: boolean;
} & DefaultModalProps;

export const DeleteModal = ({
  isOpen,
  onClose,
  onDelete,
  entity,
  isLoading,
}: DeleteModalProps) => {
  const { t } = useTranslation();

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("Delete", {
        entity: entity.type,
      })}
      size="sm"
      body={t("Do you want to delete", {
        entity: entity.name,
        type: entity.type,
      })}
      footer={
        <Button colorScheme="red" onClick={onDelete} isLoading={isLoading}>
          {t("Confirm Delete")}
        </Button>
      }
    />
  );
};
