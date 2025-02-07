"use client";

import {
  Box,
  Text,
  Button,
  HStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { AiOutlineFile, AiOutlineDelete } from "react-icons/ai";
import {
  useGetAccountQuery,
  useDeleteAccountMutation,
} from "@/lib/services/account.api";
import { useParams, useRouter } from "next/navigation";
import { DateRangePopover } from "@/components/popovers/date-range/DateRangePopover";
import { SearchInput } from "@/components/ui/SearchInput";
import { DateRange } from "@/lib/types/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkeletonUI } from "@/components/ui/SkeletonUI";
import { useTranslation } from "react-i18next";
import { DeleteModal } from "@/components/modals/delete/Delete";
import { showToast } from "@/lib/utils/toast";

export default function SingleAccount() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const accountId = Array.isArray(params?.account_id)
    ? params?.account_id[0]
    : params?.account_id;
  const budgetId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data: account, isLoading } = useGetAccountQuery(accountId!, {
    skip: !accountId,
  });
  const [deleteAccount, { isLoading: isDeleteAccountLoadgin }] =
    useDeleteAccountMutation();

  const [searchQuery, setSearchQuery] = useState("");

  const handleApplyDate = (data: DateRange) => {
    console.log(data);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteAccount = async () => {
    if (accountId) {
      try {
        const { message } = await deleteAccount(accountId).unwrap();

        showToast({
          title: message,
          status: "info",
        });
        router.push(`/dashboard/${budgetId}/account`);
      } catch (error) {
        console.log(error);
      }
    }
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
          <HStack alignItems="baseline" justifyContent="space-between">
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              {t("Balance")}: {account?.amount}
            </Text>
            <IconButton
              aria-label="Delete account"
              icon={<AiOutlineDelete />}
              colorScheme="red"
              onClick={onOpen}
            />
            <DeleteModal
              isLoading={isDeleteAccountLoadgin}
              isOpen={isOpen}
              onClose={onClose}
              onDelete={handleDeleteAccount}
              entity={{
                type: t("account"),
                name: account?.name || "",
              }}
            />
          </HStack>
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
