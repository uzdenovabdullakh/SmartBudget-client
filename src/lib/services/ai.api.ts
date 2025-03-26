import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { ResponseWithoutData } from "../types/types";
import {
  AutoCategorizeDto,
  ProvideFinancialAdviceDto,
} from "../validation/ai.schema";
import { ProvideFinancialAdviceAnswer } from "../types/ai.types";

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
  }),
});

export const {
  useCategorizeTransactionsMutation,
  useAutoCategorizeTransactionsMutation,
  useProvideFinancialAdviceMutation,
} = AIApi;
