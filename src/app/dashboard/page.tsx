"use client";

import { Brief } from "@/components/brief/Brief";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useLazyGetUserQuery } from "@/lib/services/user.api";
import { Box, Flex, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const date = format(new Date(), "MMM yyyy");

  const [getUser] = useLazyGetUserQuery();

  const [isBriefVisible, setBriefVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { isBriefCompleted } = await getUser().unwrap();
      setBriefVisible(!isBriefCompleted);
    };

    fetchUser();
  }, [getUser]);

  return (
    <Flex height="100vh" overflow="hidden">
      {isBriefVisible && <Brief onClose={() => setBriefVisible(false)} />}
      <Sidebar />
      <Flex flex="1" direction="column">
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
        <Box p={8}>Dashboard Content</Box>
      </Flex>
    </Flex>
  );
}
