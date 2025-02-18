import { Category, CategoryGroup } from "@/lib/types/category.types";
import { Table, Tbody, Td, Box, Input } from "@chakra-ui/react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useAssignChangeMutation,
  useRemoveCategoryMutation,
  useUpdateCategoryMutation,
} from "@/lib/services/category.api";
import {
  AssigningChangeDto,
  AssigningChangeSchema,
} from "@/lib/validation/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { showToast } from "@/lib/utils/toast";
import { SortableItem } from "../dnd/SortableItem";
import { CategoryChangePopover } from "../popovers/category/CategoryChangePopover";

export const CategoryTable = ({
  group,
  formatCurrency,
  handleCategoryGroupsChange,
}: {
  group: CategoryGroup;
  formatCurrency: (value: number) => string;
  handleCategoryGroupsChange: React.Dispatch<
    React.SetStateAction<CategoryGroup[]>
  >;
}) => {
  const { t } = useTranslation();

  const { handleSubmit, control, setValue } = useForm<AssigningChangeDto>({
    resolver: zodResolver(AssigningChangeSchema),
  });

  const [assignChange] = useAssignChangeMutation();
  const [removeCategory] = useRemoveCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const onSubmit = useCallback(
    (categoryId: string) => async (data: AssigningChangeDto) => {
      setEditingCategory(null);

      handleCategoryGroupsChange((prevGroups) =>
        prevGroups.map((g) => {
          const updatedCategories = g.categories.map((c) => {
            if (c.id !== categoryId) {
              return c;
            }

            const assignedDifference = data.assigned - c.assigned;

            return {
              ...c,
              assigned: data.assigned,
              available: c.available + assignedDifference,
            };
          });
          return {
            ...g,
            categories: updatedCategories,
          };
        }),
      );

      await assignChange({ id: categoryId, assigned: data.assigned });
    },
    [assignChange, handleCategoryGroupsChange],
  );

  const handleEditStart = (category: Category) => {
    setEditingCategory(category.id);
    setValue("assigned", category.assigned);
  };

  const handleUpdateGroupName = useCallback(
    async (id: string, newName: string) => {
      handleCategoryGroupsChange((prevGroups) =>
        prevGroups.map((g) => {
          const updatedCategories = g.categories.map((c) => {
            if (c.id !== id) {
              return c;
            }

            return {
              ...c,
              name: newName,
            };
          });
          return {
            ...g,
            categories: updatedCategories,
          };
        }),
      );

      const { message } = await updateCategory({
        id,
        name: newName,
      }).unwrap();
      showToast({
        title: message,
        status: "success",
      });
    },
    [handleCategoryGroupsChange, updateCategory],
  );

  const handleDeleteGroup = useCallback(
    async (id: string) => {
      handleCategoryGroupsChange((prevGroups) =>
        prevGroups.map((g) => {
          const updatedCategories = g.categories.filter((c) => c.id !== id);
          return {
            ...g,
            categories: updatedCategories,
          };
        }),
      );

      const { message } = await removeCategory(id).unwrap();
      showToast({
        title: message,
        status: "success",
      });
    },
    [handleCategoryGroupsChange, removeCategory],
  );

  return (
    <SortableContext
      items={group.categories.map((cat) => cat.id)}
      strategy={verticalListSortingStrategy}
    >
      <Table variant="simple" width="100%">
        <Tbody>
          {group.categories.length === 0 ? (
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
          ) : (
            group.categories.map((category) => (
              <SortableItem key={category.id} id={category.id} nodeType="table">
                <Td width="40%">
                  <CategoryChangePopover
                    entity={category}
                    onUpdate={handleUpdateGroupName}
                    onDelete={handleDeleteGroup}
                  />
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
                          value={field.value ?? ""}
                          size="sm"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          onBlur={handleSubmit(onSubmit(category.id))}
                          autoFocus
                          width="80px"
                          textAlign="center"
                        />
                      )}
                    />
                  ) : (
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStart(category);
                      }}
                      cursor="pointer"
                      width="80px"
                      textAlign="center"
                      display="inline-block"
                    >
                      {formatCurrency(category.assigned)}
                    </Box>
                  )}
                </Td>
                <Td width="20%" textAlign="center">
                  {formatCurrency(category.activity)}
                </Td>
                <Td width="20%" textAlign="center">
                  {formatCurrency(category.available)}
                </Td>
              </SortableItem>
            ))
          )}
        </Tbody>
      </Table>
    </SortableContext>
  );
};
