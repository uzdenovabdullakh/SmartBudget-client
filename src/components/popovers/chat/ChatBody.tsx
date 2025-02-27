import { Button, VStack, Text, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { MessageList } from "./MessageList";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

export const ChatBody = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);

  const quickQuestions = [
    t("Forecast my monthly expenses based on spending history"),
    t("Provide recommendations to optimize my budget"),
    t("Give me advice to reduce unnecessary expenses"),
    t("Help me allocate my income more effectively"),
  ];

  const handleQuestionClick = (question: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: question, isUser: true },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: `Ответ на вопрос: "${question}"`,
          isUser: false,
        },
      ]);
    }, 1000);
  };

  return (
    <VStack align="stretch" spacing={4} height="100%">
      <Box flex="1" overflowY="auto">
        <MessageList messages={messages} />
      </Box>
      <Box>
        <Text fontWeight="bold" mb={2} fontSize="sm">
          {t("Quick Questions")}
        </Text>
        <Box
          maxHeight="150px"
          overflowY="auto"
          borderTop="1px solid"
          borderColor="gray.200"
          pt={2}
        >
          <VStack align="stretch" spacing={2}>
            {quickQuestions.map((question) => (
              <Button
                key={question}
                variant="outline"
                size="md"
                whiteSpace="normal"
                bgColor="gray.200"
                fontWeight="hairline"
                fontSize="14px"
                justifyContent="flex-start"
                textAlign="left"
                onClick={() => handleQuestionClick(question)}
              >
                {question}
              </Button>
            ))}
          </VStack>
        </Box>
      </Box>
    </VStack>
  );
};
