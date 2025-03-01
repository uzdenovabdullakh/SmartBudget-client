import { ChatIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ChatBody } from "./ChatBody";

export const ChatPopover = () => {
  const { t } = useTranslation();
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="top-start">
      <PopoverTrigger>
        <Tooltip label={t("Ask AI")} placement="left" hasArrow>
          <IconButton
            aria-label="Ask AI"
            icon={<ChatIcon />}
            position="fixed"
            bottom="20px"
            right="75px"
            size="lg"
            colorScheme="yellow"
            borderRadius="full"
            onClick={onToggle}
          />
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent
        maxWidth="450px"
        width="90vw"
        minH="400px"
        justifyContent="space-between"
      >
        <PopoverHeader fontWeight="semibold">{t("Ask AI")}</PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>
          <ChatBody />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
