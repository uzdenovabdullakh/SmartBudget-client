import { Message } from "@/lib/types/types";
import { VStack, Text, Box } from "@chakra-ui/react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslation } from "react-i18next";
import { useRef, useEffect } from "react";

type MessageListProps = {
  messages: Message[];
  isThinking: boolean;
};

const MarkdownComponents: Components = {
  ul: ({ children, ...props }) => (
    <Box as="ul" pl={4} {...props}>
      {children}
    </Box>
  ),
  ol: ({ children, ...props }) => (
    <Box as="ol" pl={4} {...props}>
      {children}
    </Box>
  ),
  li: ({ children, ...props }) => (
    <Box as="li" pb={1} {...props}>
      {children}
    </Box>
  ),
};

export const MessageList = ({ messages, isThinking }: MessageListProps) => {
  const { t } = useTranslation();

  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messages]);

  return (
    <VStack align="stretch" spacing={4} overflowY="auto" maxHeight="300px">
      {messages.map((message, index) => (
        <Box
          key={message.id}
          ref={index === messages.length - 1 ? lastMessageRef : null}
          alignSelf={message.isUser ? "flex-end" : "flex-start"}
          bg={message.isUser ? "yellow" : "gray.100"}
          color={message.isUser ? "neutrals.midnight" : "black"}
          px={4}
          py={2}
          borderRadius="lg"
          maxWidth="80%"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={MarkdownComponents}
          >
            {message.text}
          </ReactMarkdown>
        </Box>
      ))}
      {isThinking && (
        <Box
          alignSelf="flex-start"
          bg="gray.100"
          color="black"
          px={4}
          py={2}
          borderRadius="lg"
          maxWidth="80%"
        >
          <Text fontSize="sm">{t("Thinking...")}</Text>
        </Box>
      )}
    </VStack>
  );
};
