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
import { FaLock } from "react-icons/fa";
import FormInputUI from "@/components/ui/FormInputUI";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function ConfirmRegistrationPage() {
  return (
    <AuthLayout
      heading="One last step"
      subHeading="Complete the registration and start managing your finances"
    >
      <Card width="100%" maxW="md" gap={6} p={8}>
        <CardHeader justifyItems="center" p={0}>
          <Heading fontSize="3xl" color="gray.800" fontFamily="Figtree">
            Complete sign up
          </Heading>
          <Text mt={2} fontSize="sm" color="neutrals.neutral400">
            Create and enter a password to complete signing up{" "}
          </Text>
        </CardHeader>
        <CardBody display="flex" flexDir="column" gap={6} p={0}>
          <FormInputUI
            type="password"
            placeholder="Your password"
            icon={FaLock}
          />
          <FormInputUI
            type="password"
            placeholder="Repeat your password"
            icon={FaLock}
          />
        </CardBody>
        <CardFooter flexDir="column" gap={2} alignItems="end" p={0}>
          <Button
            width="100%"
            bg="others.accessibleDodgerBlue"
            color="white"
            _hover={{ bg: "blue.600" }}
            size="lg"
          >
            Confirm
          </Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
