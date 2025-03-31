import {
  Flex,
  Image,
  Box,
  Button,
  VStack,
  Divider,
  useDisclosure,
  IconButton,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import { UserDetails } from "@/lib/types/user.types";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useGetAccountsQuery } from "@/lib/services/account.api";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { HamburgerIcon } from "@chakra-ui/icons";
import { AddAccountModal } from "../modals/add-account/AddAccount";
import { SidebarAccounts } from "./SidebarAccounts";
import { NavigationButtons } from "./NavigationButton";
import { SkeletonUI } from "../ui/SkeletonUI";

const MenuPopover = dynamic(
  () => import("../popovers/menu/MenuPopover").then((mod) => mod.MenuPopover),
  {
    ssr: true,
    loading: () => <SkeletonUI height="40px" width="200px" />,
  },
);

type SidebarProps = {
  user: UserDetails | null;
};

export const Sidebar = ({ user }: SidebarProps) => {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();

  const { isOpen, onToggle } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
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

  if (isMobile)
    return (
      <>
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          position="fixed"
          top="4"
          left="4"
          zIndex="dropdown"
          onClick={onToggle}
        />

        <Drawer isOpen={isOpen} placement="left" onClose={onToggle}>
          <DrawerOverlay />
          <DrawerContent bg="blue.900" color="white">
            <DrawerCloseButton />
            <DrawerBody p={4}>
              <VStack align="start" spacing={4} w="full">
                <MenuPopover user={user} />
                <Divider />
                <NavigationButtons budgetId={budget?.id || ""} />
                <Divider />
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
              </VStack>
              <AddAccountModal
                isOpen={addAccountModal.isOpen}
                onClose={addAccountModal.onClose}
                budgetId={budget?.id || ""}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
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
