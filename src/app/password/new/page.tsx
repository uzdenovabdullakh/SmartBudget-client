"use client";

import { Button, FormControl, FormLabel } from "@chakra-ui/react";
import PasswordLayout from "@/components/layouts/PasswordLayout";
import FormInputUI from "@/components/ui/FormInputUI";
import { FaEnvelope } from "react-icons/fa";

export default function ForgotPasswordPage() {
  return (
    <PasswordLayout
      heading="Forgot your password?"
      subHeading="No sweat. Enter the email address you signed up with and we'll send
          you instructions to reset your password."
    >
      <FormControl>
        <FormLabel fontSize="sm" color="neutrals.neutral500">
          Email:
        </FormLabel>
        <FormInputUI
          type="email"
          placeholder="Enter your email"
          icon={FaEnvelope}
        />
      </FormControl>
      <Button
        width="100%"
        bg="blue.600"
        color="white"
        _hover={{ bg: "blue.700" }}
        size="lg"
      >
        Send Reset Instructions
      </Button>
    </PasswordLayout>
  );
}
