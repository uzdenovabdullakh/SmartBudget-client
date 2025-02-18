import {
  useLazyGetCategoryGroupQuery,
  useRemoveCategoryGroupMutation,
  useUpdateCategoryGroupMutation,
} from "@/lib/services/category-group.api";
import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stack,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
import { formatCurrency } from "@/lib/utils/helpers";
import { showToast } from "@/lib/utils/toast";
import { SkeletonUI } from "../ui/SkeletonUI";
import { SortableItem } from "../dnd/SortableItem";
import { CategoryTable } from "./CategoryTable";
import { CategoryChangePopover } from "../popovers/category/CategoryChangePopover";

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
  const [updateCategoryGroup] = useUpdateCategoryGroupMutation();
  const [removeCategoryGroup] = useRemoveCategoryGroupMutation();

  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);

  const { handleDragEnd } = useDragEnd(categoryGroups, setCategoryGroups);

  const handleDragStart = (event: DragStartEvent) => {
    const target = event.activatorEvent.target as HTMLElement;
    if (target.closest('[data-no-dnd="true"]')) {
      // eslint-disable-next-line no-useless-return
      return;
    }
  };

  const handleUpdateGroupName = useCallback(
    async (id: string, newName: string) => {
      setCategoryGroups((prev) =>
        prev.map((g) => (g.id === id ? { ...g, name: newName } : g)),
      );

      const { message } = await updateCategoryGroup({
        id,
        name: newName,
      }).unwrap();
      showToast({
        title: message,
        status: "success",
      });
    },
    [updateCategoryGroup],
  );

  const handleDeleteGroup = useCallback(
    async (id: string) => {
      setCategoryGroups((prev) => prev.filter((g) => g.id !== id));

      const { message } = await removeCategoryGroup(id).unwrap();
      showToast({
        title: message,
        status: "success",
      });
    },
    [removeCategoryGroup],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      if (budgetId) {
        const data = await getCategoryGroup(budgetId).unwrap();
        setCategoryGroups(data);
      }
    };
    fetchCategories();
  }, [budgetId, getCategoryGroup]);

  if (isLoading)
    return (
      <Stack>
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
            {categoryGroups.map((group) => {
              const totalAssigned = group.categories.reduce(
                (sum, category) => sum + (category.assigned || 0),
                0,
              );
              const totalActivity = group.categories.reduce(
                (sum, category) => sum + (category.activity || 0),
                0,
              );
              const totalAvailable = group.categories.reduce(
                (sum, category) => sum + (category.available || 0),
                0,
              );
              return (
                <SortableItem key={group.id} id={group.id} nodeType="box">
                  <AccordionItem key={group.id} border="none">
                    <AccordionButton
                      backgroundColor="#edf1f5"
                      data-no-dnd="true"
                    >
                      <AccordionIcon />
                      <Box
                        flex="1"
                        textAlign="left"
                        fontWeight="semibold"
                        width="40%"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CategoryChangePopover
                          entity={group}
                          onUpdate={handleUpdateGroupName}
                          onDelete={handleDeleteGroup}
                        />
                      </Box>
                      <Box width="20%" textAlign="center">
                        {formatCurrency(
                          totalAssigned,
                          budgetInfo?.settings?.currency || "$",
                          budgetInfo?.settings?.currencyPlacement || "before",
                        )}
                      </Box>
                      <Box width="20%" textAlign="center">
                        {formatCurrency(
                          totalActivity,
                          budgetInfo?.settings?.currency || "$",
                          budgetInfo?.settings?.currencyPlacement || "before",
                        )}
                      </Box>
                      <Box width="20%" textAlign="center">
                        {formatCurrency(
                          totalAvailable,
                          budgetInfo?.settings?.currency || "$",
                          budgetInfo?.settings?.currencyPlacement || "before",
                        )}
                      </Box>
                    </AccordionButton>
                    <AccordionPanel>
                      <CategoryTable
                        group={group}
                        handleCategoryGroupsChange={setCategoryGroups}
                        formatCurrency={(value) =>
                          formatCurrency(
                            value,
                            budgetInfo?.settings?.currency || "$",
                            budgetInfo?.settings?.currencyPlacement || "before",
                          )
                        }
                      />
                    </AccordionPanel>
                  </AccordionItem>
                </SortableItem>
              );
            })}
          </Accordion>
        </SortableContext>
      </Box>
    </DndContext>
  );
};
