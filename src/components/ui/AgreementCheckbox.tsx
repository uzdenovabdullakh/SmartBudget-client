import { Checkbox, CheckboxProps, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

type Props = {
  error?: string;
} & CheckboxProps;

export const AgreementCheckbox = ({ error, ...rest }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Checkbox {...rest} colorScheme="blue" isInvalid={!!error}>
        {t("I agree with the terms of the")}{" "}
        <Link href="/documents/privacy-policy.pdf" target="_blank">
          <Text as="span" variant="link-text">
            {t("privacyPolicy")}{" "}
          </Text>
        </Link>
        {t("and the")}{" "}
        <Link href="/documents/user-agreement.pdf" target="_blank" color="blue">
          <Text as="span" variant="link-text">
            {t("userAgreement")}
          </Text>
        </Link>
      </Checkbox>
      {error && (
        <Text color="red.500" fontSize="sm">
          {error}
        </Text>
      )}
    </>
  );
};
