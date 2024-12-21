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
import { MoneyOnCard, WomanWithGraphics } from "@/components/ui/Animations";
import Header from "@/components/ui/Header";

export default function HomePage() {
  const router = useRouter();

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
              Take Control of Your Finances Today
            </Heading>
            <Text
              fontSize={{ base: "md", lg: "lg" }}
              fontWeight="medium"
              fontStyle="italic"
            >
              Plan smarter, save better, and achieve your financial goals
              effortlessly with Smart Budget.
            </Text>
            <Button
              variant="callToActionButton"
              onClick={() => router.push("/auth/signup")}
            >
              Start using
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
              Your Financial Freedom Starts Here
            </Heading>
            <Box
              fontSize={{ base: "md", lg: "lg" }}
              fontWeight="medium"
              fontStyle="italic"
            >
              <Text>
                Smart Budget empowers you with tools to manage your money,
                reduce stress, and plan for a brighter future.
              </Text>
              <Divider
                borderColor="firefly.firefly500"
                borderWidth="2px"
                opacity={1}
              />
              <Text>
                Track expenses, set goals, and see where your money goes — all
                in one easy-to-use platform.
              </Text>
            </Box>
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
}
