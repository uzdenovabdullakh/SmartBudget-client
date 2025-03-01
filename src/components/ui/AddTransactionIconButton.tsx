import { AddIcon } from "@chakra-ui/icons";
import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGetAccountsQuery } from "@/lib/services/account.api";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { AddTransactionModal } from "../modals/add-transaction/AddTransactionModal";

export const AddTransactionIconButton = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { budget } = useBudgetContext();

  const { data } = useGetAccountsQuery(
    {
      id: budget?.id!,
      order: "DESC",
      page: 1,
      pageSize: 3,
    },
    { skip: !budget?.id },
  );

  return (
    <>
      <Tooltip label={t("Add Transaction")} placement="left" hasArrow>
        <IconButton
          aria-label="Add transaction"
          icon={<AddIcon />}
          colorScheme="blue"
          size="lg"
          position="fixed"
          bottom="20px"
          right="20px"
          borderRadius="full"
          boxShadow="lg"
          onClick={onOpen}
        />
      </Tooltip>

      {data?.accounts[0]?.id && (
        <AddTransactionModal
          accountId={data?.accounts[0].id}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};
