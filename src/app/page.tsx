"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Header } from "@/components/ui/Header";
import { useEffect } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";

const MoneyOnCard = dynamic(
  () => import("@/components/ui/Animations").then((mod) => mod.MoneyOnCard),
  {
    ssr: false,
  },
);

const WomanWithGraphics = dynamic(
  () =>
    import("@/components/ui/Animations").then((mod) => mod.WomanWithGraphics),
  {
    ssr: false,
  },
);

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { getLocalStorageItem } = useLocalStorage();

  useEffect(() => {
    const token = getLocalStorageItem("authAccessToken");
    if (token) {
      router.push("/dashboard");
    }
  }, [getLocalStorageItem, router]);

  return (
    <Box
      bgColor="blurple.blurple"
      color="neutrals.buttermilk"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Header />
      <Box pt="7rem">
        <Flex
          flex="1"
          p={8}
          px="5rem"
          flexDirection={{ base: "column", lg: "row" }}
          alignItems="center"
        >
          <VStack
            align="flex-start"
            spacing={6}
            flex="1"
            maxWidth={{ base: "100%", lg: "40rem" }}
          >
            <Heading as="h2" variant="title">
              {t("Take Control of Your Finances Today")}
            </Heading>
            <Text
              fontSize={{ base: "md", lg: "lg" }}
              fontWeight="medium"
              fontStyle="italic"
            >
              {t(
                "Plan smarter, save better, and achieve your financial goals effortlessly with Smart Budget.",
              )}
            </Text>
            <Button
              variant="callToActionButton"
              onClick={() => router.push("/auth/signup")}
            >
              {t("Start using")}
            </Button>
          </VStack>
          <Box
            flex="1"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <MoneyOnCard />
          </Box>
        </Flex>
        <Flex
          flex="1"
          p={8}
          px="5rem"
          flexDirection={{ base: "column", lg: "row" }}
          alignItems="center"
        >
          <Box
            flex="1"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <WomanWithGraphics />
          </Box>
          <VStack
            align="flex-start"
            spacing={6}
            flex="1"
            maxWidth={{ base: "100%", lg: "40rem" }}
          >
            <Heading as="h2" variant="title">
              {t("Your Financial Freedom Starts Here")}
            </Heading>
            <Box
              fontSize={{ base: "md", lg: "lg" }}
              fontWeight="medium"
              fontStyle="italic"
            >
              <Text>
                {t(
                  "Smart Budget empowers you with tools to manage your money, reduce stress, and plan for a brighter future.",
                )}
              </Text>
              <Divider
                borderColor="firefly.firefly500"
                borderWidth="2px"
                opacity={1}
              />
              <Text>
                {t(
                  "Track expenses, set goals, and see where your money goes — all in one easy-to-use platform.",
                )}
              </Text>
            </Box>
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
}
