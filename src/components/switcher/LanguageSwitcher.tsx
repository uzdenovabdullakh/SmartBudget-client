"use client";

import { Button, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<string | null>(null);

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const changeLanguage = async (lang: "en" | "ru") => {
    await i18n.changeLanguage(lang);
    setCurrentLang(lang);
  };

  if (!currentLang) return null;

  return (
    <Flex gap={2}>
      <Button
        onClick={() => changeLanguage("en")}
        isActive={currentLang === "en"}
      >
        EN
      </Button>
      <Button
        onClick={() => changeLanguage("ru")}
        isActive={currentLang === "ru"}
      >
        RU
      </Button>
    </Flex>
  );
}
