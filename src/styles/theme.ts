"use client";

import { extendTheme } from "@chakra-ui/react";
import colors from "./colors/colors";

const theme = extendTheme({
  colors,
  fonts: {
    heading: '"Figtree", Helvetica, Arial, sans-serif',
    body: '"Figtree", Helvetica, Arial, sans-serif',
    jetbrain: '"JetBrains Mono", monospace',
    playfair: '"Playfair Display", serif',
    figtree: '"Figtree", sans-serif',
    nunito: '"Nunito", sans-serif',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
    light: 300,
    extralight: 200,
  },
  styles: {
    global: {
      "html, body": {
        fontFamily: "'Nunito', sans-serif",
        fontWeight: "normal",
        lineHeight: "tall",
      },
      h1: {
        fontFamily: "'Playfair Display', serif",
        fontWeight: "bold",
      },
      h2: {
        fontFamily: "'Figtree', sans-serif",
        fontWeight: "semibold",
      },
    },
  },
});

export default theme;
