"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  useEffect(() => {
    console.error(t("An error has occurred!"), error);
  }, [error, t]);

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
        {t("An error has occurred!")}
      </Heading>
      <Text variant="error-description">
        {t("Something went wrong. Please try again.")}
      </Text>
      <Button variant="primaryButton" onClick={() => reset()}>
        {t("Try again")}
      </Button>
    </Box>
  );
}
