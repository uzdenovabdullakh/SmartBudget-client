import {
  Flex,
  Image,
  Box,
  Button,
  Text,
  VStack,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { UserDetails } from "@/lib/types/user.types";
import { IoAddCircleOutline } from "react-icons/io5";
import { Account } from "@/lib/types/account.types";
import { Budget } from "@/lib/types/budget.types";
import { useLazyGetAccountsQuery } from "@/lib/services/account.api";
import { AddAccountModal } from "../ui/modal/add-account/AddAccount";
import { SidebarAccounts } from "./SidebarAccounts";

type SidebarProps = {
  user: UserDetails | null;
  budget: Budget | null;
};

export const Sidebar = ({ user, budget }: SidebarProps) => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const { isOpen: isSidebarOpen, onToggle } = useDisclosure();
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();

  const [getAccounts] = useLazyGetAccountsQuery();

  const fetchAccounts = useCallback(async () => {
    try {
      if (budget?.id) {
        const result = await getAccounts({
          id: budget.id,
          order: "desc",
          page: 1,
          pageSize: 3,
        }).unwrap();
        setAccounts(result);
      }
    } catch (error) {
      console.log(error);
    }
  }, [budget?.id, getAccounts]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <Flex
      direction="column"
      width={isSidebarOpen ? "250px" : "80px"}
      bg="blue.900"
      color="white"
      height="100vh"
      p={4}
      transition="width 0.3s"
    >
      <Flex
        align="center"
        justifyContent="space-between"
        cursor="pointer"
        onClick={onToggle}
      >
        <Image src="/logo.png" alt="Logo" boxSize="50px" borderRadius="full" />
        {isSidebarOpen && (
          <Box ml={2}>
            <Text fontSize="lg" fontWeight="bold" whiteSpace="nowrap">
              {user?.login} Budget
            </Text>
            <Text
              fontSize="sm"
              color="gray.400"
              maxWidth="180px"
              whiteSpace="normal"
              wordBreak="break-word"
            >
              {user?.email}
            </Text>
          </Box>
        )}
      </Flex>
      <Divider my={4} />
      {isSidebarOpen && (
        <>
          <VStack align="start" spacing={4} w="full">
            <Button justifyContent="start" w="full">
              <Text>Budget</Text>
            </Button>
            <Button justifyContent="start" w="full">
              <Text>Reflect</Text>
            </Button>
            <Button justifyContent="start" w="full">
              <Text>All Accounts</Text>
            </Button>

            <Divider />

            <Box w="full">
              <SidebarAccounts
                budgetName={budget?.name || ""}
                accounts={accounts}
              />
              <Button
                mt={4}
                size="sm"
                w="full"
                leftIcon={<IoAddCircleOutline />}
                onClick={onOpen}
              >
                Add Account
              </Button>
            </Box>
          </VStack>
          <AddAccountModal
            isOpen={isModalOpen}
            onClose={onClose}
            budgetId={budget?.id || ""}
            refreshAccounts={fetchAccounts}
          />
        </>
      )}
    </Flex>
  );
};
