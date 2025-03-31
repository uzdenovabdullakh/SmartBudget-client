"use client";

import { NotFoundPageAnimation } from "@/components/ui/Animations";
import { Button, Text, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Flex
      width="100vw"
      height="100vh"
      align="center"
      justify="center"
      flexDir="column"
    >
      <NotFoundPageAnimation />
      <Text variant="error-description" textAlign="center">
        {t(
          "The page was not found. It may have been deleted or never been. It existed.",
        )}
      </Text>
      <Link href="/">
        <Button variant="primaryButton">{t("Go back to the main page")}</Button>
      </Link>
    </Flex>
  );
}
