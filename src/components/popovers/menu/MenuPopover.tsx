import "react-datepicker/dist/react-datepicker.css";
import {
  VStack,
  IconButton,
  Button,
  Divider,
  Text,
  Box,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { FiSettings, FiUser } from "react-icons/fi";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { RiFileList2Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { AddBudgetModal } from "@/components/modals/add-budget/AddBudget";
import { ChangeBudgetSettingsModal } from "@/components/modals/budget-settings/BudgetSettings";
import { UserDetails } from "@/lib/types/user.types";
import { useLogoutHandler } from "@/lib/hooks/useLogoutHandler";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { useTranslation } from "react-i18next";
import { BasePopover } from "..";

type MenuPopoverProps = {
  user: UserDetails | null;
};

type PopoverTriggerButtonProps = {
  user: UserDetails | null;
  onToggle: () => void;
};

type PopoverContentBodyProps = {
  onAddBudgetModalOpen: () => void;
  onBudgetSettingsOpen: () => void;
  onNavigateToProfile: () => void;
  onViewBudgets: () => void;
};

const PopoverTriggerButton = ({
  user,
  onToggle,
}: PopoverTriggerButtonProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      onClick={onToggle}
      cursor="pointer"
    >
      <Box>
        <Text fontSize="lg" fontWeight="bold" whiteSpace="nowrap">
          {user?.login}
        </Text>
        <Text fontSize="sm" color="gray.400" whiteSpace="nowrap">
          {user?.email}
        </Text>
      </Box>
      {!isMobile && <MdOutlineArrowDropDownCircle size={20} />}
    </Box>
  );
};

const PopoverContentBody = ({
  onAddBudgetModalOpen,
  onBudgetSettingsOpen,
  onNavigateToProfile,
  onViewBudgets,
}: PopoverContentBodyProps) => {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();

  return (
    <VStack spacing={4} align="stretch">
      <Button
        leftIcon={<BsFillPlusCircleFill />}
        variant="ghost"
        justifyContent="start"
        onClick={onAddBudgetModalOpen}
      >
        {t("New Budget")}
      </Button>
      <Button
        leftIcon={<RiFileList2Line />}
        variant="ghost"
        justifyContent="start"
        onClick={onViewBudgets}
      >
        {t("View All Budgets")}
      </Button>

      <Divider />

      {budget?.id && (
        <>
          <Box>
            <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={2}>
              {t("Current Budget")}
            </Text>
            <Button
              leftIcon={<FiSettings />}
              variant="ghost"
              justifyContent="start"
              onClick={onBudgetSettingsOpen}
            >
              {t("Budget Settings")}
            </Button>
          </Box>
          <Divider />
        </>
      )}

      <Box>
        <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={2}>
          {t("Profile")}
        </Text>
        <Button
          leftIcon={<FiUser />}
          variant="ghost"
          justifyContent="start"
          onClick={onNavigateToProfile}
        >
          {t("Profile Settings")}
        </Button>
      </Box>
    </VStack>
  );
};

const LogoutButton = ({ onLogout }: { onLogout: () => void }) => {
  const { t } = useTranslation();

  return (
    <IconButton aria-label="Logout" icon={<CiLogout />} onClick={onLogout}>
      {t("Logout")}
    </IconButton>
  );
};

export const MenuPopover = ({ user }: MenuPopoverProps) => {
  const router = useRouter();
  const addBudgetModal = useDisclosure();
  const budgetSettingsModal = useDisclosure();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleLogout = useLogoutHandler();

  return (
    <>
      <BasePopover
        triggerButton={<PopoverTriggerButton user={user} onToggle={onToggle} />}
        isOpen={isOpen}
        onClose={onClose}
        bodyContent={
          <PopoverContentBody
            onAddBudgetModalOpen={addBudgetModal.onOpen}
            onBudgetSettingsOpen={budgetSettingsModal.onOpen}
            onNavigateToProfile={() => router.push("/user/")}
            onViewBudgets={() => router.push("/dashboard/")}
          />
        }
        footerContent={<LogoutButton onLogout={handleLogout} />}
        contentProps={{ maxW: "280px", mt: "80px", ml: "10px" }}
        bodyProps={{ minH: "495px" }}
      />
      <AddBudgetModal
        isOpen={addBudgetModal.isOpen}
        onClose={addBudgetModal.onClose}
      />
      <ChangeBudgetSettingsModal
        isOpen={budgetSettingsModal.isOpen}
        onClose={budgetSettingsModal.onClose}
      />
    </>
  );
};
