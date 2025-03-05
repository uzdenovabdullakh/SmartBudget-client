import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  IoWalletOutline,
  IoAnalyticsOutline,
  IoListOutline,
} from "react-icons/io5";
import { GoGoal } from "react-icons/go";

const navigationButtons = [
  { label: "Budget", path: "", icon: <IoWalletOutline /> },
  { label: "Reflect", path: "analytic", icon: <IoAnalyticsOutline /> },
  { label: "All Accounts", path: "account", icon: <IoListOutline /> },
  { label: "Goals", path: "goals", icon: <GoGoal /> },
];

type NavigationButtonsProps = {
  budgetId: string;
};

export const NavigationButtons = ({ budgetId }: NavigationButtonsProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      {navigationButtons.map((button) => (
        <Button
          key={button.label}
          justifyContent="start"
          w="full"
          leftIcon={button.icon}
          onClick={() => router.push(`/dashboard/${budgetId}/${button.path}`)}
        >
          {t(button.label)}
        </Button>
      ))}
    </>
  );
};
