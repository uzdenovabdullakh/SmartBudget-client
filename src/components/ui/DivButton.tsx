import { Box, BoxProps } from "@chakra-ui/react";

type DivButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  bgColor?: string;
  color?: string;
  _hoverBg?: string;
  borderRadius?: string;
} & BoxProps;

export const DivButton = ({
  onClick,
  children,
  bgColor = "blue.500",
  color = "white",
  _hoverBg = "blue.600",
  borderRadius = "md",
}: DivButtonProps) => {
  return (
    <Box
      role="button"
      onClick={onClick}
      borderRadius={borderRadius}
      bg={bgColor}
      color={color}
      pb={1}
      pt={1}
      pl={4}
      pr={4}
      _hover={{ bg: _hoverBg }}
      cursor="pointer"
    >
      {children}
    </Box>
  );
};
