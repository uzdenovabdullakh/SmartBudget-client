import { Button, Image } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useTranslation } from "react-i18next";

interface YandexLoginButtonProps {
  isDisabled?: boolean;
}

export const YandexLoginButton = ({ isDisabled }: YandexLoginButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      onClick={() => signIn("yandex", { callbackUrl: "/auth/yandex" })}
      bg="#000"
      color="#fff"
      borderRadius="22px"
      leftIcon={
        <Image
          src="/yandex-icon.svg"
          alt="Yandex Logo"
          width="24px"
          height="24px"
          borderRadius="50%"
        />
      }
      isDisabled={isDisabled}
    >
      {t("Authorize by Yandex")}
    </Button>
  );
};
