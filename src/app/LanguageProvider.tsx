"use client";

import { ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import LoadingPage from "./loading";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem("i18nextLng") || "en";
    i18n.changeLanguage(storedLang).then(() => setIsLoaded(true));
  }, []);

  if (!isLoaded) return <LoadingPage />;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
