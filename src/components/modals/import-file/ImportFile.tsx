import React from "react";
import { DefaultModalProps } from "@/lib/types/types";
import { Box, Button, FormControl, Input, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { showToast } from "@/lib/utils/toast";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useImportBankStatementMutation } from "@/lib/services/transaction.api";
import { DefaultModal } from "..";

type FileUploadForm = {
  file: FileList;
};

type ImportFileProps = {
  accountId?: string;
} & DefaultModalProps;

export const ImportFile = ({ isOpen, onClose, accountId }: ImportFileProps) => {
  const { t } = useTranslation();

  const [importBankStatement, { isLoading }] = useImportBankStatementMutation();

  const { register, handleSubmit, reset, control } = useForm<FileUploadForm>();
  const selectedFile = useWatch({
    control,
    name: "file",
  });

  const onSubmit: SubmitHandler<FileUploadForm> = async (data) => {
    const file = data.file[0];
    if (file) {
      try {
        const { message } = await importBankStatement({
          id: accountId!,
          file,
        }).unwrap();

        showToast({
          title: message,
          status: "success",
        });

        onClose();
        reset();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("Upload Bank Statement")}
      size="md"
      body={
        <FormControl>
          <Text mb={4}>
            {t(
              "To import transactions without linking your financial institution,  first download download a bank statement.",
            )}
          </Text>
          <Text mb={4}>{t("Supported formats: XLSX and CSV")}</Text>
          <Box
            as="label"
            display="inline-block"
            cursor="pointer"
            bg="blue.500"
            color="white"
            px={4}
            py={2}
            borderRadius="md"
            _hover={{ bg: "blue.600" }}
            _active={{ bg: "blue.700" }}
          >
            {t("Select a file")}
            <Input
              type="file"
              {...register("file", { required: true })}
              display="none"
            />
          </Box>
          <Box mt={2} fontSize="sm" color="gray.600">
            {selectedFile?.[0]?.name || t("No file chosen")}
          </Box>
        </FormControl>
      }
      footer={
        <Button
          colorScheme="blue"
          onClick={handleSubmit(onSubmit)}
          isLoading={isLoading}
        >
          {t("Upload")}
        </Button>
      }
    />
  );
};
