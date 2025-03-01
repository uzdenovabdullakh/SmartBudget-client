export type ProvideFinancialAdviceAnswer = {
  id: string;
  role: "assistant";
  content: string;
};

export type ConversationHistory = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
