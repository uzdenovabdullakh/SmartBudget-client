import { Box, Stack, Text } from "@chakra-ui/react";
import { SkeletonUI } from "./SkeletonUI";

type PagesHeaderProps = {
  isLoading?: boolean;
  text?: string;
  subText?: string;
};

export const PageHeader = ({ text, subText, isLoading }: PagesHeaderProps) => {
  return (
    <Box p={6} textAlign="left" borderBottom="1px solid #e2e8f0">
      {isLoading ? (
        <Stack>
          <SkeletonUI height={4} />
          <SkeletonUI height={4} />
        </Stack>
      ) : (
        <>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="granite.granite900"
            fontFamily="figtree"
          >
            {text}
          </Text>
          {subText && <Text>{subText}</Text>}
        </>
      )}
    </Box>
  );
};
