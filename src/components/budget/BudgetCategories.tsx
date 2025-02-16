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
import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Category, CategoryGroup } from "@/lib/types/category.types";
import { SkeletonUI } from "../ui/SkeletonUI";

export const BudgetCategories = () => {
  const { t } = useTranslation();
  const params = useParams();
  const budgetId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [getCategoryGroup, { isLoading }] = useLazyGetCategoryGroupQuery();

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
    <Box p={4}>
      <Accordion allowMultiple defaultIndex={categoryGroups.map((_, i) => i)}>
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
            <AccordionItem key={group.id} border="none">
              <AccordionButton>
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
                  {totalAssigned}
                </Box>
                <Box width="20%" textAlign="center">
                  {totalActivity}
                </Box>
                <Box width="20%" textAlign="center">
                  {totalAvailable}
                </Box>
              </AccordionButton>
              <AccordionPanel>
                <Table variant="simple" width="100%">
                  <Tbody>
                    {group.categories.map((category) => (
                      <Tr key={category.id} height="65px">
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
                                handleChangeAssigned(e, group, category)
                              }
                              onBlur={() => setEditingCategory(null)}
                              autoFocus
                              width="80px"
                              textAlign="center"
                            />
                          ) : (
                            <Box
                              onClick={() => setEditingCategory(category.id)}
                              cursor="pointer"
                              width="80px"
                              textAlign="center"
                              display="inline-block"
                            >
                              {category.assigned}
                            </Box>
                          )}
                        </Td>
                        <Td width="20%" textAlign="center">
                          {category.activity}
                        </Td>
                        <Td
                          width="20%"
                          textAlign="center"
                          color={
                            category.available > 0 ? "green.500" : "red.500"
                          }
                        >
                          {category.available}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Box>
  );
};
