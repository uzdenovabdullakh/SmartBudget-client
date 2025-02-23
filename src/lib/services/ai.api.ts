import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { ResponseWithoutData } from "../types/types";
import { AutoCategorizeDto } from "../validation/ai.schema";

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
  }),
});

export const {
  useCategorizeTransactionsMutation,
  useAutoCategorizeTransactionsMutation,
} = AIApi;
