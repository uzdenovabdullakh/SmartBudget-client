"use client";

import {
  Button,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import FormInputUI from "@/components/ui/FormInputUI";
import AuthLayout from "@/components/layouts/AuthLayout";
import Link from "next/link";

export default function LoginPage() {
  return (
    <AuthLayout
      heading="Transform your finances."
      subHeading="Smart Budget empowers you to master spending, saving, and living with confidence through a straightforward system of impactful habits."
    >
      <Card width="100%" maxW="md" gap={6} p={8}>
        <CardHeader justifyItems="center" p={0}>
          <Heading
            fontSize="3xl"
            color="neutrals.midnight"
            fontFamily="Figtree"
          >
            Log In
          </Heading>
          <Text mt={2} fontSize="sm" color="neutrals.neutral400">
            New to Smart Budget?{" "}
            <Link href="/auth/signup">
              <Text
                as="span"
                color="others.accessibleDodgerBlue"
                _hover={{ textDecor: "underline" }}
              >
                Sign up today.
              </Text>
            </Link>
          </Text>
        </CardHeader>
        <CardBody display="flex" flexDir="column" gap={6} p={0}>
          <FormInputUI type="email" placeholder="Email" icon={FaEnvelope} />
          <FormInputUI type="password" placeholder="Password" icon={FaLock} />
        </CardBody>
        <CardFooter flexDir="column" gap={2} alignItems="end" p={0}>
          <Link href="/password/new">
            <Text
              as="span"
              textAlign="right"
              color="others.accessibleDodgerBlue"
              fontSize="sm"
              mt={-2}
              _hover={{ textDecor: "underline" }}
            >
              Forgot password?
            </Text>
          </Link>
          <Button
            width="100%"
            bg="others.accessibleDodgerBlue"
            color="white"
            _hover={{ bg: "blue.600" }}
            size="lg"
          >
            Log In
          </Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
