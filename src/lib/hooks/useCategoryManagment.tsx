import { useCallback } from "react";
import { showToast } from "@/lib/utils/toast";
import {
  useUpdateCategoryGroupMutation,
  useRemoveCategoryGroupMutation,
  useCreateCategoryGroupMutation,
} from "@/lib/services/category-group.api";
import {
  useAssignChangeMutation,
  useRemoveCategoryMutation,
  useUpdateCategoryMutation,
  useCreateCategoryMutation,
} from "@/lib/services/category.api";
import {
  CreateCategoryDto,
  AssigningChangeDto,
} from "@/lib/validation/category.schema";
import { CategoryGroup } from "@/lib/types/category.types";
import { CreateCategoryGroupDto } from "../validation/category-group.schema";

export const useCategoryManagement = (
  handleCategoryGroupsChange?: React.Dispatch<
    React.SetStateAction<CategoryGroup[]>
  >,
) => {
  const [createCategoryGroup] = useCreateCategoryGroupMutation();
  const [updateCategoryGroup] = useUpdateCategoryGroupMutation();
  const [removeCategoryGroup] = useRemoveCategoryGroupMutation();
  const [createCategory] = useCreateCategoryMutation();
  const [assignChange] = useAssignChangeMutation();
  const [removeCategory] = useRemoveCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const handleCreateCategoryGroup = useCallback(
    async (data: CreateCategoryGroupDto) => {
      const { message } = await createCategoryGroup(data).unwrap();
      showToast({ title: message, status: "success" });
    },
    [createCategoryGroup],
  );

  const handleUpdateGroupName = useCallback(
    async (id: string, newName: string) => {
      handleCategoryGroupsChange?.((prevGroups) =>
        prevGroups.map((g) => ({
          ...g,
          categories: g.categories.map((c) =>
            c.id === id ? { ...c, name: newName } : c,
          ),
        })),
      );

      const { message } = await updateCategoryGroup({
        id,
        name: newName,
      }).unwrap();
      showToast({ title: message, status: "success" });
    },
    [handleCategoryGroupsChange, updateCategoryGroup],
  );

  const handleDeleteGroup = useCallback(
    async (id: string) => {
      handleCategoryGroupsChange?.((prevGroups) =>
        prevGroups.map((g) => ({
          ...g,
          categories: g.categories.filter((c) => c.id !== id),
        })),
      );

      const { message } = await removeCategoryGroup(id).unwrap();
      showToast({ title: message, status: "success" });
    },
    [handleCategoryGroupsChange, removeCategoryGroup],
  );

  const handleAssignChange = useCallback(
    async (categoryId: string, data: AssigningChangeDto) => {
      handleCategoryGroupsChange?.((prevGroups) =>
        prevGroups.map((g) => ({
          ...g,
          categories: g.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  assigned: data.assigned,
                  available: c.available + (data.assigned - c.assigned),
                }
              : c,
          ),
        })),
      );

      await assignChange({ id: categoryId, assigned: data.assigned });
    },
    [assignChange, handleCategoryGroupsChange],
  );

  const handleCreateCategory = useCallback(
    async (data: CreateCategoryDto) => {
      const { message } = await createCategory(data).unwrap();
      showToast({ title: message, status: "success" });
    },
    [createCategory],
  );

  const handleDeleteCategory = useCallback(
    async (id: string) => {
      handleCategoryGroupsChange?.((prevGroups) =>
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

  const handleUpdateCategoryName = useCallback(
    async (id: string, newName: string) => {
      handleCategoryGroupsChange?.((prevGroups) =>
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

  return {
    handleCreateCategoryGroup,
    handleUpdateGroupName,
    handleDeleteGroup,
    handleCreateCategory,
    handleAssignChange,
    handleDeleteCategory,
    handleUpdateCategoryName,
  };
};
