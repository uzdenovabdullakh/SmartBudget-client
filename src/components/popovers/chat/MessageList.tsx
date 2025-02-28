import { Message } from "@/lib/types/types";
import { VStack, Text, Box } from "@chakra-ui/react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslation } from "react-i18next";
import { useRef, useEffect, useCallback } from "react";

type MessageListProps = {
  messages: Message[];
  isThinking: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
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

export const MessageList = ({
  messages,
  isThinking,
  onLoadMore,
  hasMore,
}: MessageListProps) => {
  const { t } = useTranslation();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevMessageCount = useRef(messages.length);

  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      if (scrollTop === 0 && hasMore) {
        onLoadMore();
      }
    }
  }, [hasMore, onLoadMore]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
    return undefined;
  }, [handleScroll]);

  useEffect(() => {
    const container = chatContainerRef.current;

    if (!container) return;

    const isPagination =
      messages.length > prevMessageCount.current && container.scrollTop === 0;

    if (isPagination) {
      const prevScrollHeight = container.scrollHeight;

      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight - prevScrollHeight;
      });
    } else {
      lastMessageRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    prevMessageCount.current = messages.length;
  }, [messages]);

  return (
    <VStack
      align="stretch"
      spacing={4}
      overflowY="auto"
      maxHeight="300px"
      ref={chatContainerRef}
    >
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
