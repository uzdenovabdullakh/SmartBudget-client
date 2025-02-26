import { Category, CategoryGroup } from "@/lib/types/category.types";
import { Table, Tbody, Td, Box, Input, Text } from "@chakra-ui/react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AssigningChangeDto,
  AssigningChangeSchema,
} from "@/lib/validation/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useCategoryManagement } from "@/lib/hooks/useCategoryManagment";
import { useBudgetInspector } from "@/lib/context/BudgetInspectorContext";
import { SortableItem } from "../dnd/SortableItem";
import { CategoryChangePopover } from "../popovers/category/CategoryChangePopover";
import { MoveAvailablePopover } from "../popovers/category/MoveAvailablePopover";
import { ProgressBar } from "../ui/ProgressBar";

type CategoryTableProps = {
  group: CategoryGroup;
  formatCurrency: (value: number) => string;
  handleCategoryGroupsChange: React.Dispatch<
    React.SetStateAction<CategoryGroup[]>
  >;
};

export const CategoryTable = ({
  group,
  formatCurrency,
  handleCategoryGroupsChange,
}: CategoryTableProps) => {
  const { t } = useTranslation();
  const { setSelectedCategory } = useBudgetInspector();

  const { handleSubmit, control, setValue } = useForm<AssigningChangeDto>({
    resolver: zodResolver(AssigningChangeSchema),
  });

  const { handleAssignChange, handleDeleteCategory, handleUpdateCategoryName } =
    useCategoryManagement(handleCategoryGroupsChange);

  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const onSubmit = useCallback(
    (categoryId: string) => async (data: AssigningChangeDto) => {
      setEditingCategory(null);

      await handleAssignChange(categoryId, data);
    },
    [handleAssignChange],
  );

  const handleEditStart = (category: Category) => {
    setEditingCategory(category.id);
    setValue("assigned", category.assigned);
  };

  const handleOpenBudgetInspector = (category: Category) => {
    setSelectedCategory(category);
  };

  const renderCategoryRow = (category: Category) => (
    <SortableItem
      key={category.id}
      id={category.id}
      nodeType="table"
      onClick={() => handleOpenBudgetInspector(category)}
    >
      <Td width="40%">
        <CategoryChangePopover
          entity={category}
          onUpdate={handleUpdateCategoryName}
          onDelete={handleDeleteCategory}
        />
        <Box mt={2}>
          <ProgressBar
            spentAmount={category?.categorySpending?.spentAmount}
            limitAmount={category?.categorySpending?.limitAmount}
          />
        </Box>
      </Td>
      <Td width="20%" textAlign="center">
        {editingCategory === category.id ? (
          <Controller
            name="assigned"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                size="sm"
                autoFocus
                width="80px"
                textAlign="center"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
                onBlur={handleSubmit(onSubmit(category.id))}
              />
            )}
          />
        ) : (
          <Text
            onClick={() => handleEditStart(category)}
            cursor="pointer"
            textAlign="center"
          >
            {formatCurrency(category.assigned)}
          </Text>
        )}
      </Td>
      <Td width="20%" textAlign="center">
        {formatCurrency(category.activity)}
      </Td>
      <Td width="20%" textAlign="center">
        <MoveAvailablePopover
          category={category}
          formatCurrency={formatCurrency}
        />
      </Td>
    </SortableItem>
  );

  const renderEmptyRow = () => (
    <SortableItem key={group.id} id={group.id} nodeType="table">
      <Td colSpan={4}>
        <Box
          id={group.id}
          minHeight="50px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="2px dashed #ccc"
          borderRadius="md"
          color="#aaa"
          fontStyle="italic"
        >
          {t("Create or drag a category here")}
        </Box>
      </Td>
    </SortableItem>
  );

  return (
    <SortableContext
      items={group.categories.map((cat) => cat.id)}
      strategy={verticalListSortingStrategy}
    >
      <Table variant="simple" width="100%">
        <Tbody>
          {group.categories.length === 0
            ? renderEmptyRow()
            : group.categories.map(renderCategoryRow)}
        </Tbody>
      </Table>
    </SortableContext>
  );
};
