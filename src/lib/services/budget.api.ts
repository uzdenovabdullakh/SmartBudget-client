import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { Budget } from "../types/budget.types";

export const budgetsApi = createApi({
  reducerPath: "budget",
  baseQuery: axiosBaseQuery({ baseUrl: "/budgets" }),
  endpoints: (builder) => ({
    getBudgets: builder.query<Budget[], void>({
      query: () => ({ url: "/", method: "GET" }),
    }),
  }),
});

export const { useGetBudgetsQuery } = budgetsApi;
