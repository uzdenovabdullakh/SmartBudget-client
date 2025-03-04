import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  useReorderCategoriesMutation,
  useUpdateCategoryMutation,
} from "@/lib/services/category.api";
import { CategoryGroup } from "@/lib/types/category.types";
import { useCallback } from "react";
import { useReorderCategoryGroupsMutation } from "../services/category-group.api";

export const useDragEnd = (
  categoryGroups: CategoryGroup[],
  setCategoryGroups: (groups: CategoryGroup[]) => void,
) => {
  const [updateCategory] = useUpdateCategoryMutation();
  const [reorderGroups] = useReorderCategoryGroupsMutation();
  const [reorderCategories] = useReorderCategoriesMutation();

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      // Если перетаскивается группа
      const activeGroupIndex = categoryGroups.findIndex(
        (group) => group.id === activeId,
      );
      const overGroupIndex = categoryGroups.findIndex(
        (group) => group.id === overId,
      );

      // Перемещение группы
      if (activeGroupIndex !== -1 && overGroupIndex !== -1) {
        const newGroups = arrayMove(
          categoryGroups,
          activeGroupIndex,
          overGroupIndex,
        ).map((group, index) => ({ ...group, order: index }));

        setCategoryGroups(newGroups);

        // Обновляем порядок у всех групп
        await reorderGroups({
          groups: newGroups.map(({ id, order }) => ({ id, order })),
        });

        return;
      }

      // Если перетаскивается категория
      const sourceGroup = categoryGroups.find((group) =>
        group.categories.some((cat) => cat.id === activeId),
      );
      const targetGroup =
        categoryGroups.find((group) =>
          group.categories.some((cat) => cat.id === overId),
        ) ||
        categoryGroups.find((group) => group.id === overId) ||
        sourceGroup;

      if (!sourceGroup || !targetGroup) return;

      // Перемещение внутри одной группы
      if (sourceGroup.id === targetGroup.id) {
        const oldIndex = sourceGroup.categories.findIndex(
          (c) => c.id === activeId,
        );
        const newIndex = targetGroup.categories.findIndex(
          (c) => c.id === overId,
        );

        const updatedCategories = arrayMove(
          sourceGroup.categories,
          oldIndex,
          newIndex,
        ).map((category, index) => ({ ...category, order: index }));

        setCategoryGroups(
          categoryGroups.map((group) =>
            group.id === sourceGroup.id
              ? { ...group, categories: updatedCategories }
              : group,
          ),
        );

        // Обновляем порядок у всех категорий в группе
        await reorderCategories({
          categories: updatedCategories.map(({ id, order }) => ({
            id,
            groupId: sourceGroup.id,
            order,
          })),
        });
        return;
      }

      // Перемещение в другую группу
      const movedCategory = sourceGroup.categories.find(
        (c) => c.id === activeId,
      );
      if (!movedCategory) return;

      const newSourceCategories = sourceGroup.categories
        .filter((c) => c.id !== activeId)
        .map((category, index) => ({ ...category, order: index }));

      const newTargetCategories = [
        ...targetGroup.categories,
        movedCategory,
      ].map((category, index) => ({ ...category, order: index }));

      setCategoryGroups(
        categoryGroups.map((group) => {
          if (group.id === sourceGroup.id)
            return { ...group, categories: newSourceCategories };
          if (group.id === targetGroup.id)
            return { ...group, categories: newTargetCategories };
          return group;
        }),
      );

      // Обновляем порядок у всех категорий в исходной и целевой группе
      await reorderCategories({
        categories: [
          ...newSourceCategories.map(({ id, order }) => ({
            id,
            groupId: sourceGroup.id,
            order,
          })),
          ...newTargetCategories.map(({ id, order }) => ({
            id,
            groupId: targetGroup.id,
            order,
          })),
        ],
      });

      // меняем группу у категории
      await updateCategory({
        id: activeId as string,
        groupId: targetGroup.id,
      });
    },
    [
      categoryGroups,
      reorderCategories,
      reorderGroups,
      setCategoryGroups,
      updateCategory,
    ],
  );

  return { handleDragEnd };
};
