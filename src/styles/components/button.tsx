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
  bg: "others.accessibleDodgerBlue",
  color: "white",
  _hover: { bg: "blue.600" },
  size: "lg",
});

export const Button = defineStyleConfig({
  baseStyle,
  variants: {
    callToActionButton,
    primaryButton,
  },
});
