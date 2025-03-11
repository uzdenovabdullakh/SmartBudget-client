import { useCallback } from "react";
import { Input, HStack, Box, useDisclosure, Text } from "@chakra-ui/react";
import { Category, CategoryGroup } from "@/lib/types/category.types";
import { useTranslation } from "react-i18next";
import { DivButton } from "@/components/ui/DivButton";
import { useForm } from "react-hook-form";
import {
  UpdateCategoryGroupDto,
  UpdateCategoryGroupSchema,
} from "@/lib/validation/category-group.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateCategorySchema,
  UpdateCategoryDto,
} from "@/lib/validation/category.schema";
import { useScrollControl } from "@/lib/hooks/useScrollControl";
import { BasePopover } from "..";

type CategoryChangePopoverProps<T> = {
  entity: T;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
};

export const CategoryChangePopover = ({
  entity,
  onUpdate,
  onDelete,
}: CategoryChangePopoverProps<Category | CategoryGroup>) => {
  const { t } = useTranslation();
  const { isOpen, onToggle, onClose } = useDisclosure();

  useScrollControl(isOpen);

  const isCategoryGroup = "categories" in entity;
  const schema = isCategoryGroup
    ? UpdateCategoryGroupSchema
    : UpdateCategorySchema;

  const { register, handleSubmit } = useForm<
    UpdateCategoryGroupDto | UpdateCategoryDto
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      name: entity.name,
    },
  });

  const handleApply = useCallback(
    (data: UpdateCategoryGroupDto | UpdateCategoryDto) => {
      if (data?.name) {
        onUpdate(entity.id, data?.name);
      }
      onClose();
    },
    [entity.id, onClose, onUpdate],
  );

  const handleDelete = useCallback(() => {
    onDelete(entity.id);

    onClose();
  }, [entity.id, onClose, onDelete]);

  return (
    <BasePopover
      isOpen={isOpen}
      onClose={onClose}
      triggerButton={
        <Box cursor="pointer" role="button" _hover={{ textDecor: "underline" }}>
          <Text
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {entity.name}
          </Text>
        </Box>
      }
      bodyContent={
        <form onSubmit={handleSubmit(handleApply)}>
          <Input {...register("name")} />
        </form>
      }
      footerContent={
        <HStack spacing={4} justifyContent="space-between">
          <DivButton
            onClick={handleDelete}
            bgColor="red.500"
            _hoverBg="red.600"
          >
            {t("Delete", { entity: "" })}
          </DivButton>
          <HStack>
            <DivButton
              onClick={onClose}
              bgColor="gray.200"
              _hoverBg="gray.300"
              color="black"
            >
              {t("Cancel")}
            </DivButton>
            <DivButton
              onClick={handleSubmit(handleApply)}
              bgColor="blue.500"
              _hoverBg="blue.600"
            >
              {t("OK")}
            </DivButton>
          </HStack>
        </HStack>
      }
      contentProps={{ width: "400px", maxWidth: "90vw" }}
    />
  );
};
