import { useCallback } from "react";
import { HStack, useDisclosure, Button, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MoveAvaliableDto,
  MoveAvaliableSchema,
} from "@/lib/validation/category.schema";
import { useMoveAvailableMutation } from "@/lib/services/category.api";
import { Category } from "@/lib/types/category.types";
import { CategorySelect } from "@/components/category/CategorySelect";
import FormInputUI from "@/components/ui/FormInputUI";
import { BasePopover } from "..";

export const MoveAvailablePopover = ({
  category,
  formatCurrency,
}: {
  category: Category;
  formatCurrency: (value: number) => string;
}) => {
  const { t } = useTranslation();

  const { isOpen, onToggle, onClose } = useDisclosure();

  const [moveAvailable] = useMoveAvailableMutation();

  const { register, handleSubmit, reset } = useForm<MoveAvaliableDto>({
    resolver: zodResolver(MoveAvaliableSchema),
    defaultValues: {
      from: category.id,
      amount: category.available,
    },
  });

  const handleApply = useCallback(
    async (data: MoveAvaliableDto) => {
      await moveAvailable(data);

      onClose();
      reset();
    },
    [moveAvailable, onClose, reset],
  );

  return (
    <BasePopover
      isOpen={isOpen}
      onClose={onClose}
      triggerButton={
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <span onClick={onToggle}>{formatCurrency(category.available)}</span>
      }
      bodyContent={
        <VStack as="form" onSubmit={handleSubmit(handleApply)} spacing={4}>
          <FormInputUI
            {...register("amount", { valueAsNumber: true })}
            placeholder={t("Amount")}
            type="number"
            label={t("Move")}
          />
          <CategorySelect {...register("to")} label={t("In")} />
        </VStack>
      }
      footerContent={
        <HStack spacing={4} justifyContent="flex-end">
          <Button
            onClick={onClose}
            bgColor="gray.200"
            _hover={{ bg: "gray.300" }}
            color="black"
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleSubmit(handleApply)}
            bgColor="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
          >
            {t("OK")}
          </Button>
        </HStack>
      }
    />
  );
};
