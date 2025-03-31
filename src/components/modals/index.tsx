import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ResponsiveValue,
  useBreakpointValue,
} from "@chakra-ui/react";

type Size = ResponsiveValue<
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | (string & {})
  | "xs"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "full"
>;

interface DefaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | React.JSX.Element;
  body: React.ReactNode;
  footer?: React.ReactNode;
  size?: Size;
}

export const DefaultModal = ({
  isOpen,
  onClose,
  title,
  body,
  footer,
  size,
}: DefaultModalProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={isMobile ? "sm" : size}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{body}</ModalBody>
        {footer && <ModalFooter justifyContent="center">{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};
