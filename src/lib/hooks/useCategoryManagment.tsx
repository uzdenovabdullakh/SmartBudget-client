import { useCallback } from "react";
import { showToast } from "@/lib/utils/toast";
import {
  useUpdateCategoryGroupMutation,
  useRemoveCategoryGroupMutation,
  useCreateCategoryGroupMutation,
} from "@/lib/services/category-group.api";
import { CreateCategoryDto } from "@/lib/validation/category.schema";
import { useCreateCategoryMutation } from "../services/category.api";
import { CreateCategoryGroupDto } from "../validation/category-group.schema";

export const useCategoryManagement = () => {
  const [createCategoryGroup] = useCreateCategoryGroupMutation();
  const [updateCategoryGroup] = useUpdateCategoryGroupMutation();
  const [removeCategoryGroup] = useRemoveCategoryGroupMutation();
  const [createCategory] = useCreateCategoryMutation();

  const handleCreateCategoryGroup = useCallback(
    async (data: CreateCategoryGroupDto) => {
      const { message } = await createCategoryGroup(data).unwrap();
      showToast({
        title: message,
        status: "success",
      });
    },
    [createCategoryGroup],
  );

  const handleUpdateGroupName = useCallback(
    async (id: string, newName: string) => {
      const { message } = await updateCategoryGroup({
        id,
        name: newName,
      }).unwrap();
      showToast({ title: message, status: "success" });
    },
    [updateCategoryGroup],
  );

  const handleDeleteGroup = useCallback(
    async (id: string) => {
      const { message } = await removeCategoryGroup(id).unwrap();
      showToast({ title: message, status: "success" });
    },
    [removeCategoryGroup],
  );

  const handleCreateCategory = useCallback(
    async (data: CreateCategoryDto) => {
      const { message } = await createCategory(data).unwrap();
      showToast({ title: message, status: "success" });
    },
    [createCategory],
  );

  return {
    handleCreateCategoryGroup,
    handleUpdateGroupName,
    handleDeleteGroup,
    handleCreateCategory,
  };
};
