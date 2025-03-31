import {
  Box,
  Button,
  HStack,
  VStack,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { useCategoryManagement } from "@/lib/hooks/useCategoryManagment";
import { CategoryFilter } from "@/lib/constants/enums";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoFilter } from "react-icons/io5"; // Иконка фильтра из Io5
import { CategoryCreatePopover } from "../popovers/category/CategoryCreatePopover";
import { AddGoalModal } from "../modals/add-goal/AddGoalModal";
import { SpanButton } from "../ui/SpanButton";

const buttonStyles = {
  default: {
    background: "#edf1f5",
    color: "#19223c",
    border: ".09375rem solid transparent",
    borderRadius: ".3125rem",
    fontWeight: "500",
    lineHeight: "1rem",
    maxWidth: "9.375rem",
    padding: ".1875rem .75rem",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    _hover: {
      background: "#e2e8f0",
    },
  },
  active: {
    background: "#d8e0fd",
    borderColor: "#3b5eda",
    border: ".09375rem solid",
  },
};

const filters = [
  { label: "All", value: null },
  { label: "Spent", value: CategoryFilter.SPENT },
  { label: "Available", value: CategoryFilter.AVAILABLE },
  { label: "Limit Reached", value: CategoryFilter.LIMIT_REACHED },
  { label: "Assigned", value: CategoryFilter.ASSIGNED },
];

type CategoryPanelProps = {
  onFilterChange: (filter: CategoryFilter | null) => void;
};

export const CategoryPanel = ({ onFilterChange }: CategoryPanelProps) => {
  const { t } = useTranslation();
  const { handleCreateCategoryGroup } = useCategoryManagement();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [activeFilter, setActiveFilter] = useState<CategoryFilter | null>(null);

  const handleFilterClick = useCallback(
    (filter: CategoryFilter | null) => {
      if (activeFilter === filter) {
        setActiveFilter(null);
        onFilterChange(null);
      } else {
        setActiveFilter(filter);
        onFilterChange(filter);
      }
    },
    [activeFilter, onFilterChange],
  );

  return (
    <Box
      p={{ base: 4, md: 6 }}
      textAlign="left"
      borderBottom="1px solid #e2e8f0"
    >
      {/* Мобильная версия */}
      <VStack
        spacing={{ base: 2, md: 4 }}
        align="stretch"
        display={{ base: "flex", md: "none" }}
      >
        <HStack spacing={2} justifyContent="space-between">
          <CategoryCreatePopover
            isCategoryGroup
            onCreate={handleCreateCategoryGroup as any}
          />
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<IoFilter />}
              background="#edf1f5"
              color="#19223c"
              border=".09375rem solid transparent"
              borderRadius=".3125rem"
              fontWeight="500"
              padding=".125rem .5rem"
              _hover={{ background: "#e2e8f0" }}
            />
            <MenuList>
              {filters.map((filter) => (
                <MenuItem
                  key={filter.value || "all"}
                  onClick={() => handleFilterClick(filter.value)}
                  background={
                    activeFilter === filter.value ? "#d8e0fd" : "transparent"
                  }
                  _hover={{ background: "#e2e8f0" }}
                >
                  {t(filter.label)}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>
      </VStack>

      {/* Десктопная версия */}
      <HStack
        spacing={4}
        align="center"
        justifyContent="space-between"
        display={{ base: "none", md: "flex" }}
      >
        <HStack spacing={4}>
          <CategoryCreatePopover
            isCategoryGroup
            onCreate={handleCreateCategoryGroup as any}
          />
          <SpanButton name={t("Create goal")} onClick={onOpen} />
          <AddGoalModal isOpen={isOpen} onClose={onClose} />
        </HStack>
        <HStack spacing={2}>
          {filters.map((filter) => (
            <Button
              key={filter.value}
              {...buttonStyles.default}
              {...(activeFilter === filter.value ? buttonStyles.active : {})}
              onClick={() => handleFilterClick(filter.value)}
            >
              {t(filter.label)}
            </Button>
          ))}
        </HStack>
      </HStack>
    </Box>
  );
};
