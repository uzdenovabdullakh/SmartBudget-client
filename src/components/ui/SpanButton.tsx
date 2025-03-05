import { Box, Text, HStack } from "@chakra-ui/react";

type SpanButtonProps = {
  name: string;
  onClick: () => void;
};

export const SpanButton = ({ name, onClick }: SpanButtonProps) => {
  return (
    <Box
      as="span"
      role="button"
      cursor="pointer"
      color="blue.500"
      _hover={{ color: "blue.600" }}
      ml={2}
      onClick={onClick}
    >
      <HStack spacing={1}>
        <Text fontSize="sm" fontWeight="bold">
          {name}
        </Text>
      </HStack>
    </Box>
  );
};
