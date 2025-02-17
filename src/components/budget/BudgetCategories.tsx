import { useLazyGetCategoryGroupQuery } from "@/lib/services/category-group.api";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Category, CategoryGroup } from "@/lib/types/category.types";
import { useGetBudgetInfoQuery } from "@/lib/services/budget.api";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useUpdateCategoryMutation } from "@/lib/services/category.api";
import { showToast } from "@/lib/utils/toast";
import { SkeletonUI } from "../ui/SkeletonUI";
import { SortableItem } from "../dnd/SortableItem";

export const BudgetCategories = () => {
  const { t } = useTranslation();
  const params = useParams();
  const budgetId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const [getCategoryGroup, { isLoading }] = useLazyGetCategoryGroupQuery();
  const { data: budgetInfo } = useGetBudgetInfoQuery(budgetId!, {
    skip: !budgetId,
  });
  const [moveCategory] = useUpdateCategoryMutation();

  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const handleChangeAssigned = (
    e: ChangeEvent<HTMLInputElement>,
    group: CategoryGroup,
    category: Category,
  ) => {
    const newValue = Number(e.target.value);

    setCategoryGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id !== group.id) return g;

        return {
          ...g,
          categories: g.categories.map((c) =>
            c.id === category.id ? { ...c, assigned: newValue } : c,
          ),
        };
      }),
    );
  };

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

  const currency = budgetInfo?.settings?.currency || "$";
  const currencyPlacement = budgetInfo?.settings?.currencyPlacement || "before";

  const formatCurrency = useCallback(
    (value: number) => {
      return currencyPlacement === "before"
        ? `${currency}${value}`
        : `${value}${currency}`;
    },
    [currency, currencyPlacement],
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
                    <AccordionButton backgroundColor="#edf1f5">
                      <AccordionIcon />
                      <Box
                        flex="1"
                        textAlign="left"
                        color="#19223c"
                        fontWeight="semibold"
                        width="40%"
                      >
                        {group.name}
                      </Box>
                      <Box width="20%" textAlign="center">
                        {formatCurrency(totalAssigned)}
                      </Box>
                      <Box width="20%" textAlign="center">
                        {formatCurrency(totalActivity)}
                      </Box>
                      <Box width="20%" textAlign="center">
                        {formatCurrency(totalAvailable)}
                      </Box>
                    </AccordionButton>
                    <AccordionPanel>
                      <SortableContext
                        items={group.categories.map((cat) => cat.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <Table variant="simple" width="100%">
                          <Tbody>
                            {group.categories.length === 0 ? (
                              <SortableItem
                                key={group.id}
                                id={group.id}
                                nodeType="table"
                              >
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
                                <SortableItem
                                  key={category.id}
                                  id={category.id}
                                  nodeType="table"
                                >
                                  <Td width="40%">
                                    <Flex align="center">{category.name}</Flex>
                                  </Td>
                                  <Td width="20%" textAlign="center">
                                    {editingCategory === category.id ? (
                                      <Input
                                        type="number"
                                        size="sm"
                                        value={category.assigned}
                                        onChange={(e) =>
                                          handleChangeAssigned(
                                            e,
                                            group,
                                            category,
                                          )
                                        }
                                        onBlur={() => setEditingCategory(null)}
                                        autoFocus
                                        width="80px"
                                        textAlign="center"
                                      />
                                    ) : (
                                      <Box
                                        onClick={() =>
                                          setEditingCategory(category.id)
                                        }
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
