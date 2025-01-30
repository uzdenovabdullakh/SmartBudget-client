import { Box, Text } from "@chakra-ui/react";

type PagesHeaderProps = {
  text?: string;
  subText?: string;
};

export const PageHeader = ({ text, subText }: PagesHeaderProps) => {
  return (
    <Box p={6} textAlign="left" borderBottom="1px solid #e2e8f0">
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="granite.granite900"
        fontFamily="figtree"
      >
        {text}
      </Text>
      {subText && <Text>{subText}</Text>}
    </Box>
  );
};
