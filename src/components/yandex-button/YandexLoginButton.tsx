import { Button, Image } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useTranslation } from "react-i18next";

export const YandexLoginButton = () => {
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
    >
      {t("Authorize by Yandex")}
    </Button>
  );
};
