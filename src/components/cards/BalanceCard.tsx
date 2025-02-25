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

type BalanceCardProps = {
  available: string;
  assigned: string;
  activity: string;
};

export const BalanceCard = ({
  available,
  assigned,
  activity,
}: BalanceCardProps) => {
  const { t, i18n } = useTranslation();

  const locale = i18n.language === "ru" ? ru : enUS;
  const formattedDate = format(new Date(), "MMM", { locale }).replace(".", "");

  return (
    <Card borderRadius="md" bg="white">
      <Accordion allowToggle>
        <AccordionItem border="none">
          <AccordionButton p={4}>
            <Flex flex="1" alignItems="center" justifyContent="space-between">
              <Heading size="xs" fontWeight="semibold">
                {t("Available in")} {formattedDate} <AccordionIcon />
              </Heading>
              <span color="granite.granite600">{available}</span>
            </Flex>
          </AccordionButton>
          <Divider borderColor="gray.300" />
          <AccordionPanel pb={4} pt={4}>
            <Box mb={4} color="granite.granite600">
              <Flex justifyContent="space-between" mb={2}>
                <Text>
                  {t("Assigned in")} {formattedDate}
                </Text>
                <Text>{assigned}</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t("Activity")}</Text>
                <Text>{activity}</Text>
              </Flex>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
