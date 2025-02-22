import { VStack, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type Props = {
  onSelect: (step: "manual" | "scan") => void;
};

export const TransactionChoice = ({ onSelect }: Props) => {
  const { t } = useTranslation();

  return (
    <VStack spacing={4}>
      <Button
        onClick={() => onSelect("manual")}
        colorScheme="blue"
        width="full"
      >
        {t("Enter manually")}
      </Button>
      <Button onClick={() => onSelect("scan")} colorScheme="green" width="full">
        {t("Scan QR Code")}
      </Button>
    </VStack>
  );
};
