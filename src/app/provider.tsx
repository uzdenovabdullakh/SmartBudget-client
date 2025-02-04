"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { theme } from "../styles/theme";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme} resetCSS>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default Providers;
