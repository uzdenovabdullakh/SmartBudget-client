import { VStack, Text, Box } from "@chakra-ui/react";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

type MessageListProps = {
  messages: Message[];
};

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <VStack align="stretch" spacing={4} overflowY="auto" maxHeight="300px">
      {messages.map((message) => (
        <Box
          key={message.id}
          alignSelf={message.isUser ? "flex-end" : "flex-start"}
          bg={message.isUser ? "yellow" : "gray.100"}
          color={message.isUser ? "neutrals.midnight" : "black"}
          px={4}
          py={2}
          borderRadius="lg"
          maxWidth="80%"
        >
          <Text fontSize="sm">{message.text}</Text>
        </Box>
      ))}
    </VStack>
  );
};
