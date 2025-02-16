import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { BaseBudget, ExtendedBudget } from "../types/budget.types";
import { CreateBudgetDto, UpdateBudgetDto } from "../validation/budget.schema";
import { ResponseWithoutData } from "../types/types";

export const budgetsApi = createApi({
  reducerPath: "budget",
  baseQuery: axiosBaseQuery({ baseUrl: "/budgets" }),
  tagTypes: ["Budgets", "Budget"],
  endpoints: (builder) => ({
    getBudgets: builder.query<BaseBudget[], void>({
      query: () => ({ url: "/", method: "GET" }),
      providesTags: ["Budgets"],
    }),
    getBudgetInfo: builder.query<ExtendedBudget, string>({
      query: (id: string) => ({ url: `/${id}`, method: "GET" }),
      providesTags: ["Budget"],
    }),
    createBudget: builder.mutation<ResponseWithoutData, CreateBudgetDto>({
      query: (data: CreateBudgetDto) => ({
        url: "/",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Budgets"],
    }),
    updateBudget: builder.mutation<
      ResponseWithoutData,
      UpdateBudgetDto & { id: string }
    >({
      query: ({ id, ...data }: UpdateBudgetDto & { id: string }) => ({
        url: `/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Budgets", "Budget"],
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
  useLazyGetBudgetInfoQuery,
  useGetBudgetInfoQuery,
  useGetBudgetsQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
} = budgetsApi;
