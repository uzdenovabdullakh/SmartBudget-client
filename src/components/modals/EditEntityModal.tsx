import { DefaultModalProps } from "@/lib/types/types";
import { showToast } from "@/lib/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues, Path, DefaultValues } from "react-hook-form";
import { Button, VStack } from "@chakra-ui/react";
import FormInputUI from "@/components/ui/FormInputUI";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { DefaultModal } from ".";

type EditEntityModalProps<T extends FieldValues> = {
  title: string;
  defaultValues: DefaultValues<T>;
  validationSchema: z.ZodType<T>;
  updateMutation: (data: T) => Promise<{ message: string }>;
  fields: {
    name: Path<T>;
    type: "text" | "password" | "email" | "number";
    placeholder: string;
  }[];
} & DefaultModalProps;

export const EditEntityModal = <T extends FieldValues>({
  isOpen,
  onClose,
  title,
  defaultValues,
  validationSchema,
  updateMutation,
  fields,
}: EditEntityModalProps<T>) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<T>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const onSubmit = async (data: T) => {
    try {
      const { message } = await updateMutation(data);
      showToast({ title: message, status: "success" });
      reset();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title={t(title)}
      size="sm"
      body={
        <VStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={5}
          align="stretch"
        >
          {fields.map(({ name, placeholder, type }) => (
            <FormInputUI
              key={name}
              type={type}
              placeholder={t(placeholder)}
              error={errors[name]?.message as string}
              {...register(name)}
            />
          ))}
        </VStack>
      }
      footer={
        <Button
          onClick={handleSubmit(onSubmit)}
          colorScheme="blue"
          width="full"
        >
          {t("Save Changes")}
        </Button>
      }
    />
  );
};
