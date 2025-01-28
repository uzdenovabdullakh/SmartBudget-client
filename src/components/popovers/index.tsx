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
import { ReactNode, useState } from "react";

type BasePopoverProps = {
  triggerButtonLabel: string;
  headerText?: string;
  bodyContent: ReactNode;
  footerContent?: ReactNode;
  onApply?: () => void;
  onCancel?: () => void;
};

export const BasePopover = ({
  triggerButtonLabel,
  headerText,
  bodyContent,
  footerContent,
  onApply,
  onCancel,
}: BasePopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
      <PopoverTrigger>
        <Button pr={6} pl={6} onClick={() => setIsOpen(true)}>
          {triggerButtonLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent minW="600px" p={4}>
        {headerText && (
          <PopoverHeader fontWeight="bold">{headerText}</PopoverHeader>
        )}
        <PopoverBody minH="130px">{bodyContent}</PopoverBody>
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
