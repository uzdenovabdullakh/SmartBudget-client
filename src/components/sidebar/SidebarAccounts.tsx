import { Account } from "@/lib/types/account.types";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Text, HStack, VStack, Box, IconButton } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type SidebarAccountsProps = {
  budgetName: string;
  accounts: Account[];
};

export const SidebarAccounts = ({
  budgetName,
  accounts,
}: SidebarAccountsProps) => {
  const router = useRouter();
  const params = useParams();
  const budgetId = params?.id;

  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleAccountClick = (accountId: string) => {
    if (budgetId) {
      router.push(`/dashboard/${budgetId}/account/${accountId}`);
    }
  };

  return (
    <Box w="full">
      <HStack justifyContent="space-between" w="full" mb={2}>
        <Text fontSize="sm" fontWeight="bold">
          {budgetName}
        </Text>
        <IconButton
          size="sm"
          variant="ghost"
          aria-label="Toggle accounts"
          icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={toggleOpen}
        />
      </HStack>

      {isOpen && (
        <VStack align="start" spacing={2} w="full">
          {accounts?.map((account) => (
            <HStack
              key={account.id}
              justifyContent="space-between"
              w="full"
              pl={4}
              onClick={() => handleAccountClick(account.id)}
              cursor="pointer"
            >
              <Text>{account.name}</Text>
              <Text>{account.amount}</Text>
            </HStack>
          ))}
        </VStack>
      )}
    </Box>
  );
};
