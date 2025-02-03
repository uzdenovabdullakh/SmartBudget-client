"use client";

import { Button, Text, Flex } from "@chakra-ui/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

const NotFound = dynamic(
  () => import("@/components/ui/Animations").then((mod) => mod.NotFound),
  {
    ssr: false,
  },
);

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
      <NotFound />
      <Text variant="error-description">
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
