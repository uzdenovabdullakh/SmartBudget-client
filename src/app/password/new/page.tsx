"use client";

import { Button, Card, CardBody, CardFooter } from "@chakra-ui/react";
import PasswordLayout from "@/components/layouts/PasswordLayout";
import FormInputUI from "@/components/ui/FormInputUI";
import { FaEnvelope } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordRequestDto,
  ResetPasswordRequestSchema,
} from "@/lib/validation/reset-password-request.schema";
import {
  useResendEmailMutation,
  useResetPasswordRequestMutation,
} from "@/lib/services/auth.api";
import { showToast } from "@/lib/utils/toast";
import { useState } from "react";
import { ResendEmailSchema } from "@/lib/validation/resend-email.schema";
import { TokenType } from "@/lib/types/auth.types";
import { ErrorCodes } from "@/lib/constants/error-codes";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  const [resetPasswordRequest, { isLoading: isResetPasswordLoading }] =
    useResetPasswordRequestMutation();
  const [resendEmail, { isLoading: isResendEmailLoading }] =
    useResendEmailMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordRequestDto>({
    resolver: zodResolver(ResetPasswordRequestSchema),
  });

  const [isResendEmailVisible, setIsResendEmailVisible] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  const handleError = (error: unknown) => {
    const err = error as { data?: { code?: string } };
    if (err.data?.code === ErrorCodes.TOO_MANY_REQUESTS) {
      setIsResendEmailVisible(true);
    }
    console.error(error);
  };

  const handleResetPasswordRequest: SubmitHandler<
    ResetPasswordRequestDto
  > = async (data: ResetPasswordRequestDto) => {
    setEmailAddress(data.email);

    try {
      const { message } = await resetPasswordRequest(data).unwrap();

      showToast({
        title: message,
        status: "success",
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleResendEmailRequest = async () => {
    if (!emailAddress) {
      showToast({
        title: t("error"),
        description: t("Email address is missing."),
        status: "error",
      });
      return;
    }

    try {
      const data = { email: emailAddress, type: TokenType.RESET_PASSWORD };
      ResendEmailSchema.parse(data);

      const { message } = await resendEmail(data).unwrap();

      showToast({
        title: message,
        status: "success",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PasswordLayout
      heading={t("Forgot your password?")}
      subHeading={t(
        "No sweat. Enter the email address you signed up with and we'll send you instructions to reset your password.",
      )}
    >
      <Card display="flex" flexDir="column" gap={6} p={0} boxShadow="none">
        <CardBody
          as="form"
          onSubmit={handleSubmit(handleResetPasswordRequest)}
          display="flex"
          flexDir="column"
          gap={6}
          p={0}
        >
          <FormInputUI
            type="email"
            label={t("Email")}
            placeholder={t("Enter your email")}
            icon={FaEnvelope}
            error={errors.email?.message}
            {...register("email")}
          />
          <Button
            variant="primaryButton"
            type="submit"
            isLoading={isResetPasswordLoading}
          >
            {t("Send Reset Instructions")}
          </Button>
        </CardBody>
        {isResendEmailVisible && (
          <CardFooter flexDir="column" gap={2} alignItems="end" p={0}>
            <Button
              variant="primaryButton"
              isLoading={isResendEmailLoading}
              onClick={handleResendEmailRequest}
            >
              {t("Resend Email")}
            </Button>
          </CardFooter>
        )}
      </Card>
    </PasswordLayout>
  );
}
