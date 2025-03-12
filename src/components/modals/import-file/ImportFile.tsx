import React from "react";
import { DefaultModalProps } from "@/lib/types/types";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
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

  const handleClose = () => {
    reset();
    onClose();
  };

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

        handleClose();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("Upload Bank Statement")}
      size="lg"
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
        <VStack spacing={5}>
          <Button
            colorScheme="blue"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoading}
          >
            {t("Upload")}
          </Button>
          <Flex
            align="center"
            alignItems="baseline"
            gap={2}
            fontSize="sm"
            color="gray.500"
          >
            <InfoIcon color="blue.400" />
            <VStack alignItems="flex-start">
              <Text>
                {t(
                  "If the statement format is pdf, you can use the Sber or VTB statements conversion service to XLSX/CSV",
                )}
                :
              </Text>
              <Link
                href="https://it-prosto.obit.ru/tools/sberbank_statement/"
                target="_blank"
              >
                <Text as="span" variant="link-text">
                  https://it-prosto.obit.ru/tools/sberbank_statement/
                </Text>
              </Link>
            </VStack>
          </Flex>
        </VStack>
      }
    />
  );
};
