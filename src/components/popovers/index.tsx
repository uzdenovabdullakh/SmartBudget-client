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
  triggerButton: JSX.Element;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  bodyHeight?: string;
  contentWidth?: string;
  headerText?: string;
  bodyContent: ReactNode;
  footerContent?: ReactNode;
  onApply?: () => void;
  onCancel?: () => void;
};

export const BasePopover = ({
  triggerButton,
  isOpen,
  setIsOpen,
  bodyHeight,
  contentWidth,
  headerText,
  bodyContent,
  footerContent,
  onApply,
  onCancel,
}: BasePopoverProps) => {
  const handleApply = () => {
    if (onApply) onApply();
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setIsOpen(false);
  };

  return (
    <Popover isOpen={isOpen} onClose={handleCancel} closeOnBlur>
      <PopoverTrigger>{triggerButton}</PopoverTrigger>
      <PopoverContent minW={contentWidth} p={4}>
        {headerText && (
          <PopoverHeader fontWeight="bold">{headerText}</PopoverHeader>
        )}
        <PopoverBody minH={bodyHeight}>{bodyContent}</PopoverBody>
        {footerContent || (
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
