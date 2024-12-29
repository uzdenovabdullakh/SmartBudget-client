"use client";

import {
  Button,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { FaLock } from "react-icons/fa";
import FormInputUI from "@/components/ui/FormInputUI";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useParams, useRouter } from "next/navigation";
import { useConfirmRegisterMutation } from "@/lib/services/auth.api";
import {
  ConfirmSignUpDto,
  ConfirmSignUpSchema,
} from "@/lib/validation/confirm-signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { showToast } from "@/lib/utils/toast";

export default function ConfirmRegistrationPage() {
  const params = useParams();
  const router = useRouter();

  const [confirmRegister, { isLoading }] = useConfirmRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmSignUpDto>({
    resolver: zodResolver(ConfirmSignUpSchema),
    defaultValues: {
      token: params.slug as string,
    },
  });

  const handleConfirmRegister: SubmitHandler<ConfirmSignUpDto> = async (
    data: ConfirmSignUpDto,
  ) => {
    try {
      const { confirmPassword, ...rest } = data;
      const { message } = await confirmRegister(rest).unwrap();

      showToast({
        title: message,
        description: "You will now be redirected to the login page.",
        status: "success",
      });

      router.push("/auth/signin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayout
      heading="One last step"
      subHeading="Complete the registration and start managing your finances"
    >
      <Card width="100%" maxW="md" gap={6} p={8}>
        <CardHeader justifyItems="center" p={0}>
          <Heading variant="cardHeader">Complete sign up</Heading>
          <Text mt={2} fontSize="sm" color="neutrals.neutral400">
            Create and enter a password to complete signing up{" "}
          </Text>
        </CardHeader>
        <CardBody
          display="flex"
          flexDir="column"
          gap={6}
          p={0}
          as="form"
          onSubmit={handleSubmit(handleConfirmRegister)}
        >
          <FormInputUI
            type="password"
            placeholder="Your password"
            icon={FaLock}
            error={errors.password?.message}
            {...register("password")}
          />
          <FormInputUI
            type="password"
            placeholder="Repeat your password"
            icon={FaLock}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button variant="primaryButton" type="submit" isLoading={isLoading}>
            Confirm
          </Button>
        </CardBody>
      </Card>
    </AuthLayout>
  );
}
