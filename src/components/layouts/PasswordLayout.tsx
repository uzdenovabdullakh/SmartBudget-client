import { LayoutProps } from "@/lib/types/types";
import { VStack, Box, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function PasswordLayout({
  children,
  heading,
  subHeading,
}: LayoutProps) {
  const { t } = useTranslation();

  return (
    <VStack
      width="100vw"
      height="100vh"
      bg="white"
      justify="center"
      spacing={8}
      padding={4}
    >
      <Box position="absolute" top={4} left={8}>
        <Heading color="blurple.blurple800" size="lg">
          Smart Budget.
        </Heading>
      </Box>
      <VStack
        maxW="lg"
        width="100%"
        spacing={6}
        align="stretch"
        padding={6}
        boxShadow="md"
        borderRadius="md"
        bg="white"
      >
        <Heading fontSize="2xl" color="granite.granite900" textAlign="left">
          {heading}
        </Heading>
        <Text fontSize="md" color="granite.granite600" fontFamily="nunito">
          {subHeading}
        </Text>
        {children}
        <Text as="span" fontSize="sm" textAlign="center" variant="link-text">
          <Link href="/auth/signin">{t("Return to log in")}</Link>
        </Text>
      </VStack>
    </VStack>
  );
}
