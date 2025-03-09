import {
  Card,
  Accordion,
  AccordionItem,
  AccordionButton,
  Flex,
  AccordionIcon,
  AccordionPanel,
  Box,
  Text,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { ColoredCurrency } from "../ui/ColoredCurrency";

type BalanceCardProps = {
  available: number;
  assigned: string;
  spent: string;
};

export const BalanceCard = ({
  available,
  assigned,
  spent,
}: BalanceCardProps) => {
  const { t, i18n } = useTranslation();

  const locale = i18n.language === "ru" ? ru : enUS;
  const formattedDate = format(new Date(), "MMM", { locale });

  return (
    <Card borderRadius="md" bg="white">
      <Accordion allowToggle defaultIndex={0}>
        <AccordionItem border="none">
          <AccordionButton p={4}>
            <Flex flex="1" alignItems="center" justifyContent="space-between">
              <Heading size="xs" fontWeight="semibold">
                {t("Available in", {
                  date: formattedDate,
                })}
                <AccordionIcon />
              </Heading>
              <ColoredCurrency currency={available} nodeType="span" />
            </Flex>
          </AccordionButton>
          <Divider borderColor="gray.300" />
          <AccordionPanel pb={4} pt={4}>
            <Box mb={4} color="granite.granite600">
              <Flex justifyContent="space-between" mb={2}>
                <Text>
                  {t("Assigned in", {
                    date: formattedDate,
                  })}
                </Text>
                <Text>{assigned}</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t("Spent")}</Text>
                <Text>{spent}</Text>
              </Flex>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
