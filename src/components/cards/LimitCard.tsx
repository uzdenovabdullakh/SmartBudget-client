import { Category } from "@/lib/types/category.types";
import {
  Card,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  Heading,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const LimitCard = ({ category }: { category: Category }) => {
  const { t } = useTranslation();

  return (
    <Card borderRadius="md" bg="white" mt={4}>
      <Accordion allowToggle>
        <AccordionItem border="none">
          <AccordionButton p={4}>
            <Heading size="xs" fontWeight="semibold">
              {t("Limit")}
              <AccordionIcon />
            </Heading>
          </AccordionButton>
          <Divider borderColor="gray.300" />
          <AccordionPanel pb={4} pt={4} wordBreak="break-word">
            <Heading size="xs">
              {t("How much do you need for", { name: category.name })}
            </Heading>
            <Text mt={4} mb={4}>
              {t("limit_card_description")}
            </Text>
            <Button width="100%" colorScheme="blue">
              {t("Create Limit")}
            </Button>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
