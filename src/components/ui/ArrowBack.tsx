import { ArrowBackIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";

type ArrowBackProps = {
  text: string;
  onClick: () => void;
};

export const ArrowBack = ({ text, onClick }: ArrowBackProps) => (
  <Flex align="center" gap={2}>
    <IconButton
      aria-label="Go back"
      icon={<ArrowBackIcon />}
      variant="ghost"
      onClick={onClick}
    />
    <Text>{text}</Text>
  </Flex>
);
