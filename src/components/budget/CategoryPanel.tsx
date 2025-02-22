import { Box, HStack } from "@chakra-ui/react";
import { useCategoryManagement } from "@/lib/hooks/useCategoryManagment";
import { CategoryCreatePopover } from "../popovers/category/CategoryCreatePopover";

export const CategoryPanel = () => {
  const { handleCreateCategoryGroup } = useCategoryManagement();

  return (
    <Box p={6} textAlign="left" borderBottom="1px solid #e2e8f0">
      <HStack spacing={4} align="center">
        <CategoryCreatePopover
          isCategoryGroup
          onCreate={handleCreateCategoryGroup as any}
        />
      </HStack>
    </Box>
  );
};
