"use client";

import { Button, Card, CardBody, FormControl } from "@chakra-ui/react";
import PasswordLayout from "@/components/layouts/PasswordLayout";
import FormInputUI from "@/components/ui/FormInputUI";
import { FaLock } from "react-icons/fa";
import { showToast } from "@/lib/utils/toast";
import {
  ResetPasswordDto,
  ResetPasswordSchema,
} from "@/lib/validation/reset-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useResetPasswordMutation } from "@/lib/services/auth.api";
import { useParams, useRouter } from "next/navigation";

export default function ConfirmNewPasswordPage() {
  const params = useParams();
  const router = useRouter();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordDto>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: params.slug as string,
    },
  });

  const handleResetPassword: SubmitHandler<ResetPasswordDto> = async (
    data: ResetPasswordDto,
  ) => {
    try {
      const { confirmNewPassword, ...rest } = data;
      const { message } = await resetPassword(rest).unwrap();

      showToast({
        title: message,
        description: "",
        status: "success",
      });

      router.push("/auth/signin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PasswordLayout
      heading="Confirm password resetting"
      subHeading="Enter your new password. Keep it safe, and don't forget it again:)"
    >
      <Card>
        <CardBody
          as="form"
          onSubmit={handleSubmit(handleResetPassword)}
          display="flex"
          flexDir="column"
          gap={6}
          p={0}
        >
          <FormControl display="flex" flexDir="column" gap={6} p={0}>
            <FormInputUI
              type="password"
              placeholder="Your new password"
              icon={FaLock}
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />
            <FormInputUI
              type="password"
              placeholder="Repeat your password"
              icon={FaLock}
              error={errors.confirmNewPassword?.message}
              {...register("confirmNewPassword")}
            />
          </FormControl>
          <Button variant="primaryButton" isLoading={isLoading}>
            Reset password
          </Button>
        </CardBody>
      </Card>
    </PasswordLayout>
  );
}
