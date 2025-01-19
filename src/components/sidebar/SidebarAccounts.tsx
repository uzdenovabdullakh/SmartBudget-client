import { Account } from "@/lib/types/account.types";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Text, HStack, VStack, Box, IconButton } from "@chakra-ui/react";
import { useState } from "react";

type SidebarAccountsProps = {
  budgetName: string;
  accounts: Account[];
};

export const SidebarAccounts = ({
  budgetName,
  accounts,
}: SidebarAccountsProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen(!isOpen);

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
