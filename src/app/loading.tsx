"use client";

import { Loading } from "@/components/ui/Animations";
import { Flex } from "@chakra-ui/react";

export default function LoadingPage() {
  return (
    <Flex
      width="100vw"
      height="100vh"
      align="center"
      justify="center"
      flexDir="column"
    >
      <Loading />
    </Flex>
  );
}
