import { useLazyGetCategoryGroupQuery } from "@/lib/services/category-group.api";
import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Accordion,
  Stack,
  Flex,
} from "@chakra-ui/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useTranslation } from "react-i18next";
import { CategoryGroup } from "@/lib/types/category.types";
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
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { BudgetInspectorProvider } from "@/lib/context/BudgetInspectorContext";
import { CategoryFilter } from "@/lib/constants/enums";
import { functionDebounce } from "@/lib/hooks/useDebounce";
import { SkeletonUI } from "../ui/SkeletonUI";
import { CategoryGroupItem } from "./CategoryGroupItem";
import { BudgetInspector } from "./BudgetInspector";

export const BudgetCategories = ({
  filter,
}: {
  filter: CategoryFilter | null;
}) => {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const [getCategoryGroup, { isLoading }] = useLazyGetCategoryGroupQuery();
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [isPending, startTransition] = useTransition();

  const { handleDragEnd } = useDragEnd(categoryGroups, setCategoryGroups);

  const handleDragStart = (event: DragStartEvent) => {
    const target = event.activatorEvent.target as HTMLElement;
    if (target.closest('[data-no-dnd="true"]')) {
      // eslint-disable-next-line no-useless-return
      return;
    }
  };

  const fetchCategoryGroups = useCallback(async () => {
    if (!budget?.id) return;
    const data = await getCategoryGroup({ id: budget.id, filter }).unwrap();
    startTransition(() => {
      setCategoryGroups(data);
    });
  }, [budget?.id, filter, getCategoryGroup]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    functionDebounce(() => fetchCategoryGroups(), 300),
    [fetchCategoryGroups],
  );

  useEffect(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  const categoryGroupIds = useMemo(
    () => categoryGroups.map((g) => g.id),
    [categoryGroups],
  );
  const accordionIndexes = useMemo(
    () => categoryGroups.map((_, i) => i),
    [categoryGroups],
  );

  if (isLoading || isPending)
    return (
      <Stack p={4}>
        <SkeletonUI length={10} height={10} />;
      </Stack>
    );

  return (
    <BudgetInspectorProvider>
      <Flex width="100%" h="calc(100% - 12rem)">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <Box as="section" p={4} flex={1} overflow="auto" scrollPaddingTop={5}>
            <SortableContext
              items={categoryGroupIds}
              strategy={verticalListSortingStrategy}
            >
              <Accordion allowMultiple defaultIndex={accordionIndexes}>
                <Table variant="simple" width="100%">
                  <Thead>
                    <Tr>
                      <Th width="40%">{t("Category")}</Th>
                      <Th width="20%" textAlign="center">
                        {t("Assigned")}
                      </Th>
                      <Th width="20%" textAlign="center">
                        {t("Spent")}
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
                    budgetInfo={budget}
                    handleCategoryGroupsChange={setCategoryGroups}
                  />
                ))}
              </Accordion>
            </SortableContext>
          </Box>
        </DndContext>
        <Box
          as="aside"
          bgColor="#edf1f5"
          borderLeft="1px solid #d2d8de"
          minW="300px"
          width="33%"
        >
          <Box overflow="auto" p={4} pb={12} height="100%">
            <BudgetInspector
              categoryGroups={categoryGroups}
              budgetSettings={budget?.settings}
            />
          </Box>
        </Box>
      </Flex>
    </BudgetInspectorProvider>
  );
};
