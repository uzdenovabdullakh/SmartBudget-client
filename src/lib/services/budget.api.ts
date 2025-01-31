import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { Budget } from "../types/budget.types";
import { CreateBudgetDto, UpdateBudgetDto } from "../validation/budget.schema";
import { MutationResponse, ResponseWithoutData } from "../types/types";

export const budgetsApi = createApi({
  reducerPath: "budget",
  baseQuery: axiosBaseQuery({ baseUrl: "/budgets" }),
  tagTypes: ["Budgets"],
  endpoints: (builder) => ({
    getBudgets: builder.query<Budget[], void>({
      query: () => ({ url: "/", method: "GET" }),
      providesTags: ["Budgets"],
    }),
    getBudgetInfo: builder.query<Budget, string>({
      query: (id: string) => ({ url: `/${id}`, method: "GET" }),
    }),
    createBudget: builder.mutation<MutationResponse<Budget>, CreateBudgetDto>({
      query: (data: CreateBudgetDto) => ({
        url: "/",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Budgets"],
    }),
    updateBudget: builder.mutation<
      MutationResponse<Budget>,
      UpdateBudgetDto & { id: string }
    >({
      query: ({ id, ...data }: UpdateBudgetDto & { id: string }) => ({
        url: `/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Budgets"],
    }),
    deleteBudget: builder.mutation<ResponseWithoutData, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Budgets"],
    }),
  }),
});

export const {
  useLazyGetBudgetsQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useLazyGetBudgetInfoQuery,
  useDeleteBudgetMutation,
} = budgetsApi;
