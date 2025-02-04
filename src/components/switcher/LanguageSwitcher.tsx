"use client";

import { Button, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = async (lang: "en" | "ru") => {
    await i18n.changeLanguage(lang);
  };

  return (
    <Flex gap={2}>
      <Button onClick={() => changeLanguage("en")}>EN</Button>
      <Button onClick={() => changeLanguage("ru")}>RU</Button>
    </Flex>
  );
}
