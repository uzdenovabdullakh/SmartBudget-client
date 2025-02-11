"use client";

import { Box, Text, HStack, IconButton, useDisclosure } from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import {
  useGetAccountQuery,
  useDeleteAccountMutation,
} from "@/lib/services/account.api";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkeletonUI } from "@/components/ui/SkeletonUI";
import { useTranslation } from "react-i18next";
import { DeleteModal } from "@/components/modals/delete/Delete";
import { EditAccountModal } from "@/components/modals/edit-account/EditAccount";
import { showToast } from "@/lib/utils/toast";
import { AccountPanel } from "@/components/account/AccountPanel";
import { useState } from "react";

export default function SingleAccount() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();

  const accountId = Array.isArray(params?.account_id)
    ? params?.account_id[0]
    : params?.account_id;
  const budgetId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [searchQuery, setSearchQuery] = useState("");

  const deleteAccountModal = useDisclosure();
  const editAccountModal = useDisclosure();

  const { data: account, isLoading } = useGetAccountQuery(accountId!, {
    skip: !accountId,
  });
  const [deleteAccount, { isLoading: isDeleteAccountLoadgin }] =
    useDeleteAccountMutation();

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <PageHeader
        text={account?.name}
        subText={account?.type && t(account?.type)}
        isLoading={isLoading}
        buttons={
          <HStack gap={2}>
            <IconButton
              variant="outline"
              aria-label="Edit account"
              icon={<FiEdit />}
              onClick={editAccountModal.onOpen}
              colorScheme="teal"
            />
            <EditAccountModal
              isOpen={editAccountModal.isOpen}
              onClose={editAccountModal.onClose}
              account={account}
            />
            <IconButton
              aria-label="Delete account"
              icon={<AiOutlineDelete />}
              colorScheme="red"
              onClick={deleteAccountModal.onOpen}
            />
            <DeleteModal
              isLoading={isDeleteAccountLoadgin}
              isOpen={deleteAccountModal.isOpen}
              onClose={deleteAccountModal.onClose}
              onDelete={handleDeleteAccount}
              entity={{
                type: t("account"),
                name: account?.name || "",
              }}
            />
          </HStack>
        }
      />
      <Box p={8}>
        {isLoading ? (
          <SkeletonUI height={4} />
        ) : (
          <HStack alignItems="baseline" justifyContent="space-between">
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              {t("Balance")}: {account?.amount}
            </Text>
          </HStack>
        )}

        <Box mb={4} borderBottom="1px solid #e2e8f0" />

        <AccountPanel
          accountId={account?.id}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        <Box mb={4} borderBottom="1px solid #e2e8f0" />
      </Box>
    </>
  );
}
