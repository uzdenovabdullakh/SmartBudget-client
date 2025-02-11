import { Box, HStack, Button, useDisclosure } from "@chakra-ui/react";
import { t } from "i18next";
import { AiOutlineFile } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";
import { DateRange } from "@/lib/types/types";
import { DateRangePopover } from "../popovers/date-range/DateRangePopover";
import { SearchInput } from "../ui/SearchInput";
import { ImportFile } from "../modals/import-file/ImportFile";
import { AddTransactionModal } from "../modals/add-transaction/AddTransactionModal";

type AccountPanelProps = {
  accountId: string;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyDate: (data: DateRange) => void;
};

export const AccountPanel = ({
  accountId,
  searchQuery,
  onSearchChange,
  onApplyDate,
}: AccountPanelProps) => {
  const importFileModal = useDisclosure();
  const addTransactionModal = useDisclosure();

  return (
    <Box
      mb={4}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <HStack spacing={4}>
        <Button
          leftIcon={<IoAddCircleOutline />}
          colorScheme="blue"
          variant="solid"
          onClick={addTransactionModal.onOpen}
        >
          {t("Add Transaction")}
        </Button>
        <AddTransactionModal
          accountId={accountId}
          isOpen={addTransactionModal.isOpen}
          onClose={addTransactionModal.onClose}
        />
        <Button
          leftIcon={<AiOutlineFile />}
          colorScheme="gray"
          variant="outline"
          onClick={importFileModal.onOpen}
        >
          {t("File Import")}
        </Button>
        <ImportFile
          accountId={accountId}
          isOpen={importFileModal.isOpen}
          onClose={importFileModal.onClose}
        />
      </HStack>

      <HStack spacing={4}>
        <DateRangePopover applyDate={onApplyDate} />
        <SearchInput
          searchQuery={searchQuery}
          placeholder={t("Search all transactions")}
          onSearchChange={onSearchChange}
        />
      </HStack>
    </Box>
  );
};
