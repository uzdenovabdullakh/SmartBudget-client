import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { Budget } from "../types/budget.types";
import { CreateBudgetDto } from "../validation/budget.schema";
import { MutationResponse } from "../types/types";

export const budgetsApi = createApi({
  reducerPath: "budget",
  baseQuery: axiosBaseQuery({ baseUrl: "/budgets" }),
  endpoints: (builder) => ({
    getBudgets: builder.query<Budget[], void>({
      query: () => ({ url: "/", method: "GET" }),
    }),
    createBudget: builder.mutation<MutationResponse<Budget>, CreateBudgetDto>({
      query: (data: CreateBudgetDto) => ({
        url: "/",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useLazyGetBudgetsQuery, useCreateBudgetMutation } = budgetsApi;
