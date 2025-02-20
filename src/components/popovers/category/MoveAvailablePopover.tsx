import { useCallback, useEffect, useState } from "react";
import {
  Input,
  HStack,
  useDisclosure,
  Button,
  VStack,
  Select,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MoveAvaliableDto,
  MoveAvaliableSchema,
} from "@/lib/validation/category.schema";
import { useMoveAvailableMutation } from "@/lib/services/category.api";
import { Category, CategoryGroup } from "@/lib/types/category.types";
import { useLazyGetCategoryGroupQuery } from "@/lib/services/category-group.api";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { BasePopover } from "..";

export const MoveAvailablePopover = ({
  category,
  formatCurrency,
}: {
  category: Category;
  formatCurrency: (value: number) => string;
}) => {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();

  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);

  const { isOpen, onToggle, onClose } = useDisclosure();

  const [getCategoryGroup] = useLazyGetCategoryGroupQuery();
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

  useEffect(() => {
    if (!budget?.id) return;
    getCategoryGroup({ id: budget.id, defaultCategory: true })
      .unwrap()
      .then(setCategoryGroups)
      .catch(console.error);
  }, [budget?.id, getCategoryGroup]);

  return (
    <BasePopover
      isOpen={isOpen}
      onClose={onClose}
      triggerButton={
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <span onClick={onToggle}>{formatCurrency(category.available)}</span>
      }
      bodyContent={
        <VStack as="form" onSubmit={handleSubmit(handleApply)}>
          <Input
            {...register("amount", { valueAsNumber: true })}
            placeholder={t("Amount")}
            type="number"
          />
          <Select
            {...register("to")}
            placeholder={t("To")}
            variant="filled"
            size="md"
            sx={{
              "& > optgroup": {
                backgroundColor: "#f9f9f9",
                color: "#333",
                padding: "8px",
                fontWeight: "bold",
              },
              "& > option": {
                paddingLeft: "24px",
                fontSize: "14px",
                display: "flex",
                justifyContent: "space-between",
              },
            }}
          >
            {categoryGroups.map((group) => (
              <optgroup key={group.id} label={`${group.name}:`}>
                {group.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}&nbsp;&nbsp;&nbsp;{formatCurrency(cat.available)}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
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
