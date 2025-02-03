"use client";

import { Box, Text, Button, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { AiOutlineFile } from "react-icons/ai";
import { useGetAccountQuery } from "@/lib/services/account.api";
import { useParams } from "next/navigation";
import { DateRangePopover } from "@/components/popovers/date-range/DateRangePopover";
import { SearchInput } from "@/components/ui/SearchInput";
import { DateRange } from "@/lib/types/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkeletonUI } from "@/components/ui/SkeletonUI";
import { useTranslation } from "react-i18next";

export default function SingleAccount() {
  const { t } = useTranslation();
  const params = useParams();
  const accountId = Array.isArray(params?.account_id)
    ? params?.account_id[0]
    : params?.account_id;

  const { data: account, isLoading } = useGetAccountQuery(accountId!, {
    skip: !accountId,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleApplyDate = (data: DateRange) => {
    console.log(data);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <PageHeader
        text={account?.name}
        subText={t(account?.type || "")}
        isLoading={isLoading}
      />
      <Box p={8}>
        {isLoading ? (
          <SkeletonUI height={4} />
        ) : (
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            {t("Balance")}: {account?.amount}
          </Text>
        )}

        <Box mb={4} borderBottom="1px solid #e2e8f0" />

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

        <Box mb={4} borderBottom="1px solid #e2e8f0" />
      </Box>
    </>
  );
}
