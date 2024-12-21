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
import { FaEnvelope, FaUser } from "react-icons/fa";
import FormInputUI from "@/components/ui/FormInputUI";
import AuthLayout from "@/components/layouts/AuthLayout";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <AuthLayout
      heading="Try Smart Budget."
      subHeading="Just enter your email. We will send you an email with instructions
            for further registration."
    >
      <Card width="100%" maxW="md" gap={6} p={8}>
        <CardHeader justifyItems="center" p={0}>
          <Heading variant="cardHeader">Sign Up</Heading>
          <Text mt={2} fontSize="sm" color="neutrals.neutral400">
            Have an account?{" "}
            <Link href="/auth/signin">
              <Text as="span" variant="link-text">
                Log in.
              </Text>
            </Link>
          </Text>
        </CardHeader>
        <CardBody display="flex" flexDir="column" gap={6} p={0}>
          <FormInputUI type="text" placeholder="Login" icon={FaUser} />
          <FormInputUI type="email" placeholder="Email" icon={FaEnvelope} />
        </CardBody>
        <CardFooter flexDir="column" gap={2} alignItems="end" p={0}>
          <Button variant="primaryButton">Sign Up</Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
