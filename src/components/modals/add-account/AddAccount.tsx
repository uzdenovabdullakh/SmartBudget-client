import React from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateAccountMutation } from "@/lib/services/account.api";
import { showToast } from "@/lib/utils/toast";
import {
  CreateAccountDto,
  CreateAccountSchema,
} from "@/lib/validation/account.schema";
import { AccountType } from "@/lib/constants/enums";
import { DefaultModalProps } from "@/lib/types/types";
import FormSelectUI from "@/components/ui/FormSelectUI";
import { useTranslation } from "react-i18next";
import { DefaultModal } from "..";
import FormInputUI from "../../ui/FormInputUI";

type AddAccountModalProps = {
  budgetId: string;
};

export const AddAccountModal = ({
  isOpen,
  onClose,
  budgetId,
}: DefaultModalProps & AddAccountModalProps) => {
  const { t } = useTranslation();
  const [createAccount, { isLoading }] = useCreateAccountMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAccountDto>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      budgetId,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<CreateAccountDto> = async (
    data: CreateAccountDto,
  ) => {
    try {
      const { message } = await createAccount(data).unwrap();

      showToast({
        title: message,
        status: "success",
      });

      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const screen = (
    <Flex direction="column" gap={4}>
      <Box>
        <FormInputUI
          type="text"
          label={t("Give it a nickname")}
          placeholder={t("Enter a nickname")}
          {...register("name")}
          error={errors.name?.message}
        />
      </Box>
      <Box>
        <FormSelectUI
          placeholder={t("Select account type...")}
          label={t("What type of account are you adding?")}
          {...register("type")}
          error={errors.type?.message}
          options={Object.values(AccountType).map((accountType) => ({
            value: accountType,
            label: t(
              accountType.charAt(0).toUpperCase() + accountType.slice(1),
            ),
          }))}
        />
      </Box>
      <Box>
        <FormInputUI
          type="number"
          label={t("What is your current account balance?")}
          placeholder={t("Enter balance")}
          {...register("amount", { valueAsNumber: true })}
          error={errors.amount?.message}
        />
      </Box>
    </Flex>
  );

  const footer = (
    <Button
      colorScheme="blue"
      width="100%"
      onClick={handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      {t("Save Changes")}
    </Button>
  );

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("Add Account")}
      body={screen}
      footer={footer}
      size="md"
    />
  );
};
