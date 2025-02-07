"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "./LanguageProvider";
import { theme } from "../styles/theme";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme} resetCSS>
        <LanguageProvider>
          <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
            {children}
          </SessionProvider>
        </LanguageProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default Providers;
