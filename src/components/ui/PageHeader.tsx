import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { SkeletonUI } from "./SkeletonUI";

type PagesHeaderProps = {
  isLoading?: boolean;
  text?: string;
  subText?: string;
  buttons?: JSX.Element;
};

export const PageHeader = ({
  text,
  subText,
  isLoading,
  buttons,
}: PagesHeaderProps) => {
  return (
    <Box p={6} textAlign="left" borderBottom="1px solid #e2e8f0">
      {isLoading ? (
        <Stack>
          <SkeletonUI height={4} />
          <SkeletonUI height={4} />
        </Stack>
      ) : (
        <>
          <HStack alignItems="center" justifyContent="space-between">
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="granite.granite900"
              fontFamily="figtree"
            >
              {text}
            </Text>
            {buttons && buttons}
          </HStack>
          {subText && <Text>{subText}</Text>}
        </>
      )}
    </Box>
  );
};
