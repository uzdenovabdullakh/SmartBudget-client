import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const baseStyle = {
  margin: "unset",
  padding: "unset",
};

const callToActionButton = defineStyle({
  bgColor: "firefly.firefly",
  color: "neutrals.midnight",
  size: "lg",
  _hover: { bgColor: "firefly.firefly500" },
});

const primaryButton = defineStyle({
  width: "100%",
  bg: "others.accessibleDodgerBlue",
  color: "white",
  _hover: { bg: "blue.600" },
  size: "lg",
});

const Button = defineStyleConfig({
  baseStyle,
  variants: {
    callToActionButton,
    primaryButton,
  },
});

export default Button;
