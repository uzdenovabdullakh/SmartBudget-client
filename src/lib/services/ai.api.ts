import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { PaginationParams, ResponseWithoutData } from "../types/types";
import {
  AutoCategorizeDto,
  ProvideFinancialAdviceDto,
} from "../validation/ai.schema";
import {
  ConversationHistory,
  ProvideFinancialAdviceAnswer,
} from "../types/ai.types";

export const AIApi = createApi({
  reducerPath: "ai",
  baseQuery: axiosBaseQuery({ baseUrl: "/ai" }),
  endpoints: (builder) => ({
    categorizeTransactions: builder.mutation<ResponseWithoutData, string[]>({
      query: (data: string[]) => ({
        url: "/categorize",
        method: "POST",
        data,
      }),
    }),
    autoCategorizeTransactions: builder.mutation<
      ResponseWithoutData,
      AutoCategorizeDto
    >({
      query: (data: AutoCategorizeDto) => ({
        url: "/auto-categorize",
        method: "POST",
        data,
      }),
    }),
    provideFinancialAdvice: builder.mutation<
      ProvideFinancialAdviceAnswer,
      ProvideFinancialAdviceDto
    >({
      query: (data: ProvideFinancialAdviceDto) => ({
        url: "/provide-advice",
        method: "POST",
        data,
      }),
    }),
    getConversationHistory: builder.query<
      ConversationHistory[],
      { id: string } & PaginationParams
    >({
      query: ({ id, page, pageSize }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (pageSize) params.append("pageSize", pageSize.toString());

        return {
          url: `/get-conversation/${id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCategorizeTransactionsMutation,
  useAutoCategorizeTransactionsMutation,
  useProvideFinancialAdviceMutation,
  useLazyGetConversationHistoryQuery,
} = AIApi;
