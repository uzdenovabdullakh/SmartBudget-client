"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoneyOnCard, WomanWithGraphics } from "@/components/ui/Animations";

export default function HomePage() {
  const router = useRouter();

  const handleSignUp = () => router.push("/auth/signup");

  return (
    <Box
      bgColor="blurple.blurple"
      color="neutrals.buttermilk"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Flex
        as="header"
        justifyContent="space-between"
        alignItems="center"
        p={5}
        paddingLeft="5rem"
        paddingRight="5rem"
        bgColor="neutrals.midnight"
        fontFamily="figtree"
        position="fixed"
        top="0"
        width="100%"
        zIndex="1000"
      >
        <Link href="/">
          <Heading as="h1" fontSize={{ base: "xl", lg: "2xl" }}>
            Smart Budget.
          </Heading>
        </Link>
        <HStack spacing={4}>
          <Button
            variant="outline"
            color="neutrals.buttermilk"
            size="lg"
            _hover={{
              color: "firefly.firefly300",
            }}
            onClick={() => router.push("auth/signin")}
          >
            Log In
          </Button>
          <Button
            bgColor="firefly.firefly"
            color="neutrals.midnight"
            size="lg"
            _hover={{ bgColor: "firefly.firefly500" }}
            onClick={handleSignUp}
          >
            Sign Up Now
          </Button>
        </HStack>
      </Flex>
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
            <Heading
              as="h2"
              fontSize={{ base: "3xl", lg: "5xl" }}
              fontWeight="semibold"
              lineHeight="short"
            >
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
              bgColor="firefly.firefly"
              color="neutrals.midnight"
              size="lg"
              _hover={{ bgColor: "firefly.firefly500" }}
              onClick={handleSignUp}
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
            <Heading
              as="h2"
              fontSize={{ base: "3xl", lg: "5xl" }}
              fontWeight="semibold"
              lineHeight="short"
            >
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
