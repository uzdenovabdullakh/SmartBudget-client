import { useProvideFinancialAdviceMutation } from "@/lib/services/ai.api";
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
  Divider,
  Spinner,
  Heading,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useBudgetContext } from "@/lib/context/BudgetContext";

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
  p: ({ children, ...props }) => (
    <Box as="p" wordBreak="break-word" {...props}>
      {children}
    </Box>
  ),
};

export const ForeCastCard = () => {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();

  const [forecastAdvice, setForecastAdvice] = useState<string>("");
  const [allocationAdvice, setAllocationAdvice] = useState<string>("");
  const [forecastLoading, setForecastLoading] = useState(false);
  const [allocationLoading, setAllocationLoading] = useState(false);

  const [provideFinancialAdvice] = useProvideFinancialAdviceMutation();

  const handleForecastClick = useCallback(async () => {
    try {
      if (!forecastAdvice && budget?.id) {
        setForecastLoading(true);
        const question = t(
          "Forecast my monthly expenses based on spending history",
        );

        const { content } = await provideFinancialAdvice({
          budgetId: budget.id,
          question,
        }).unwrap();
        setForecastAdvice(content);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setForecastLoading(false);
    }
  }, [forecastAdvice, budget?.id, provideFinancialAdvice, t]);

  const handleAllocationClick = useCallback(async () => {
    try {
      if (!allocationAdvice && budget?.id) {
        setAllocationLoading(true);
        const question = t("Help me allocate my income more effectively");

        const { content } = await provideFinancialAdvice({
          budgetId: budget.id,
          question,
        }).unwrap();
        setAllocationAdvice(content);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAllocationLoading(false);
    }
  }, [allocationAdvice, budget?.id, provideFinancialAdvice, t]);

  return (
    <Card borderRadius="md" bg="white" boxShadow="sm" mb={6}>
      <Accordion allowToggle>
        <AccordionItem border="none">
          <AccordionButton onClick={handleForecastClick} p={4}>
            <Heading
              size="xs"
              fontWeight="bold"
              color="blue.500"
              _hover={{ color: "blue.600" }}
            >
              {t("Expense Forecast")}
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <Divider borderColor="gray.300" />
          <AccordionPanel pb={4} pt={4}>
            {forecastLoading ? (
              <Spinner />
            ) : (
              <Box mb={4} color="neutrals.midnight">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents}
                >
                  {forecastAdvice}
                </ReactMarkdown>
              </Box>
            )}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border="none">
          <AccordionButton onClick={handleAllocationClick} p={4}>
            <Heading
              size="xs"
              fontWeight="bold"
              color="blue.500"
              _hover={{ color: "blue.600" }}
            >
              {t("Income Allocation")}
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <Divider borderColor="gray.300" />
          <AccordionPanel pb={4} pt={4}>
            {allocationLoading ? (
              <Spinner />
            ) : (
              <Box mb={4} color="neutrals.midnight">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents}
                >
                  {allocationAdvice}
                </ReactMarkdown>
              </Box>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
