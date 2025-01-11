import { Flex, Image, Box, useDisclosure, Button } from "@chakra-ui/react";
import { useGetBudgetsQuery } from "@/lib/services/budget.api";
import { AddAccountModal } from "../ui/modal/add-account/AddAccount";

export const Sidebar = () => {
  const { isOpen: isSidebarOpen, onToggle } = useDisclosure();
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();

  const { data: budgets } = useGetBudgetsQuery();

  return (
    <Flex
      direction="column"
      width={isSidebarOpen ? "180px" : "80px"}
      bg="blurple.blurple800"
      color="white"
      align="center"
      justify="start"
      p={4}
      transition="width 0.3s"
    >
      <Image
        src="/logo.png"
        alt="Logo"
        boxSize={isSidebarOpen ? "70px" : "50px"}
        mb={2}
        borderRadius={8}
        cursor="pointer"
        onClick={onToggle}
        transition="box-size 0.3s"
      />
      {isSidebarOpen && (
        <Box mt={4}>
          <Button onClick={onOpen}>Add account</Button>
        </Box>
      )}
      {isModalOpen ? (
        <AddAccountModal
          isOpen={isModalOpen}
          onClose={onClose}
          budgetId={budgets ? budgets[0].id : ""}
        />
      ) : null}
    </Flex>
  );
};
