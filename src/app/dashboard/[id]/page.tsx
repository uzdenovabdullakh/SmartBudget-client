"use client";

import { format } from "date-fns";
import { Box, Text } from "@chakra-ui/react";

export default function Budget() {
  const date = format(new Date(), "MMM yyyy");

  return (
    <>
      <Box p={6} textAlign="left" borderBottom="1px solid #e2e8f0">
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="granite.granite900"
          fontFamily="figtree"
        >
          {date}
        </Text>
      </Box>
      <Box p={8}>Dashboard Overview Content</Box>
    </>
  );
}
