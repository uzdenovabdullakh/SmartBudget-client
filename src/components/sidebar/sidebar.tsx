import { Flex, Image, Box, Text, useDisclosure } from "@chakra-ui/react";

export const Sidebar = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Flex
      direction="column"
      width={isOpen ? "180px" : "80px"}
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
        boxSize={isOpen ? "70px" : "50px"}
        mb={2}
        borderRadius={8}
        cursor="pointer"
        onClick={onToggle}
        transition="box-size 0.3s"
      />
      {isOpen && (
        <Box mt={4}>
          <Text fontSize="md" fontWeight="bold">
            Expanded
          </Text>
        </Box>
      )}
    </Flex>
  );
};
