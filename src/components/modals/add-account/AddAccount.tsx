import React, { useState } from "react";
import { Box, Flex, Text, Button, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon, InfoIcon } from "@chakra-ui/icons";
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

  const [currentStep, setCurrentStep] = useState<"select" | "unlinked">(
    "select",
  );

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

  const goToUnlinked = () => setCurrentStep("unlinked");
  const goBack = () => setCurrentStep("select");

  const onSubmit: SubmitHandler<CreateAccountDto> = async (
    data: CreateAccountDto,
  ) => {
    try {
      await createAccount(data).unwrap();

      showToast({
        title: t("success"),
        description: t("Account created successfully!"),
        status: "success",
      });

      reset();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const selectScreen = (
    <Flex direction="column" gap={4}>
      <Flex
        direction="column"
        align="center"
        p={4}
        border="1px solid #E2E8F0"
        borderRadius="md"
        bg="blue.50"
        cursor="pointer"
        _hover={{ bg: "blue.100" }}
      >
        <Text fontSize="lg" fontWeight="bold" color="blue.600">
          {t("Linked")}
        </Text>
        <Text fontSize="sm" color="gray.600" textAlign="center">
          {t("Connect to your bank and automatically import transactions.")}
        </Text>
      </Flex>

      <Flex align="center" gap={2} color="gray.500" fontSize="sm">
        <Box flex="1" height="1px" bg="gray.300" />
        <Text>{t("or")}</Text>
        <Box flex="1" height="1px" bg="gray.300" />
      </Flex>

      <Flex
        direction="column"
        align="center"
        p={4}
        border="1px solid #E2E8F0"
        borderRadius="md"
        bg="blue.50"
        cursor="pointer"
        _hover={{ bg: "blue.100" }}
        onClick={goToUnlinked}
      >
        <Text fontSize="lg" fontWeight="bold" color="blue.600">
          {t("Unlinked")}
        </Text>
        <Text fontSize="sm" color="gray.600" textAlign="center">
          {t(
            "Start with your current balance and enter your own transactions.",
          )}
        </Text>
      </Flex>
    </Flex>
  );

  const unlinkedScreen = (
    <Flex direction="column" gap={4}>
      <Text>
        {t(
          "Let’s go! And don’t worry — if you change your mind, you can link your account at any time.",
        )}
      </Text>
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

  const unlinkedFooter = (
    <Button
      colorScheme="blue"
      width="100%"
      onClick={handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      {t("Next")}
    </Button>
  );

  const selectFooter = (
    <Flex
      align="center"
      alignItems="baseline"
      gap={2}
      fontSize="sm"
      color="gray.500"
    >
      <InfoIcon color="blue.400" />
      <Text>
        {t("Linked is your bank account (credit card)")}
        <br />
        {t("Unlinked. You will have to enter all transactions manually.")}
      </Text>
    </Flex>
  );

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        currentStep === "unlinked" ? (
          <Flex align="center" gap={2}>
            <IconButton
              aria-label="Go back"
              icon={<ArrowBackIcon />}
              variant="ghost"
              onClick={goBack}
            />
            <Text>{t("Add Unlinked Account")}</Text>
          </Flex>
        ) : (
          t("Add Account")
        )
      }
      body={currentStep === "select" ? selectScreen : unlinkedScreen}
      footer={currentStep === "select" ? selectFooter : unlinkedFooter}
      size="md"
    />
  );
};
