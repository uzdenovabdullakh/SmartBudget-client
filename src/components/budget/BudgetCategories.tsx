import { useLazyGetCategoryGroupQuery } from "@/lib/services/category-group.api";
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
import { formatCurrency } from "@/lib/utils/helpers";
import { SkeletonUI } from "../ui/SkeletonUI";
import { SortableItem } from "../dnd/SortableItem";
import { CategoryTable } from "./CategoryTable";

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
            {categoryGroups.map((group) => (
              <SortableItem key={group.id} id={group.id} nodeType="box">
                <AccordionItem key={group.id} border="none">
                  <AccordionButton backgroundColor="#edf1f5" data-no-dnd="true">
                    <AccordionIcon />
                    <Box
                      flex="1"
                      textAlign="left"
                      fontWeight="semibold"
                      width="40%"
                    >
                      {group.name}
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
            ))}
          </Accordion>
        </SortableContext>
      </Box>
    </DndContext>
  );
};
