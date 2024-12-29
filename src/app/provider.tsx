"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { theme } from "../styles/theme";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme} resetCSS>
        {children}
      </ChakraProvider>
    </Provider>
  );
}

export default Providers;
