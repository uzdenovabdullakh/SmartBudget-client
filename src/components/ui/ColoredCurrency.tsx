import { useBudgetContext } from "@/lib/context/BudgetContext";
import { formatCurrency, getCurrencyColorStyles } from "@/lib/utils/helpers";
import { Box, Button, ButtonProps } from "@chakra-ui/react";
import { useMemo } from "react";

type ColoredCurrencyProps = {
  currency: number;
  nodeType: "span" | "button";
} & ButtonProps;

export const ColoredCurrency = ({
  currency,
  nodeType,
  ...rest
}: ColoredCurrencyProps) => {
  const { budget } = useBudgetContext();

  const currencyStyles = useMemo(
    () => getCurrencyColorStyles(currency),
    [currency],
  );

  if (nodeType === "span") {
    const commonStyles = {
      size: "sm",
      bgColor: currencyStyles.bgColor,
      color: currencyStyles.color,
      fontWeight: "medium",
      borderRadius: "full",
      padding: "0 .4375rem",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    };
    return (
      <Box as="span" {...commonStyles}>
        {formatCurrency(currency, budget?.settings)}
      </Box>
    );
  }

  return (
    <Button
      size="sm"
      bgColor={currencyStyles.bgColor}
      color={currencyStyles.color}
      variant="solid"
      fontWeight="medium"
      borderRadius="full"
      padding="0 .4375rem"
      {...rest}
    >
      {formatCurrency(currency, budget?.settings)}
    </Button>
  );
};
