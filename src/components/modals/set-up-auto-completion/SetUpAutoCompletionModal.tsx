import React, { useState } from "react";
import { DefaultModalProps } from "@/lib/types/types";
import { Button, VStack, Text, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  useCreateAutoReplenishmentMutation,
  useUpdateAutoReplenishmentMutation,
  useDeactivateAutoReplenishmentMutation,
} from "@/lib/services/auto-replenishment.api";
import {
  CreateAutoReplenishmentDto,
  CreateAutoReplenishmentSchema,
  UpdateAutoReplenishmentDto,
  UpdateAutoReplenishmentSchema,
} from "@/lib/validation/auto-replenishment.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputUI from "@/components/ui/FormInputUI";
import { Goal } from "@/lib/types/goal.types";
import { showToast } from "@/lib/utils/toast";
import { DefaultModal } from "..";

type SetUpAutoCompletionModalProps = {
  goal: Goal;
} & DefaultModalProps;

export const SetUpAutoCompletionModal = ({
  goal,
  isOpen,
  onClose,
}: SetUpAutoCompletionModalProps) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [createAutoReplenishment, { isLoading: isCreating }] =
    useCreateAutoReplenishmentMutation();
  const [updateAutoReplenishment, { isLoading: isUpdating }] =
    useUpdateAutoReplenishmentMutation();
  const [deactivateAutoReplenishment, { isLoading: isDeactivating }] =
    useDeactivateAutoReplenishmentMutation();

  const createForm = useForm<CreateAutoReplenishmentDto>({
    resolver: zodResolver(CreateAutoReplenishmentSchema),
    defaultValues: {
      goal: goal.id,
      percentage: 1,
    },
  });

  const updateForm = useForm<UpdateAutoReplenishmentDto>({
    resolver: zodResolver(UpdateAutoReplenishmentSchema),
    defaultValues: {
      percentage: goal?.autoReplenishments?.percentage || 1,
    },
  });

  const { autoReplenishments } = goal;

  const onSubmitCreate = async (data: CreateAutoReplenishmentDto) => {
    try {
      const { message } = await createAutoReplenishment(data).unwrap();
      showToast({
        title: message,
        status: "success",
      });

      onClose();
      createForm.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitUpdate = async (data: UpdateAutoReplenishmentDto) => {
    if (!autoReplenishments) return;
    try {
      const { message } = await updateAutoReplenishment({
        id: autoReplenishments.id,
        ...data,
      }).unwrap();
      showToast({
        title: message,
        status: "success",
      });

      setIsEditing(false);
      updateForm.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async () => {
    if (!autoReplenishments) return;
    try {
      const { message } = await deactivateAutoReplenishment(
        autoReplenishments.id,
      ).unwrap();
      showToast({
        title: message,
        status: "info",
      });

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  let bodyContent;
  let footerContent;

  if (!autoReplenishments) {
    bodyContent = (
      <form>
        <VStack spacing={4}>
          <Text>{t("auto_completion_description")}</Text>
          <FormInputUI
            {...createForm.register("percentage", { valueAsNumber: true })}
            placeholder={t("Enter percentage")}
            type="number"
            error={createForm.formState.errors.percentage?.message}
          />
        </VStack>
      </form>
    );
    footerContent = (
      <Button
        onClick={createForm.handleSubmit(onSubmitCreate)}
        colorScheme="blue"
        isLoading={isCreating}
        width="full"
      >
        {t("Save Changes")}
      </Button>
    );
  } else if (isEditing) {
    bodyContent = (
      <form>
        <VStack spacing={4}>
          <FormInputUI
            {...updateForm.register("percentage", { valueAsNumber: true })}
            placeholder={t("Enter percentage")}
            type="number"
            error={updateForm.formState.errors.percentage?.message}
          />
        </VStack>
      </form>
    );
    footerContent = (
      <Button
        onClick={updateForm.handleSubmit(onSubmitUpdate)}
        colorScheme="blue"
        isLoading={isUpdating}
        width="full"
      >
        {t("Save Changes")}
      </Button>
    );
  } else {
    bodyContent = (
      <VStack spacing={4}>
        <Text>
          {t("Current Percentage")}:{" "}
          <strong>{goal?.autoReplenishments?.percentage}</strong>%
        </Text>
      </VStack>
    );
    footerContent = (
      <HStack spacing={4}>
        <Button
          onClick={() => setIsEditing(true)}
          colorScheme="blue"
          isLoading={isUpdating}
        >
          {t("Edit")}
        </Button>
        <Button onClick={onDelete} colorScheme="red" isLoading={isDeactivating}>
          {t("Delete", {
            entity: "",
          })}
        </Button>
      </HStack>
    );
  }

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("Set up auto-completion")}
      size="sm"
      body={bodyContent}
      footer={footerContent}
    />
  );
};
