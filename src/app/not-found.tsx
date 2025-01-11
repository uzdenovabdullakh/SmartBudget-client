"use client";

import { Button, Text, Flex } from "@chakra-ui/react";
import Link from "next/link";
import dynamic from "next/dynamic";

const NotFound = dynamic(
  () => import("@/components/ui/Animations").then((mod) => mod.NotFound),
  {
    ssr: false,
  },
);

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
      <Text variant="error-description">
        Страница не найдена. Возможно, она была удалена или никогда не
        существовала.
      </Text>
      <Link href="/">
        <Button variant="primaryButton">Вернуться на главную</Button>
      </Link>
    </Flex>
  );
}
