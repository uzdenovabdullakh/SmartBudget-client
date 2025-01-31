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
import {
  useLoginMutation,
  useRestoreAccountRequestMutation,
} from "@/lib/services/auth.api";
import { useLazyGetUserQuery } from "@/lib/services/user.api";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { LoginDto, LoginSchema } from "@/lib/validation/login.schema";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { showToast } from "@/lib/utils/toast";
import { useState } from "react";
import { RestoreAccountRequestSchema } from "@/lib/validation/restore-account-request.schema";
import { ErrorCodes } from "@/lib/constants/error-codes";

export default function LoginPage() {
  const router = useRouter();
  const { setLocalStorageItem } = useLocalStorage();

  const [getUser] = useLazyGetUserQuery();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [restoreAccountRequest, { isLoading: isRestoreAccountLoading }] =
    useRestoreAccountRequestMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
  });

  const [isRestoreAccountVisible, setIsRestoreAccountVisible] = useState(false);
  const [email, setEmail] = useState("");

  const handleError = (error: unknown) => {
    const err = error as { data?: { code?: string } };
    if (err.data?.code === ErrorCodes.USER_DELETED) {
      setIsRestoreAccountVisible(true);
    }
    console.error(error);
  };

  const handleLogin: SubmitHandler<LoginDto> = async (data: LoginDto) => {
    setEmail(data.email);

    try {
      const { accessToken, refreshToken } = await login(data).unwrap();

      setLocalStorageItem("authAccessToken", accessToken);
      setLocalStorageItem("authRefreshToken", refreshToken);

      const { login: name } = await getUser().unwrap();

      showToast({
        title: "Login Successful",
        description: `Welcome back, ${name}!`,
        status: "success",
      });

      router.push("/dashboard");
    } catch (error) {
      handleError(error);
    }
  };

  const handleRestoreAccount = async () => {
    try {
      RestoreAccountRequestSchema.parse({ email });

      const { message } = await restoreAccountRequest({ email }).unwrap();

      router.push(
        `/auth/restore/request?message=${encodeURIComponent(message)}&email=${email}`,
      );
    } catch (error) {
      console.log(error);
    }
  };

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
        <CardBody
          as="form"
          onSubmit={handleSubmit(handleLogin)}
          display="flex"
          flexDir="column"
          gap={6}
          p={0}
        >
          <FormInputUI
            type="email"
            placeholder="Email"
            icon={FaEnvelope}
            error={errors.email?.message}
            {...register("email")}
          />
          <FormInputUI
            type="password"
            placeholder="Password"
            icon={FaLock}
            error={errors.password?.message}
            {...register("password")}
          />
          <Button
            variant="primaryButton"
            type="submit"
            isLoading={isLoginLoading}
          >
            Log In
          </Button>
        </CardBody>
        <CardFooter flexDir="column" gap={2} alignItems="end" p={0}>
          <Link href="/password/new">
            <Text variant="link-text" fontSize="sm" textAlign="right" mt={-2}>
              Forgot password?
            </Text>
          </Link>
          {isRestoreAccountVisible && (
            <Button
              variant="callToActionButton"
              onClick={handleRestoreAccount}
              isLoading={isRestoreAccountLoading}
            >
              Restore Account
            </Button>
          )}
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
