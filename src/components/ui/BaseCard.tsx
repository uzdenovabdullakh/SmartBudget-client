import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
} & BoxProps;

export const BaseCard = ({ children, ...rest }: Props) => {
  return (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      cursor="pointer"
      {...rest}
    >
      {children}
    </Box>
  );
};
