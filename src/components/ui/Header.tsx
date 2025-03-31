import {
  Flex,
  Button,
  Heading,
  HStack,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRef } from "react";

export const Header = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  const renderDesktopMenu = () => (
    <HStack spacing={4}>
      <Button
        variant="outline"
        color="neutrals.buttermilk"
        _hover={{
          color: "firefly.firefly300",
        }}
        onClick={() => router.push("/auth/signin")}
      >
        {t("Log In")}
      </Button>
      <Button
        variant="callToActionButton"
        onClick={() => router.push("/auth/signup")}
      >
        {t("Sign Up Now")}
      </Button>
    </HStack>
  );

  const renderMobileMenu = () => (
    <>
      <IconButton
        ref={btnRef}
        aria-label="Открыть меню"
        icon={<HamburgerIcon />}
        variant="outline"
        color="neutrals.buttermilk"
        _hover={{
          color: "firefly.firefly300",
        }}
        onClick={onOpen}
      />

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg="neutrals.midnight">
          <DrawerBody>
            <VStack spacing={4} mt={8} align="stretch">
              <Button
                variant="outline"
                color="neutrals.buttermilk"
                _hover={{
                  color: "firefly.firefly300",
                }}
                onClick={() => {
                  router.push("/auth/signin");
                  onClose();
                }}
                size="lg"
              >
                {t("Log In")}
              </Button>
              <Button
                variant="callToActionButton"
                onClick={() => {
                  router.push("/auth/signup");
                  onClose();
                }}
                size="lg"
              >
                {t("Sign Up Now")}
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );

  return (
    <Flex
      as="header"
      justifyContent="space-between"
      alignItems="center"
      p={5}
      px={{ base: 4, lg: "5rem" }}
      bgColor="neutrals.midnight"
      fontFamily="figtree"
      position="fixed"
      top="0"
      width="100%"
      zIndex="1000"
    >
      <Link href="/">
        <Heading as="h1" fontSize={{ base: "xl", lg: "2xl" }}>
          Smart Budget.
        </Heading>
      </Link>

      {isMobile ? renderMobileMenu() : renderDesktopMenu()}
    </Flex>
  );
};
