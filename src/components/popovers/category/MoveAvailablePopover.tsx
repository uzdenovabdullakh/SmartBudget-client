import { useCallback, useState } from "react";
import { HStack, useDisclosure, Button, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MoveAvaliableDto,
  MoveAvaliableSchema,
} from "@/lib/validation/category.schema";
import { useMoveAvailableMutation } from "@/lib/services/category.api";
import { Category } from "@/lib/types/category.types";
import { CategorySelect } from "@/components/forms/CategorySelect";
import FormInputUI from "@/components/ui/FormInputUI";
import { ColoredCurrency } from "@/components/ui/ColoredCurrency";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { useGetCategoryGroupQuery } from "@/lib/services/category-group.api";
import { useScrollControl } from "@/lib/hooks/useScrollControl";
import { BasePopover } from "..";

export const MoveAvailablePopover = ({ category }: { category: Category }) => {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [moveAvailable] = useMoveAvailableMutation();

  useScrollControl(isOpen);

  const { data: categoryGroups } = useGetCategoryGroupQuery(
    {
      id: budget?.id!,
      defaultCategory: true,
    },
    {
      skip: !budget?.id,
    },
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const isNegative = category.available < 0;

  const { register, handleSubmit, control, reset } = useForm<MoveAvaliableDto>({
    resolver: zodResolver(MoveAvaliableSchema),
    defaultValues: {
      from: category.id,
      amount: category.available,
    },
  });

  const handleApply = useCallback(
    async (data: MoveAvaliableDto) => {
      if (isNegative && selectedCategoryId) {
        const selectedCategory = categoryGroups
          ?.flatMap((group) => group.categories)
          .find((cat) => cat.id === selectedCategoryId);

        if (selectedCategory) {
          const finalData = {
            from: selectedCategoryId,
            to: category.id,
            amount: Math.min(
              Math.abs(category.available),
              selectedCategory.available,
            ),
          };
          await moveAvailable(finalData);
        }
      } else if (!isNegative) {
        await moveAvailable(data);
      }

      onClose();
      reset();
      setSelectedCategoryId(null);
    },
    [
      isNegative,
      selectedCategoryId,
      onClose,
      reset,
      categoryGroups,
      category.id,
      category.available,
      moveAvailable,
    ],
  );

  return (
    <BasePopover
      isOpen={isOpen}
      placement="start-start"
      strategy="fixed"
      onClose={onClose}
      triggerButton={
        <ColoredCurrency
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          _hover={{ opacity: 0.8 }}
          currency={category.available}
          nodeType="button"
        />
      }
      bodyContent={
        <VStack as="form" onSubmit={handleSubmit(handleApply)} spacing={4}>
          {!isNegative && (
            <FormInputUI
              {...register("amount", { valueAsNumber: true })}
              placeholder={t("Amount")}
              type="number"
              label={t("Move")}
            />
          )}
          <Controller
            name="to"
            control={control}
            render={({ field }) => (
              <CategorySelect
                onlyPositiveAvailable={isNegative}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setSelectedCategoryId(value);
                }}
                label={isNegative ? t("Cover expenses from category") : t("In")}
              />
            )}
          />
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
