import { Flex, Button, Heading, HStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  return (
    <Flex
      as="header"
      justifyContent="space-between"
      alignItems="center"
      p={5}
      paddingLeft="5rem"
      paddingRight="5rem"
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
      <HStack spacing={4}>
        <Button
          variant="outline"
          color="neutrals.buttermilk"
          _hover={{
            color: "firefly.firefly300",
          }}
          onClick={() => router.push("auth/signin")}
        >
          Log In
        </Button>
        <Button
          variant="callToActionButton"
          onClick={() => router.push("/auth/signup")}
        >
          Sign Up Now
        </Button>
      </HStack>
    </Flex>
  );
};

export default Header;
