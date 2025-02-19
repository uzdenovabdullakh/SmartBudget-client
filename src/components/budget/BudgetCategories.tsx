import { useLazyGetCategoryGroupQuery } from "@/lib/services/category-group.api";
import { Box, Table, Thead, Tr, Th, Accordion, Stack } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoryGroup } from "@/lib/types/category.types";
import { useGetBudgetInfoQuery } from "@/lib/services/budget.api";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDragEnd } from "@/lib/hooks/useDragEnd";
import { SkeletonUI } from "../ui/SkeletonUI";
import { CategoryGroupItem } from "./CategoryGroupItem";

export const BudgetCategories = () => {
  const { t } = useTranslation();
  const params = useParams();
  const budgetId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const [getCategoryGroup, { isLoading }] = useLazyGetCategoryGroupQuery();
  const { data: budgetInfo } = useGetBudgetInfoQuery(budgetId!, {
    skip: !budgetId,
  });

  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);

  const { handleDragEnd } = useDragEnd(categoryGroups, setCategoryGroups);

  const handleDragStart = (event: DragStartEvent) => {
    const target = event.activatorEvent.target as HTMLElement;
    if (target.closest('[data-no-dnd="true"]')) {
      // eslint-disable-next-line no-useless-return
      return;
    }
  };

  useEffect(() => {
    if (!budgetId) return;
    getCategoryGroup({ id: budgetId })
      .unwrap()
      .then(setCategoryGroups)
      .catch(console.error);
  }, [budgetId, getCategoryGroup]);

  if (isLoading)
    return (
      <Stack p={4}>
        <SkeletonUI length={10} height={10} />;
      </Stack>
    );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <Box p={4}>
        <SortableContext
          items={categoryGroups.map((group) => group.id)}
          strategy={verticalListSortingStrategy}
        >
          <Accordion
            allowMultiple
            defaultIndex={categoryGroups.map((_, i) => i)}
          >
            <Table variant="simple" width="100%">
              <Thead>
                <Tr>
                  <Th width="40%">{t("Category")}</Th>
                  <Th width="20%" textAlign="center">
                    {t("Assigned")}
                  </Th>
                  <Th width="20%" textAlign="center">
                    {t("Activity")}
                  </Th>
                  <Th width="20%" textAlign="center">
                    {t("Available")}
                  </Th>
                </Tr>
              </Thead>
            </Table>
            {categoryGroups.map((group) => (
              <CategoryGroupItem
                key={group.id}
                group={group}
                budgetInfo={budgetInfo}
                handleCategoryGroupsChange={setCategoryGroups}
              />
            ))}
          </Accordion>
        </SortableContext>
      </Box>
    </DndContext>
  );
};
