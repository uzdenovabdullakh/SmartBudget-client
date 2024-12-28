"use client";

import {
  Button,
  Card,
  CardBody,
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
import { useResetPasswordRequestMutation } from "@/lib/services/auth.api";
import { showToast } from "@/lib/utils/toast";

export default function ForgotPasswordPage() {
  const [resetPasswordRequest, { isLoading }] =
    useResetPasswordRequestMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordRequestDto>({
    resolver: zodResolver(ResetPasswordRequestSchema),
  });

  const handleResetPasswordRequest: SubmitHandler<
    ResetPasswordRequestDto
  > = async (data: ResetPasswordRequestDto) => {
    try {
      const { message } = await resetPasswordRequest(data).unwrap();

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
    <PasswordLayout
      heading="Forgot your password?"
      subHeading="No sweat. Enter the email address you signed up with and we'll send
          you instructions to reset your password."
    >
      <Card>
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
      </Card>
    </PasswordLayout>
  );
}
