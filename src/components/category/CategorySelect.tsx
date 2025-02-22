import React from "react";
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
  label?: string;
  error?: string;
} & SelectProps;

export const CategorySelect: React.FC<CategorySelectProps> = ({
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
        {categoryGroups?.map((group) => (
          <optgroup key={group.id} label={`${group.name}:`}>
            {group.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}&nbsp;&nbsp;&nbsp;
                {formatCurrency(
                  cat.available,
                  budget?.settings.currency,
                  budget?.settings.currencyPlacement,
                )}
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
