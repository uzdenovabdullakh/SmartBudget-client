import { formatCurrency } from "@/lib/utils/helpers";
import {
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  HStack,
  AccordionPanel,
} from "@chakra-ui/react";
import { useState } from "react";
import { CategoryGroup } from "@/lib/types/category.types";
import { BudgetData } from "@/lib/types/budget.types";
import { useCategoryManagement } from "@/lib/hooks/useCategoryManagment";
import { SortableItem } from "../dnd/SortableItem";
import { CategoryChangePopover } from "../popovers/category/CategoryChangePopover";
import { CategoryCreatePopover } from "../popovers/category/CategoryCreatePopover";
import { CategoryTable } from "./CategoryTable";

type CategoryGroupItemProps = {
  group: CategoryGroup;
  budgetInfo: BudgetData;
  handleCategoryGroupsChange: React.Dispatch<
    React.SetStateAction<CategoryGroup[]>
  >;
};

export const CategoryGroupItem = ({
  group,
  budgetInfo,
  handleCategoryGroupsChange,
}: CategoryGroupItemProps) => {
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);
  const [openPopoverGroupId, setOpenPopoverGroupId] = useState<string | null>(
    null,
  );

  const { handleUpdateGroupName, handleDeleteGroup, handleCreateCategory } =
    useCategoryManagement();

  const totalAssigned = group.categories.reduce(
    (sum, category) => sum + (category.assigned || 0),
    0,
  );
  const totalSpent = group.categories.reduce(
    (sum, category) => sum + (category.spent || 0),
    0,
  );
  const totalAvailable = group.categories.reduce(
    (sum, category) => sum + (category.available || 0),
    0,
  );

  return (
    <SortableItem key={group.id} id={group.id} nodeType="box">
      <AccordionItem key={group.id} border="none">
        <AccordionButton backgroundColor="#edf1f5" data-no-dnd="true">
          <AccordionIcon />
          <Box
            flex="1"
            textAlign="left"
            fontWeight="semibold"
            width="40%"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoveredGroupId(group.id)}
            onMouseLeave={() => setHoveredGroupId(null)}
          >
            <HStack spacing={2} align="center">
              <CategoryChangePopover
                entity={group}
                onUpdate={handleUpdateGroupName}
                onDelete={handleDeleteGroup}
              />
              {(hoveredGroupId === group.id ||
                openPopoverGroupId === group.id) && (
                <CategoryCreatePopover
                  isCategoryGroup={false}
                  groupId={group.id}
                  onCreate={handleCreateCategory as any}
                  onOpenPopover={() => setOpenPopoverGroupId(group.id)}
                  onClosePopover={() => setOpenPopoverGroupId(null)}
                />
              )}
            </HStack>
          </Box>
          <Box width="20%" textAlign="center">
            {formatCurrency(totalAssigned, budgetInfo?.settings)}
          </Box>
          <Box width="20%" textAlign="center">
            {formatCurrency(totalSpent, budgetInfo?.settings)}
          </Box>
          <Box width="20%" textAlign="center">
            {formatCurrency(totalAvailable, budgetInfo?.settings)}
          </Box>
        </AccordionButton>
        <AccordionPanel>
          <CategoryTable
            group={group}
            formatCurrency={(value) =>
              formatCurrency(value, budgetInfo?.settings)
            }
            handleCategoryGroupsChange={handleCategoryGroupsChange}
          />
        </AccordionPanel>
      </AccordionItem>
    </SortableItem>
  );
};
