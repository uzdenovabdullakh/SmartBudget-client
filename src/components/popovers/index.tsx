import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Button,
  HStack,
} from "@chakra-ui/react";
import { ReactNode } from "react";

type BasePopoverProps = {
  triggerButton: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  bodyHeight?: string;
  contentWidth?: string;
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
  bodyHeight,
  contentWidth,
  headerText,
  bodyContent,
  footerContent = null,
  onApply,
  onCancel,
  ...props
}: BasePopoverProps) => {
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
      <PopoverContent minW={contentWidth} p={4}>
        {headerText && (
          <PopoverHeader fontWeight="bold">{headerText}</PopoverHeader>
        )}
        <PopoverBody minH={bodyHeight}>{bodyContent}</PopoverBody>
        {footerContent !== null ? (
          footerContent
        ) : (
          <PopoverFooter display="flex" justifyContent="flex-end">
            <HStack spacing={4}>
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleApply}>
                Apply
              </Button>
            </HStack>
          </PopoverFooter>
        )}
      </PopoverContent>
    </Popover>
  );
};
