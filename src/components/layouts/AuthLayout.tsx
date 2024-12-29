import { LayoutProps } from "@/lib/types/types";
import { VStack, HStack, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function AuthLayout({
  children,
  heading,
  subHeading,
}: LayoutProps) {
  return (
    <VStack width="100vw" height="100vh" bg="blue.900">
      <HStack width="100%" align="start" padding={4} mb={14}>
        <Link href="/">
          <Heading color="white" cursor="pointer">
            Smart Budget.
          </Heading>
        </Link>
      </HStack>
      <HStack width="100%" gap={16} padding={4} justify="center">
        <VStack align="start" width="40%" color="neutrals.buttermilk">
          <Heading fontSize="40px" mb={3}>
            {heading}
          </Heading>
          <Text fontSize="sm">{subHeading}</Text>
        </VStack>
        {children}
      </HStack>
    </VStack>
  );
}
