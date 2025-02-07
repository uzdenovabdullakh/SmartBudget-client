"use client";

import {
  useDeleteProfileMutation,
  useGetUserQuery,
} from "@/lib/services/user.api";
import {
  Box,
  Divider,
  Text,
  Button,
  useDisclosure,
  Stack,
  Card,
  CardBody,
  Heading,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { LanguageSwitcher } from "@/components/switcher/LanguageSwitcher";
import { SkeletonUI } from "@/components/ui/SkeletonUI";
import { useTranslation } from "react-i18next";
import { DeleteModal } from "@/components/modals/delete/Delete";
import { showToast } from "@/lib/utils/toast";
import {
  FiLock,
  FiTrash2,
  FiGlobe,
  FiEdit,
  FiArrowLeft,
  FiInfo,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { EditLoginModal } from "@/components/modals/edit-login/EditLogin";
import { ChangePasswordModal } from "@/components/modals/change-password/ChangePassword";

export default function UserProfile() {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: user, isLoading } = useGetUserQuery();

  const changePasswordModal = useDisclosure();
  const deleteModal = useDisclosure();
  const editLoginModal = useDisclosure();

  const [deleteProfile, { isLoading: isDeleteProfileLoading }] =
    useDeleteProfileMutation();

  const handleDeleteProfile = async () => {
    try {
      const { message } = await deleteProfile().unwrap();
      deleteModal.onClose();
      showToast({ title: message, status: "info" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box maxW="2xl" mx="auto" p={{ base: 4, md: 6 }}>
      <Flex align="center" mb={6}>
        <IconButton
          aria-label="Back"
          icon={<FiArrowLeft />}
          onClick={() => router.back()}
          variant="ghost"
          mr={2}
        />
        <Heading as="h1" size="xl" fontWeight="extrabold">
          {t("User profile")}
        </Heading>
      </Flex>

      <Card shadow="sm" mb={6}>
        <CardBody>
          <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
            <FiInfo /> {t("Basic Information")}
          </Heading>

          {isLoading ? (
            <Stack spacing={3}>
              <SkeletonUI height={5} width="70%" />
              <SkeletonUI height={5} width="60%" />
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Flex alignItems="center">
                <Text fontWeight="medium" minW={24}>
                  {t("Email")}
                </Text>
                <Text color="gray.500">{user?.email}</Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontWeight="medium" minW={24}>
                  {t("Login")}
                </Text>
                <Text color="gray.500">{user?.login}</Text>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<FiEdit />}
                  onClick={editLoginModal.onOpen}
                  colorScheme="teal"
                  ml={2}
                >
                  {t("Change")}
                </Button>
                <EditLoginModal
                  isOpen={editLoginModal.isOpen}
                  onClose={editLoginModal.onClose}
                  login={user?.login}
                />
              </Flex>
            </Stack>
          )}
        </CardBody>
      </Card>

      <Card shadow="sm" mb={6}>
        <CardBody>
          <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
            <FiGlobe /> {t("Language settings")}
          </Heading>
          <LanguageSwitcher />
        </CardBody>
      </Card>

      {!isLoading && !user?.yandexId && (
        <Card shadow="sm" mb={6}>
          <CardBody>
            <Heading
              size="md"
              mb={4}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <FiLock /> {t("Security settings")}
            </Heading>
            <Button
              onClick={changePasswordModal.onOpen}
              colorScheme="blue"
              variant="outline"
              leftIcon={<FiLock />}
            >
              {t("Change password")}
            </Button>
            <ChangePasswordModal
              isOpen={changePasswordModal.isOpen}
              onClose={changePasswordModal.onClose}
            />
          </CardBody>
        </Card>
      )}

      <Card shadow="sm" borderColor="red.100">
        <CardBody>
          <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
            <FiTrash2 /> {t("Danger zone")}
          </Heading>
          <Divider mb={4} borderColor="gray.200" />

          <Text fontSize="sm" color="gray.500" mb={4}>
            ⚠️{" "}
            {t(
              "The account will be permanently deleted 30 days after confirmation of deletion.",
            )}
          </Text>

          <Button
            onClick={deleteModal.onOpen}
            colorScheme="red"
            variant="outline"
            leftIcon={<FiTrash2 />}
            isLoading={isDeleteProfileLoading}
          >
            {t("Delete account")}
          </Button>

          <DeleteModal
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.onClose}
            isLoading={isDeleteProfileLoading}
            onDelete={handleDeleteProfile}
            entity={{ name: "", type: t("profile") }}
          />
        </CardBody>
      </Card>
    </Box>
  );
}
