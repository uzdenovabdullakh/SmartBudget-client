"use client";

import { AccountsTable } from "@/components/account/AccountsTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { SkeletonUI } from "@/components/ui/SkeletonUI";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useGetAccountsQuery } from "@/lib/services/account.api";
import { Account } from "@/lib/types/account.types";
import { formatCurrency } from "@/lib/utils/helpers";
import { Box, Stack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 500;

export default function Accounts() {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalBalance, setTotalBalance] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const { data, isLoading } = useGetAccountsQuery(
    {
      id: budget?.id!,
      order: "DESC",
      page: currentPage,
      pageSize: PAGE_SIZE,
      search: debouncedSearchQuery,
    },
    { skip: !budget?.id },
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
      <PageHeader text={t("All accounts")} />
      <Box p={8}>
        {isLoading ? (
          <SkeletonUI height={4} />
        ) : (
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            {t("Total Balance", {
              balance: formatCurrency(totalBalance, budget?.settings),
            })}
          </Text>
        )}

        <Box mb={4} borderBottom="1px solid #e2e8f0" />

        <Box mb={4} display="flex" alignItems="center">
          <SearchInput
            searchQuery={searchQuery}
            placeholder={t("Search all accounts")}
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
