import { useCallback } from "react";
import {
  HStack,
  useDisclosure,
  Button,
  Text,
  Flex,
  VStack,
  useBreakpointValue,
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

  const popoverWidth = useBreakpointValue({
    base: "90vw", // На мобильных устройствах занимает 90% ширины экрана
    md: "500px", // На планшетах и выше - фиксированная ширина
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
      contentProps={{
        minW: popoverWidth,
        maxW: popoverWidth,
        w: "auto",
      }}
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
          <VStack align="start" spacing={2}>
            <Text wordBreak="break-word">
              {t("auto_categorize_description")}
            </Text>
            <Text wordBreak="break-word">
              {t("auto_categorize_description_part_2")}
            </Text>
          </VStack>
        </Flex>
      }
      footerContent={
        <HStack spacing={4} justifyContent="flex-end" wrap="wrap">
          <Button
            onClick={onClose}
            bgColor="gray.200"
            _hover={{ bg: "gray.300" }}
            color="black"
            flex={{ base: "1 0 auto", md: "0 1 auto" }}
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleSubmit(handleApply)}
            bgColor="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
            flex={{ base: "1 0 auto", md: "0 1 auto" }}
          >
            {t("OK")}
          </Button>
        </HStack>
      }
    />
  );
};
