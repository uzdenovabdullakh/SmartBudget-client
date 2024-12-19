"use client";

import {
  Button,
  Heading,
  Link,
  Text,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import FormInputUI from "@/components/ui/FormInputUI";

export default function LoginPage() {
  return (
    <VStack width="100vw" height="100vh" bg="blue.900">
      <HStack width="100%" align="start" padding={4} mb={14}>
        <Heading color="white">Smart budget</Heading>
      </HStack>
      <HStack width="100%" gap={16} padding={4} justify="center">
        <VStack align="start" width="40%" color="white">
          <Heading fontSize="40px" mb={3}>
            Transform your finances.
          </Heading>
          <Text fontSize="sm">
            Smart Budget empowers you to master spending, saving, and living
            with confidence through a straightforward system of impactful
            habits.
          </Text>
        </VStack>
        <Card width="100%" maxW="md" gap={6} p={8}>
          <CardHeader justifyItems="center" p={0}>
            <Heading fontSize="3xl" color="gray.800" fontFamily="Figtree">
              Log In
            </Heading>
            <Text mt={2} fontSize="sm" color="gray.500">
              New to Smart Budget?{" "}
              <Link color="blue.500" href="/signup">
                Sign up today.
              </Link>
            </Text>
          </CardHeader>
          <CardBody display="flex" flexDir="column" gap={6} p={0}>
            <FormInputUI type="email" placeholder="Email" icon={FaEnvelope} />
            <FormInputUI type="password" placeholder="Password" icon={FaLock} />
          </CardBody>
          <CardFooter flexDir="column" gap={2} alignItems="end" p={0}>
            <Link
              href="password/new"
              textAlign="right"
              color="blue.500"
              fontSize="sm"
              mt={-2}
            >
              Forgot password?
            </Link>
            <Button
              width="100%"
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
              size="lg"
            >
              Log In
            </Button>
          </CardFooter>
        </Card>
      </HStack>
    </VStack>
  );
}
