import { CategoryGroup } from "@/lib/types/category.types";
import { Table, Tbody, Td, Box, Flex, Input } from "@chakra-ui/react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { SortableItem } from "../dnd/SortableItem";

export const CategoryTable = ({
  group,
  formatCurrency,
}: {
  group: CategoryGroup;
  formatCurrency: (value: number) => string;
}) => {
  const { t } = useTranslation();

  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const handleChangeAssigned = (
    e: ChangeEvent<HTMLInputElement>,
    groupId: string,
    categoryId: string,
  ) => {
    const newValue = Number(e.target.value);

    console.log(newValue);
  };

  return (
    <SortableContext
      items={group.categories.map((cat) => cat.id)}
      strategy={verticalListSortingStrategy}
    >
      <Table variant="simple" width="100%">
        <Tbody>
          {group.categories.length === 0 ? (
            <SortableItem key={group.id} id={group.id} nodeType="table">
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
              <SortableItem key={category.id} id={category.id} nodeType="table">
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
                        handleChangeAssigned(e, group.id, category.id)
                      }
                      onBlur={() => setEditingCategory(null)}
                      autoFocus
                      width="80px"
                      textAlign="center"
                    />
                  ) : (
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(category.id);
                      }}
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
  );
};
