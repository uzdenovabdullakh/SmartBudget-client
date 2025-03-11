import { useCallback, useEffect } from "react";
import { Input, HStack, Box, useDisclosure, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DivButton } from "@/components/ui/DivButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCategoryGroupDto,
  CreateCategoryGroupSchema,
} from "@/lib/validation/category-group.schema";
import {
  CreateCategoryDto,
  CreateCategorySchema,
} from "@/lib/validation/category.schema";
import { AddIcon } from "@chakra-ui/icons";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { useScrollControl } from "@/lib/hooks/useScrollControl";
import { BasePopover } from "..";

type CategoryCreatePopoverProps<T> = {
  isCategoryGroup: boolean;
  groupId?: string;
  onCreate: (data: T) => void;
  onOpenPopover?: () => void;
  onClosePopover?: () => void;
};

export const CategoryCreatePopover = ({
  isCategoryGroup,
  groupId,
  onCreate,
  onOpenPopover,
  onClosePopover,
}: CategoryCreatePopoverProps<CreateCategoryGroupDto | CreateCategoryDto>) => {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();

  const { isOpen, onToggle, onClose } = useDisclosure();

  useScrollControl(isOpen);

  const schema = isCategoryGroup
    ? CreateCategoryGroupSchema
    : CreateCategorySchema;

  const { register, handleSubmit, reset } = useForm<
    CreateCategoryGroupDto | CreateCategoryDto
  >({
    resolver: zodResolver(schema),
    defaultValues: isCategoryGroup ? { budgetId: budget?.id } : { groupId },
  });

  const handleApply = useCallback(
    (data: CreateCategoryGroupDto | CreateCategoryDto) => {
      onCreate(data);
      if (onClosePopover) {
        onClosePopover();
      }
      onClose();
    },
    [onClosePopover, onCreate, onClose],
  );

  const handleOpen = () => {
    if (onOpenPopover) {
      onOpenPopover();
    }
    onToggle();
  };

  const handleClose = () => {
    if (onClosePopover) {
      onClosePopover();
    }
    onClose();
  };

  useEffect(() => {
    if (isCategoryGroup) {
      reset({
        budgetId: budget?.id,
      });
    }
  }, [budget?.id, isCategoryGroup, reset]);

  const placeholder = isCategoryGroup
    ? t("Create category group")
    : t("Create category");

  const triggerButton = (
    <Box
      as="span"
      role="button"
      cursor="pointer"
      color="blue.500"
      _hover={{ color: "blue.600" }}
      ml={2}
      onClick={handleOpen}
    >
      {isCategoryGroup ? (
        <HStack spacing={1}>
          <AddIcon w={3} h={3} />
          <Text fontSize="sm" fontWeight="bold">
            {t("Create category group")}
          </Text>
        </HStack>
      ) : (
        <AddIcon w={3} h={3} />
      )}
    </Box>
  );

  return (
    <BasePopover
      isOpen={isOpen}
      onClose={handleClose}
      triggerButton={triggerButton}
      bodyContent={
        <form onSubmit={handleSubmit(handleApply)}>
          <Input {...register("name")} placeholder={placeholder} />
        </form>
      }
      footerContent={
        <HStack spacing={4} justifyContent="flex-end">
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
      }
    />
  );
};
