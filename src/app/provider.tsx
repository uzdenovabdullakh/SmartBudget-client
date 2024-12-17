import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";

function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

export default Providers;
