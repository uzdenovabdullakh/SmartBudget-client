import {
  Flex,
  Image,
  Box,
  Button,
  VStack,
  Divider,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { UserDetails } from "@/lib/types/user.types";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { Account } from "@/lib/types/account.types";
import { Budget } from "@/lib/types/budget.types";
import { useLazyGetAccountsQuery } from "@/lib/services/account.api";
import { AddAccountModal } from "../modals/add-account/AddAccount";
import { SidebarAccounts } from "./SidebarAccounts";
import { NavigationButtons } from "./NavigationButton";
import { MenuPopover } from "../popovers/menu/MenuPopover";

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
          order: "DESC",
          page: 1,
          pageSize: 3,
        }).unwrap();
        setAccounts(result.accounts);
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
      width={isSidebarOpen ? "300px" : "80px"}
      bg="blue.900"
      color="white"
      height="100vh"
      p={4}
      position="relative"
      transition="width 0.3s"
    >
      <Flex align="center" justifyContent="space-between" cursor="pointer">
        <Image
          src="/logo.png"
          alt="Logo"
          boxSize="50px"
          borderRadius="full"
          onClick={onToggle}
        />
        {isSidebarOpen && <MenuPopover user={user} />}
      </Flex>
      <Divider my={4} />
      {isSidebarOpen && (
        <>
          <VStack align="start" spacing={4} w="full">
            <NavigationButtons budgetId={budget?.id || ""} />
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
              <IconButton
                aria-label="Close Sidebar"
                icon={<MdKeyboardDoubleArrowLeft />}
                position="absolute"
                bottom="16px"
                right="16px"
                onClick={onToggle}
              />
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
