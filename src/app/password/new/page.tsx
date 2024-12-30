"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
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
import { ErrorCodes } from "@/lib/types/constants";

export default function ForgotPasswordPage() {
  const [resetPasswordRequest, { isLoading }] =
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
        description: "",
        status: "success",
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleResendEmailRequest = async () => {
    if (!emailAddress) {
      showToast({
        title: "Error",
        description: "Email address is missing.",
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
        description: "",
        status: "success",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PasswordLayout
      heading="Forgot your password?"
      subHeading="No sweat. Enter the email address you signed up with and we'll send
          you instructions to reset your password."
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
          <FormControl>
            <FormLabel fontSize="sm" color="neutrals.neutral500">
              Email:
            </FormLabel>
            <FormInputUI
              type="email"
              placeholder="Enter your email"
              icon={FaEnvelope}
              error={errors.email?.message}
              {...register("email")}
            />
          </FormControl>
          <Button variant="primaryButton" type="submit" isLoading={isLoading}>
            Send Reset Instructions
          </Button>
        </CardBody>
        {isResendEmailVisible && (
          <CardFooter flexDir="column" gap={2} alignItems="end" p={0}>
            <Button
              variant="primaryButton"
              isLoading={isResendEmailLoading}
              onClick={handleResendEmailRequest}
            >
              Resend Email
            </Button>
          </CardFooter>
        )}
      </Card>
    </PasswordLayout>
  );
}
