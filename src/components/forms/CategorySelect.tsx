import React, { useMemo } from "react";
import {
  Box,
  FormErrorMessage,
  FormLabel,
  Select,
  SelectProps,
} from "@chakra-ui/react";
import { formatCurrency } from "@/lib/utils/helpers";
import { useGetCategoryGroupQuery } from "@/lib/services/category-group.api";
import { useBudgetContext } from "@/lib/context/BudgetContext";

type CategorySelectProps = {
  onlyPositiveAvailable?: boolean;
  label?: string;
  error?: string;
} & SelectProps;

export const CategorySelect: React.FC<CategorySelectProps> = ({
  onlyPositiveAvailable = false,
  label,
  error,
  ...props
}) => {
  const { budget } = useBudgetContext();

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

  return (
    <Box>
      {label && <FormLabel>{label}</FormLabel>}
      <Select
        {...props}
        variant="filled"
        size="md"
        sx={{
          "& > optgroup": {
            backgroundColor: "#f9f9f9",
            color: "#333",
            padding: "8px",
            fontWeight: "bold",
          },
          "& > option": {
            paddingLeft: "24px",
            fontSize: "14px",
            display: "flex",
            justifyContent: "space-between",
          },
        }}
      >
        {filteredCategoryGroups?.map((group) => (
          <optgroup key={group.id} label={`${group.name}:`}>
            {group.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}&nbsp;&nbsp;&nbsp;
                {formatCurrency(cat.available, budget?.settings)}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>
      {error && (
        <FormErrorMessage position="absolute" bottom="-20px" left="0" right="0">
          {error}
        </FormErrorMessage>
      )}
    </Box>
  );
};
