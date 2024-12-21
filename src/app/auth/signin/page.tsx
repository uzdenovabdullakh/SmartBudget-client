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
          <Heading variant="cardHeader">Log In</Heading>
          <Text mt={2} fontSize="sm" color="neutrals.neutral400">
            New to Smart Budget?{" "}
            <Link href="/auth/signup">
              <Text as="span" variant="link-text">
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
            <Text variant="link-text" fontSize="sm" textAlign="right" mt={-2}>
              Forgot password?
            </Text>
          </Link>
          <Button variant="primaryButton">Log In</Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
