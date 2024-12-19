"use client";

import { Button, Text, Flex } from "@chakra-ui/react";
import Link from "next/link";
import Lottie from "lottie-react";
import notFound from "../../public/animations/404.json";

export default function NotFound() {
  return (
    <Flex
      width="100vw"
      height="100vh"
      align="center"
      justify="center"
      flexDir="column"
    >
      <Lottie
        animationData={notFound}
        loop
        style={{ maxHeight: 500, maxWidth: 500, width: "100%" }}
      />
      <Text fontSize="lg" color="gray.600" mb={6}>
        Страница не найдена. Возможно, она была удалена или никогда не
        существовала.
      </Text>
      <Link href="/">
        <Button colorScheme="blue">Вернуться на главную</Button>
      </Link>
    </Flex>
  );
}
