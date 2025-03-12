import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultModalProps } from "@/lib/types/types";
import { useChangePasswordMutation } from "@/lib/services/auth.api";
import { Button, VStack } from "@chakra-ui/react";
import {
  ChangePasswordDto,
  ChangePasswordSchema,
} from "@/lib/validation/change-password.schema";
import { showToast } from "@/lib/utils/toast";
import FormInputUI from "@/components/ui/FormInputUI";
import { useTranslation } from "react-i18next";
import { FaLock } from "react-icons/fa";
import { DefaultModal } from "..";

export const ChangePasswordModal = ({ isOpen, onClose }: DefaultModalProps) => {
  const { t } = useTranslation();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordDto>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ChangePasswordDto) => {
    try {
      const { confirmNewPassword, ...rest } = data;
      const { message } = await changePassword(rest).unwrap();

      showToast({
        title: message,
        status: "success",
      });

      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("Change password")}
      size="md"
      body={
        <VStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={5}
          align="stretch"
        >
          <FormInputUI
            type="password"
            placeholder={t("Enter your current password")}
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
            icon={FaLock}
          />
          <FormInputUI
            type="password"
            placeholder={t("Enter your new password")}
            icon={FaLock}
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <FormInputUI
            type="password"
            placeholder={t("Repeat your new password")}
            icon={FaLock}
            error={errors.confirmNewPassword?.message}
            {...register("confirmNewPassword")}
          />
        </VStack>
      }
      footer={
        <Button
          onClick={handleSubmit(onSubmit)}
          colorScheme="blue"
          isLoading={isLoading}
          width="full"
        >
          {t("Change password")}
        </Button>
      }
    />
  );
};
