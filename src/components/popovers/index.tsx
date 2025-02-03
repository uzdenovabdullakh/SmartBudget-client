import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Button,
  HStack,
  PopoverBodyProps,
  PopoverContentProps,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

type BasePopoverProps = {
  triggerButton: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  bodyProps?: PopoverBodyProps;
  contentProps?: PopoverContentProps;
  headerText?: string;
  bodyContent: ReactNode;
  footerContent?: ReactNode | null;
  onApply?: () => void;
  onCancel?: () => void;
};

export const BasePopover = ({
  triggerButton,
  isOpen,
  onClose,
  bodyProps,
  contentProps,
  headerText,
  bodyContent,
  footerContent = null,
  onApply,
  onCancel,
  ...props
}: BasePopoverProps) => {
  const { t } = useTranslation();

  const handleApply = () => {
    if (onApply) onApply();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose} closeOnBlur {...props}>
      <PopoverTrigger>{triggerButton}</PopoverTrigger>
      <PopoverContent {...contentProps} p={4}>
        {headerText && (
          <PopoverHeader fontWeight="bold">{headerText}</PopoverHeader>
        )}
        <PopoverBody {...bodyProps}>{bodyContent}</PopoverBody>
        {footerContent !== null ? (
          footerContent
        ) : (
          <PopoverFooter display="flex" justifyContent="flex-end">
            <HStack spacing={4}>
              <Button variant="ghost" onClick={handleCancel}>
                {t("Cancel")}
              </Button>
              <Button colorScheme="blue" onClick={handleApply}>
                {t("Apply")}
              </Button>
            </HStack>
          </PopoverFooter>
        )}
      </PopoverContent>
    </Popover>
  );
};
