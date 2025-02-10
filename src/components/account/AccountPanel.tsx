import { Box, HStack, Button } from "@chakra-ui/react";
import { t } from "i18next";
import { AiOutlineFile } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";
import { DateRange } from "@/lib/types/types";
import { useState } from "react";
import { DateRangePopover } from "../popovers/date-range/DateRangePopover";
import { SearchInput } from "../ui/SearchInput";

type AccountPanelProps = { accountId?: string };

export const AccountPanel = ({ accountId }: AccountPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleApplyDate = (data: DateRange) => {
    console.log(data);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
        >
          {t("Add Transaction")}
        </Button>
        <Button
          leftIcon={<AiOutlineFile />}
          colorScheme="gray"
          variant="outline"
        >
          {t("File Import")}
        </Button>
      </HStack>

      <HStack spacing={4}>
        <DateRangePopover applyDate={handleApplyDate} />
        <SearchInput
          searchQuery={searchQuery}
          placeholder={t("Search all transactions")}
          onSearchChange={handleSearchChange}
        />
      </HStack>
    </Box>
  );
};
