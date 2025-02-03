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
import { UserDetails } from "@/lib/types/user.types";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { Budget } from "@/lib/types/budget.types";
import { useGetAccountsQuery } from "@/lib/services/account.api";
import { useTranslation } from "react-i18next";
import { AddAccountModal } from "../modals/add-account/AddAccount";
import { SidebarAccounts } from "./SidebarAccounts";
import { NavigationButtons } from "./NavigationButton";
import { MenuPopover } from "../popovers/menu/MenuPopover";

type SidebarProps = {
  user: UserDetails | null;
  budget: Budget | null;
};

export const Sidebar = ({ user, budget }: SidebarProps) => {
  const { t } = useTranslation();

  const { isOpen, onToggle } = useDisclosure();
  const addAccountModal = useDisclosure();

  const { data } = useGetAccountsQuery(
    {
      id: budget?.id || "",
      order: "DESC",
      page: 1,
      pageSize: 3,
    },
    { skip: !budget?.id },
  );

  return (
    <Flex
      direction="column"
      width={isOpen ? "300px" : "80px"}
      bg="blue.900"
      color="white"
      height="100vh"
      p={4}
      position="relative"
      transition="width 0.3s"
    >
      <Flex align="center" justifyContent="space-between">
        <Image
          src="/logo.png"
          alt="Logo"
          boxSize="50px"
          borderRadius="full"
          onClick={onToggle}
          cursor="pointer"
        />
        {isOpen && <MenuPopover user={user} />}
      </Flex>
      <Divider my={4} />
      {isOpen && (
        <>
          <VStack align="start" spacing={4} w="full">
            <NavigationButtons budgetId={budget?.id || ""} />
            <Divider />
            <Box w="full">
              <SidebarAccounts
                budget={budget}
                accounts={data?.accounts || []}
              />
              <Button
                mt={4}
                size="sm"
                w="full"
                leftIcon={<IoAddCircleOutline />}
                onClick={addAccountModal.onOpen}
              >
                {t("Add Account")}
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
            isOpen={addAccountModal.isOpen}
            onClose={addAccountModal.onClose}
            budgetId={budget?.id || ""}
          />
        </>
      )}
    </Flex>
  );
};
