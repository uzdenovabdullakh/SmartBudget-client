"use client";

import { NotFound } from "@/components/ui/Animations";
import { Button, Text, Flex } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <Flex
      width="100vw"
      height="100vh"
      align="center"
      justify="center"
      flexDir="column"
    >
      <NotFound />
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
