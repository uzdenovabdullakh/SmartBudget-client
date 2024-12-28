import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const title = defineStyle({
  fontSize: { base: "3xl", lg: "5xl" },
  fontWeight: "semibold",
  lineHeight: "short",
});

const cardHeader = defineStyle({
  fontSize: "3xl",
  color: "neutrals.midnight",
});

export const Heading = defineStyleConfig({
  variants: { title, cardHeader },
});
