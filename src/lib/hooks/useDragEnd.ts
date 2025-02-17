import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useUpdateCategoryMutation } from "@/lib/services/category.api";
import { showToast } from "@/lib/utils/toast";
import { CategoryGroup } from "@/lib/types/category.types";

export const useDragEnd = (
  categoryGroups: CategoryGroup[],
  setCategoryGroups: (groups: CategoryGroup[]) => void,
) => {
  const [moveCategory] = useUpdateCategoryMutation();

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Если перетаскивается группа
    const activeGroupIndex = categoryGroups.findIndex(
      (group) => group.id === active.id,
    );
    const overGroupIndex = categoryGroups.findIndex(
      (group) => group.id === over.id,
    );

    if (activeGroupIndex !== -1 && overGroupIndex !== -1) {
      // Перемещение группы
      const newGroups = [...categoryGroups];
      const [movedGroup] = newGroups.splice(activeGroupIndex, 1);
      newGroups.splice(overGroupIndex, 0, movedGroup);
      setCategoryGroups(newGroups);
      return;
    }

    // Если перетаскивается категория
    const sourceGroup = categoryGroups.find((group) =>
      group.categories.some((cat) => cat.id === active.id),
    );
    let targetGroup = categoryGroups.find((group) =>
      group.categories.some((cat) => cat.id === over.id),
    );

    if (!targetGroup) {
      targetGroup =
        categoryGroups.find((group) => group.id === over.id) || sourceGroup;
    }

    if (!sourceGroup || !targetGroup) return;

    if (sourceGroup.id === targetGroup.id) {
      const oldIndex = sourceGroup.categories.findIndex(
        (c) => c.id === active.id,
      );
      const newIndex = targetGroup.categories.findIndex(
        (c) => c.id === over.id,
      );
      const updatedCategories = arrayMove(
        sourceGroup.categories,
        oldIndex,
        newIndex,
      );
      setCategoryGroups(
        categoryGroups.map((group) =>
          group.id === sourceGroup.id
            ? { ...group, categories: updatedCategories }
            : group,
        ),
      );
    } else {
      const movedCategory = sourceGroup.categories.find(
        (c) => c.id === active.id,
      );
      if (!movedCategory) return;

      const newSourceCategories = sourceGroup.categories.filter(
        (c) => c.id !== active.id,
      );
      const newTargetCategories = [...targetGroup.categories, movedCategory];

      setCategoryGroups(
        categoryGroups.map((group) => {
          if (group.id === sourceGroup.id)
            return { ...group, categories: newSourceCategories };
          if (group.id === targetGroup.id)
            return { ...group, categories: newTargetCategories };
          return group;
        }),
      );

      const { message } = await moveCategory({
        id: active.id as string,
        groupId: targetGroup.id,
      }).unwrap();
      showToast({
        title: message,
        status: "success",
      });
    }
  };

  return { handleDragEnd };
};
