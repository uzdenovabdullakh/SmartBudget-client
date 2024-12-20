"use client";

import Lottie from "lottie-react";
import { Flex } from "@chakra-ui/react";
import loading from "../../public/animations/flying-money.json";

export default function Loading() {
  return (
    <Flex
      width="100vw"
      height="100vh"
      align="center"
      justify="center"
      flexDir="column"
    >
      <Lottie
        animationData={loading}
        loop
        style={{ maxHeight: 500, maxWidth: 500, width: "100%" }}
      />
    </Flex>
  );
}
