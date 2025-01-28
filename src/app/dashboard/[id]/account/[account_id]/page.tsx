"use client";

import { Box, Text, Button, HStack } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { AiOutlineFile } from "react-icons/ai";
import { useLazyGetAccountQuery } from "@/lib/services/account.api";
import { useParams } from "next/navigation";
import { Account } from "@/lib/types/account.types";
import { DateRangePopover } from "@/components/popovers/date-range/DateRangePopover";
import { SearchInput } from "@/components/ui/SearchInput";
import { DateRange } from "@/lib/types/types";

export default function SingleAccount() {
  const params = useParams();
  const accountId = Array.isArray(params?.account_id)
    ? params?.account_id[0]
    : params?.account_id;

  const [getAccount] = useLazyGetAccountQuery();
  const [account, setAccount] = useState<Account | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAccount = useCallback(async () => {
    if (!accountId) return;
    try {
      const result = await getAccount(accountId).unwrap();
      setAccount(result);
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  }, [getAccount, accountId]);

  const handleApplyDate = (data: DateRange) => {
    console.log(data);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return (
    <>
      <Box p={6} textAlign="left" borderBottom="1px solid #e2e8f0">
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="granite.granite900"
          fontFamily="figtree"
        >
          {account?.name}
        </Text>
        <Text>{account?.type}</Text>
      </Box>
      <Box p={8}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Balance: {account?.amount}
        </Text>
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
              Add Transaction
            </Button>
            <Button
              leftIcon={<AiOutlineFile />}
              colorScheme="gray"
              variant="outline"
            >
              File Import
            </Button>
          </HStack>

          <HStack spacing={4}>
            <DateRangePopover applyDate={handleApplyDate} />
            <SearchInput
              searchQuery={searchQuery}
              placeholder="Search all transactions"
              onSearchChange={handleSearchChange}
            />
          </HStack>
        </Box>

        <Box mb={4} borderBottom="1px solid #e2e8f0" />
      </Box>
    </>
  );
}
