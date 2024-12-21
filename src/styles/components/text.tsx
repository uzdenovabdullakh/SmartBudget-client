import { ComponentStyleConfig } from "@chakra-ui/react";

const Text: ComponentStyleConfig = {
  variants: {
    "error-description": {
      fontSize: "lg",
      color: "granite.granite600",
      mb: 6,
    },
    "link-text": {
      color: "others.accessibleDodgerBlue",
      _hover: { textDecor: "underline" },
    },
  },
};

export default Text;
