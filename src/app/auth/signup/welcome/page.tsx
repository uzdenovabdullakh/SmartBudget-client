"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useResendEmailMutation } from "@/lib/services/auth.api";
import { showToast } from "@/lib/utils/toast";
import { ResendEmailSchema } from "@/lib/validation/resend-email.schema";
import { TokenType } from "@/lib/types/auth.types";

export default function WelcomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [resendEmail, { isLoading }] = useResendEmailMutation();

  const name = searchParams.get("name") || "Smart Budget User";
  const email = searchParams.get("email");

  const handleResendActivationEmail = async () => {
    if (!email) {
      showToast({
        title: "Error",
        description: "Email not found in the URL",
        status: "error",
      });
      return;
    }

    try {
      const data = { email, type: TokenType.ACTIVATE_ACCOUNT };
      ResendEmailSchema.parse(data);

      const { message } = await resendEmail(data).unwrap();

      showToast({
        title: message,
        description: "",
        status: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <VStack spacing={6} align="center" mt={10}>
      <Heading>Welcome, {name}!</Heading>
      <Text>We are excited to have you on board.</Text>
      <Text>We send confirmation email to you.</Text>
      <Button
        variant="primaryButton"
        isLoading={isLoading}
        onClick={handleResendActivationEmail}
      >
        Resend Email
      </Button>
      <Button variant="link" onClick={() => router.push("/auth/signin")}>
        Go to Login Page
      </Button>
    </VStack>
  );
}
