import { useProvideFinancialAdviceMutation } from "@/lib/services/ai.api";
import { Category } from "@/lib/types/category.types";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Card,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Heading,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { useBudgetContext } from "@/lib/context/BudgetContext";

type AdviceCardProps = {
  category?: Category;
};

const MarkdownComponents: Components = {
  ul: ({ children, ...props }) => (
    <Box as="ul" pl={4} {...props}>
      {children}
    </Box>
  ),
  ol: ({ children, ...props }) => (
    <Box as="ol" pl={4} {...props}>
      {children}
    </Box>
  ),
  li: ({ children, ...props }) => (
    <Box as="li" pb={1} {...props}>
      {children}
    </Box>
  ),
};

export const AdviceCard = ({ category }: AdviceCardProps) => {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();

  const [advice, setAdvice] = useState<string>("");

  const [provideFinancialAdvice, { isLoading }] =
    useProvideFinancialAdviceMutation();

  const handleAccordionClick = useCallback(async () => {
    try {
      if (!advice && budget?.id) {
        let question = "";
        if (!category) {
          question = t(
            "Provide recommendations to optimize my budget and give me advice to reduce unnecessary expenses",
          );
        } else {
          question = t("optimize_my_budget_category_without_limit", {
            name: category.name,
            spent: category.spent,
            avaialable: category.available,
            assigned: category.assigned,
          });

          if (category?.categorySpending) {
            question = t("optimize_my_budget_category_with_limit", {
              name: category.name,
              spent: category.categorySpending.spentAmount,
              limit: category.categorySpending.limitAmount,
            });
          }
        }

        const { content } = await provideFinancialAdvice({
          budgetId: budget.id,
          question,
        }).unwrap();
        setAdvice(content);
      }
    } catch (error) {
      console.log(error);
    }
  }, [advice, budget?.id, category, provideFinancialAdvice, t]);

  useEffect(() => {
    setAdvice("");
  }, [category]);

  return (
    <Card borderRadius="md" bg="white" mt={4}>
      <Accordion key={category?.id || "general"} allowToggle>
        <AccordionItem border="none">
          <AccordionButton p={4} onClick={handleAccordionClick}>
            <Heading
              size="xs"
              fontWeight="bold"
              color="blue.500"
              _hover={{ color: "blue.600" }}
            >
              {t("Advice")}
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <Divider borderColor="gray.300" />
          <AccordionPanel pb={4} pt={4}>
            {isLoading ? (
              <Spinner />
            ) : (
              <Box mb={4} color="neutrals.midnight">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents}
                >
                  {advice}
                </ReactMarkdown>
              </Box>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
