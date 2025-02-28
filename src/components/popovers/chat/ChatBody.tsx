import { Button, VStack, Text, Box, Spinner } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback } from "react";
import {
  useLazyGetConversationHistoryQuery,
  useProvideFinancialAdviceMutation,
} from "@/lib/services/ai.api";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { Message } from "@/lib/types/types";
import { NotFoundDataAnimation } from "@/components/ui/Animations";
import { MessageList } from "./MessageList";

export const ChatBody = () => {
  const { budget } = useBudgetContext();
  const { t } = useTranslation();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const [provideFinancialAdvice] = useProvideFinancialAdviceMutation();
  const [getConversationHistory, { isLoading }] =
    useLazyGetConversationHistoryQuery();

  const handleQuestionClick = useCallback(
    async (question: string) => {
      const userMessage = {
        id: `user-${Date.now().toString()}`,
        text: question,
        isUser: true,
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsThinking(true);

      try {
        if (budget?.id) {
          const response = await provideFinancialAdvice({
            message: question,
            budgetId: budget?.id,
          }).unwrap();

          const assistantMessage = {
            id: response.id,
            text: response.content,
            isUser: false,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsThinking(false);
      }
    },
    [budget?.id, provideFinancialAdvice],
  );

  const quickQuestions = [
    t("Forecast my monthly expenses based on spending history"),
    t("Provide recommendations to optimize my budget"),
    t("Give me advice to reduce unnecessary expenses"),
    t("Help me allocate my income more effectively"),
  ];

  let chatContent;
  if (isLoading) {
    chatContent = (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Spinner size="xl" />
      </Box>
    );
  } else if (messages.length === 0) {
    chatContent = (
      <NotFoundDataAnimation width={250} height={250} loop={false} />
    );
  } else {
    chatContent = <MessageList messages={messages} isThinking={isThinking} />;
  }

  useEffect(() => {
    const fetchConversationHistory = async () => {
      if (budget?.id) {
        const conversationHistory = await getConversationHistory({
          id: budget.id,
        }).unwrap();

        const loadedMessages = conversationHistory.map((msg) => ({
          id: msg.id,
          text: msg.content,
          isUser: msg.role === "user",
        }));
        setMessages(loadedMessages);
      }
    };

    fetchConversationHistory();
  }, [budget?.id, getConversationHistory]);

  return (
    <VStack align="stretch" spacing={4} height="100%">
      <Box flex="1" overflowY="auto">
        {chatContent}
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
                disabled={isThinking}
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
