import { useCallback } from "react";
import {
  HStack,
  useDisclosure,
  Button,
  Text,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAutoCategorizeTransactionsMutation } from "@/lib/services/ai.api";
import {
  AutoCategorizeDto,
  AutoCategorizeSchema,
} from "@/lib/validation/ai.schema";
import { BasePopover } from "..";

export const AutoCategorizePopover = ({ accountId }: { accountId: string }) => {
  const { t } = useTranslation();

  const { isOpen, onToggle, onClose } = useDisclosure();

  const [autoCategorize] = useAutoCategorizeTransactionsMutation();

  const { handleSubmit } = useForm<AutoCategorizeDto>({
    resolver: zodResolver(AutoCategorizeSchema),
    defaultValues: {
      accountId,
    },
  });

  const handleApply = useCallback(
    async (data: AutoCategorizeDto) => {
      await autoCategorize(data);

      onClose();
    },
    [onClose, autoCategorize],
  );

  return (
    <BasePopover
      isOpen={isOpen}
      onClose={onClose}
      contentProps={{ minW: 500 }}
      triggerButton={
        <Button
          colorScheme="yellow"
          color="neutrals.midnight"
          onClick={onToggle}
        >
          {t("Auto-Categorize")}
        </Button>
      }
      bodyContent={
        <Flex
          align="center"
          alignItems="baseline"
          gap={2}
          fontSize="sm"
          color="gray.500"
        >
          <InfoIcon color="blue.400" />
          <VStack>
            <Text>{t("auto_categorize_description")}</Text>
            <Text>{t("auto_categorize_description_part_2")}</Text>
          </VStack>
        </Flex>
      }
      footerContent={
        <HStack spacing={4} justifyContent="flex-end">
          <Button
            onClick={onClose}
            bgColor="gray.200"
            _hover={{ bg: "gray.300" }}
            color="black"
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleSubmit(handleApply)}
            bgColor="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
          >
            {t("OK")}
          </Button>
        </HStack>
      }
    />
  );
};
