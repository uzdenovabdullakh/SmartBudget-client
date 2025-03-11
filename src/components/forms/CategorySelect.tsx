import React, { useCallback, useMemo } from "react";
import {
  Box,
  FormErrorMessage,
  FormLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { formatCurrency, getCurrencyColorStyles } from "@/lib/utils/helpers";
import { useGetCategoryGroupQuery } from "@/lib/services/category-group.api";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { useTranslation } from "react-i18next";

type CategorySelectProps = {
  onlyPositiveAvailable?: boolean;
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export const CategorySelect: React.FC<CategorySelectProps> = ({
  onlyPositiveAvailable = false,
  label,
  error,
  value,
  onChange,
}) => {
  const { budget } = useBudgetContext();
  const { t } = useTranslation();

  const { data: categoryGroups } = useGetCategoryGroupQuery(
    {
      id: budget?.id!,
      defaultCategory: true,
    },
    {
      skip: !budget?.id,
    },
  );

  const filteredCategoryGroups = useMemo(
    () =>
      categoryGroups
        ?.map((group) => ({
          ...group,
          categories: onlyPositiveAvailable
            ? group.categories.filter((cat) => cat.available > 0)
            : group.categories,
        }))
        .filter((group) => group.categories.length > 0),
    [categoryGroups, onlyPositiveAvailable],
  );

  const categoryMap = useMemo(() => {
    const map = new Map<string, { name: string; available: number }>();
    filteredCategoryGroups?.forEach((group) => {
      group.categories.forEach((cat) => {
        map.set(cat.id, { name: cat.name, available: cat.available });
      });
    });
    return map;
  }, [filteredCategoryGroups]);

  const handleSelect = useCallback(
    (catId: string) => {
      if (onChange) {
        onChange(catId);
      }
    },
    [onChange],
  );

  const selectedCategory = useMemo(
    () => (value ? categoryMap.get(value) : null),
    [categoryMap, value],
  );

  return (
    <Box position="relative">
      {label && <FormLabel>{label}</FormLabel>}
      <Menu placement="top">
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          variant="filled"
          size="md"
          width="100%"
          textAlign="left"
          sx={{
            "&:hover": {
              bg: "gray.100",
            },
          }}
        >
          {selectedCategory
            ? `${selectedCategory.name} (${formatCurrency(selectedCategory.available, budget?.settings)})`
            : t("Category not selected")}
        </MenuButton>
        <MenuList
          maxHeight="300px"
          overflowY="auto"
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.300",
              borderRadius: "4px",
            },
          }}
        >
          {!value && (
            <MenuItem onClick={() => handleSelect("")} fontStyle="italic">
              {t("Category not selected")}
            </MenuItem>
          )}
          {filteredCategoryGroups?.map((group) => (
            <MenuGroup
              key={group.id}
              title={`${group.name}:`}
              sx={{
                bg: "#f9f9f9",
                color: "#333",
                p: "8px",
                fontWeight: "bold",
              }}
            >
              {group.categories.map((cat) => (
                <MenuItem
                  key={cat.id}
                  onClick={() => handleSelect(cat.id)}
                  display="flex"
                  justifyContent="space-between"
                  paddingLeft="24px"
                  fontSize="14px"
                >
                  <Box as="span">{cat.name}</Box>
                  <Box
                    as="span"
                    sx={{
                      ...getCurrencyColorStyles(cat.available),
                      padding: "2px 4px",
                      borderRadius: "16px",
                    }}
                  >
                    {formatCurrency(cat.available, budget?.settings)}
                  </Box>
                </MenuItem>
              ))}
            </MenuGroup>
          ))}
        </MenuList>
      </Menu>
      {error && (
        <FormErrorMessage position="absolute" bottom="-20px" left="0" right="0">
          {error}
        </FormErrorMessage>
      )}
    </Box>
  );
};
