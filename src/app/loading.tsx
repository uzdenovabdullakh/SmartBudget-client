"use client";

import dynamic from "next/dynamic";
import { Flex } from "@chakra-ui/react";

const Loading = dynamic(
  () => import("@/components/ui/Animations").then((mod) => mod.Loading),
  {
    ssr: false,
  },
);

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
