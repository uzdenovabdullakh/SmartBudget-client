import "react-datepicker/dist/react-datepicker.css";
import {
  VStack,
  IconButton,
  Button,
  Divider,
  Text,
  Box,
  useDisclosure,
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
import { BasePopover } from "..";

type MenuPopoverProps = {
  user: UserDetails | null;
};

const PopoverTriggerButton = ({
  user,
  onToggle,
}: {
  user: UserDetails | null;
  onToggle: () => void;
}) => (
  <Box display="flex" alignItems="center" gap={2} onClick={onToggle}>
    <Box>
      <Text fontSize="lg" fontWeight="bold" whiteSpace="nowrap">
        {user?.login} Budget
      </Text>
      <Text fontSize="sm" color="gray.400" whiteSpace="nowrap">
        {user?.email}
      </Text>
    </Box>
    <MdOutlineArrowDropDownCircle size={20} />
  </Box>
);

const PopoverContentBody = ({
  onAddBudgetModalOpen,
  onChangeBudgetSettingsOpen,
  onNavigateToProfile,
  onViewBudgets,
}: {
  onAddBudgetModalOpen: () => void;
  onChangeBudgetSettingsOpen: () => void;
  onNavigateToProfile: () => void;
  onViewBudgets: () => void;
}) => (
  <VStack spacing={4} align="stretch">
    <Button
      leftIcon={<BsFillPlusCircleFill />}
      variant="ghost"
      justifyContent="start"
      onClick={onAddBudgetModalOpen}
    >
      New Budget
    </Button>
    <Button
      leftIcon={<RiFileList2Line />}
      variant="ghost"
      justifyContent="start"
      onClick={onViewBudgets}
    >
      View All Budgets
    </Button>

    <Divider />

    <Box>
      <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={2}>
        Current Budget
      </Text>
      <Button
        leftIcon={<FiSettings />}
        variant="ghost"
        justifyContent="start"
        onClick={onChangeBudgetSettingsOpen}
      >
        Budget Settings
      </Button>
    </Box>

    <Divider />

    <Box>
      <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={2}>
        Profile
      </Text>
      <Button
        leftIcon={<FiUser />}
        variant="ghost"
        justifyContent="start"
        onClick={onNavigateToProfile}
      >
        Profile Settings
      </Button>
    </Box>
  </VStack>
);

const LogoutButton = ({ onLogout }: { onLogout: () => void }) => (
  <IconButton aria-label="Logout" icon={<CiLogout />} onClick={onLogout}>
    Logout
  </IconButton>
);

export const MenuPopover = ({ user }: MenuPopoverProps) => {
  const router = useRouter();
  const {
    isOpen: isAddBudgetModalOpen,
    onOpen: onAddBudgetModalOpen,
    onClose: onAddBudgetModalClose,
  } = useDisclosure();
  const {
    isOpen: isChangeBudgetSettingsModalOpen,
    onOpen: onChangeBudgetSettingsOpen,
    onClose: onChangeBudgetSettingsClose,
  } = useDisclosure();
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
            onAddBudgetModalOpen={onAddBudgetModalOpen}
            onChangeBudgetSettingsOpen={onChangeBudgetSettingsOpen}
            onNavigateToProfile={() => router.push("/user/")}
            onViewBudgets={() => router.push("/dashboard/")}
          />
        }
        footerContent={<LogoutButton onLogout={handleLogout} />}
        bodyHeight="500px"
      />
      <AddBudgetModal
        isOpen={isAddBudgetModalOpen}
        onClose={onAddBudgetModalClose}
      />
      <ChangeBudgetSettingsModal
        isOpen={isChangeBudgetSettingsModalOpen}
        onClose={onChangeBudgetSettingsClose}
      />
    </>
  );
};
