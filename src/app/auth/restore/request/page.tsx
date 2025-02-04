"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useResendEmailMutation } from "@/lib/services/auth.api";
import { showToast } from "@/lib/utils/toast";
import { ResendEmailSchema } from "@/lib/validation/resend-email.schema";
import { TokenType } from "@/lib/types/auth.types";
import { useTranslation } from "react-i18next";

export default function RestoreRequestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();

  const [resendEmail, { isLoading }] = useResendEmailMutation();

  const successMessage = searchParams.get("message") || t("user");
  const email = searchParams.get("email");

  const handleResendEmail = async () => {
    if (!email) {
      showToast({
        title: t("error"),
        description: t("email_not_found"),
        status: "error",
      });
      return;
    }

    try {
      const data = { email, type: TokenType.RESTORE_ACCOUNT };
      ResendEmailSchema.parse(data);

      const { message } = await resendEmail(data).unwrap();

      showToast({
        title: message,
        status: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <VStack spacing={6} align="center" mt={10}>
      <Heading>
        {t("Welcome back", {
          message: successMessage,
        })}
      </Heading>
      <Text>{t("We send restore account email to you.")}</Text>
      <Button
        variant="primaryButton"
        isLoading={isLoading}
        onClick={handleResendEmail}
      >
        {t("Resend Email")}
      </Button>
      <Button variant="link" onClick={() => router.push("/auth/signin")}>
        {t("Go to Login Page")}
      </Button>
    </VStack>
  );
}
