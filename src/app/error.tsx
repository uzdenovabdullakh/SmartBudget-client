"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

const ErrorAnimation = dynamic(
  () => import("@/components/ui/Animations").then((mod) => mod.ErrorAnimation),
  {
    ssr: false,
  },
);

interface ErrorProps {
  error?: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Произошла ошибка:", error);
  }, [error]);

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      bg="gray.50"
      px={6}
    >
      <ErrorAnimation />
      <Heading as="h1" size="2xl" color="red.500" mb={4}>
        Произошла ошибка!
      </Heading>
      <Text variant="error-description">
        Что-то пошло не так. Пожалуйста, попробуйте снова.
      </Text>
      <Button variant="primaryButton" onClick={() => reset()}>
        Попробовать снова
      </Button>
    </Box>
  );
}
