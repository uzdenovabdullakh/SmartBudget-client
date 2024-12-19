"use client";

import Lottie from "lottie-react";
import { useEffect } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import errorAnimation from "../../public/animations/error.json";

interface ErrorProps {
  error?: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // console.error("Произошла ошибка:", error);
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
      <Lottie
        animationData={errorAnimation}
        loop
        style={{ maxHeight: 500, maxWidth: 500, width: "100%" }}
      />
      <Heading as="h1" size="2xl" color="red.500" mb={4}>
        Произошла ошибка!
      </Heading>
      <Text fontSize="lg" color="gray.600" mb={6}>
        Что-то пошло не так. Пожалуйста, попробуйте снова.
      </Text>
      <Button colorScheme="blue" size="lg" onClick={() => reset()}>
        Попробовать снова
      </Button>
    </Box>
  );
}
