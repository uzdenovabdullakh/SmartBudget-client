"use client";

import { AccountsTable } from "@/components/account/AccountsTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { SkeletonUI } from "@/components/ui/SkeletonUI";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useGetAccountsQuery } from "@/lib/services/account.api";
import { Account } from "@/lib/types/account.types";
import { Box, Stack, Text } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 500;

export default function Accounts() {
  const params = useParams();
  const budgetId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalBalance, setTotalBalance] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const { data, isLoading } = useGetAccountsQuery(
    {
      id: budgetId!,
      order: "DESC",
      page: currentPage,
      pageSize: PAGE_SIZE,
      search: debouncedSearchQuery,
    },
    { skip: !budgetId },
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (data) {
      setAccounts(data.accounts);
      setTotalBalance(data.totalBalance);
      setTotalPages(data.totalPages);
    }
  }, [data]);

  return (
    <>
      <PageHeader text="All accounts" />
      <Box p={8}>
        {isLoading ? (
          <SkeletonUI height={4} />
        ) : (
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Total Balance: {totalBalance}
          </Text>
        )}

        <Box mb={4} borderBottom="1px solid #e2e8f0" />

        <Box mb={4} display="flex" alignItems="center">
          <SearchInput
            searchQuery={searchQuery}
            placeholder="Search all accounts"
            onSearchChange={handleSearchChange}
          />
        </Box>

        <Box mb={4} borderBottom="1px solid #e2e8f0" />

        {isLoading ? (
          <Stack>
            <SkeletonUI length={PAGE_SIZE} height={8} />
          </Stack>
        ) : (
          <>
            <AccountsTable accounts={accounts} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Box>
    </>
  );
}
