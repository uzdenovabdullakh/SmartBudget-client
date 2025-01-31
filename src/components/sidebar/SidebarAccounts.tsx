import { Account } from "@/lib/types/account.types";
import { Budget } from "@/lib/types/budget.types";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Text,
  HStack,
  VStack,
  Box,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

type SidebarAccountsProps = {
  budget: Budget | null;
  accounts: Account[];
};

export const SidebarAccounts = ({ budget, accounts }: SidebarAccountsProps) => {
  const router = useRouter();

  const { isOpen, onToggle } = useDisclosure();

  const handleAccountClick = (accountId: string) => {
    if (budget?.id) {
      router.push(`/dashboard/${budget?.id}/account/${accountId}`);
    }
  };

  return (
    <Box w="full">
      <HStack justifyContent="space-between" w="full" mb={2}>
        <Text fontSize="sm" fontWeight="bold">
          {budget?.name}
        </Text>
        <IconButton
          size="sm"
          variant="ghost"
          aria-label="Toggle accounts"
          icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={onToggle}
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
