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
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterDto, RegisterSchema } from "@/lib/validation/register.schema";
import {
  useRegisterMutation,
  useResendEmailMutation,
} from "@/lib/services/auth.api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showToast } from "@/lib/utils/toast";
import { ResendEmailSchema } from "@/lib/validation/resend-email.schema";
import { TokenType } from "@/lib/types/auth.types";
import { ErrorCodes } from "@/lib/constants/error-codes";
import { useTranslation } from "react-i18next";

export default function SignUpPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [registerUser, { isLoading: isRegisterLoading }] =
    useRegisterMutation();
  const [resendEmail, { isLoading: isResendEmailLoading }] =
    useResendEmailMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(RegisterSchema),
  });

  const [isResendEmailVisible, setIsResendEmailVisible] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  const handleError = (error: unknown) => {
    const err = error as { data?: { code?: string } };
    if (err.data?.code === ErrorCodes.USER_NOT_ACTIVATED) {
      setIsResendEmailVisible(true);
    }
    console.error(error);
  };

  const handleSignUp: SubmitHandler<RegisterDto> = async (
    data: RegisterDto,
  ) => {
    setEmailAddress(data.email);

    try {
      const { login, email } = await registerUser(data).unwrap();

      router.push(
        `/auth/signup/welcome?name=${encodeURIComponent(login)}&email=${email}`,
      );
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
      const data = { email: emailAddress, type: TokenType.ACTIVATE_ACCOUNT };
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
    <AuthLayout
      heading={t("Try Smart Budget.")}
      subHeading={t(
        "Just enter your email. We will send you an email with instructions for further registration.",
      )}
    >
      <Card width="100%" maxW="md" gap={6} p={8}>
        <CardHeader justifyItems="center" p={0}>
          <Heading variant="cardHeader">{t("Sign Up")}</Heading>
          <Text mt={2} fontSize="sm" color="neutrals.neutral400">
            {t("Have an account?")}
            <Link href="/auth/signin">
              <Text as="span" variant="link-text">
                {t("Log In")}
              </Text>
            </Link>
          </Text>
        </CardHeader>

        <CardBody
          as="form"
          onSubmit={handleSubmit(handleSignUp)}
          display="flex"
          flexDir="column"
          gap={6}
          p={0}
        >
          <FormInputUI
            type="text"
            placeholder="Login"
            icon={FaUser}
            error={errors.login?.message}
            {...register("login")}
          />
          <FormInputUI
            type="email"
            placeholder="Email"
            icon={FaEnvelope}
            error={errors.email?.message}
            {...register("email")}
          />

          <Button
            variant="primaryButton"
            type="submit"
            isLoading={isRegisterLoading}
          >
            {t("Sign Up")}
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
    </AuthLayout>
  );
}
