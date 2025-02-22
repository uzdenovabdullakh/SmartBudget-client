import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { PaginationParams, ResponseWithoutData } from "../types/types";
import {
  CreateTransactionDto,
  GetTransactionsQuery,
  UpdateTransactionDto,
} from "../validation/transaction.schema";
import { ListTransactions } from "../types/transaction.types";

export const transactionsApi = createApi({
  reducerPath: "transactions",
  baseQuery: axiosBaseQuery({ baseUrl: "/transactions" }),
  tagTypes: ["Transactions"],
  endpoints: (builder) => ({
    getTransactions: builder.query<
      ListTransactions,
      { id: string } & GetTransactionsQuery & PaginationParams
    >({
      query: (query) => {
        const {
          id,
          startDate,
          endDate,
          orderBy,
          order,
          page,
          pageSize,
          search,
        } = query;

        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (pageSize) params.append("pageSize", pageSize.toString());
        if (search) params.append("search", search);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (orderBy) params.append("orderBy", orderBy);
        if (order) params.append("order", order);

        return {
          url: `/${id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Transactions"],
    }),
    deleteTransactions: builder.mutation<ResponseWithoutData, string[]>({
      query: (data: string[]) => ({ url: "/", method: "DELETE", data }),
      invalidatesTags: ["Transactions"],
    }),
    updateTransaction: builder.mutation<
      ResponseWithoutData,
      { id: string } & UpdateTransactionDto
    >({
      query: ({ id, ...data }: UpdateTransactionDto & { id: string }) => ({
        url: `/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Transactions"],
    }),
    createTransaction: builder.mutation<
      ResponseWithoutData,
      CreateTransactionDto
    >({
      query: (data: CreateTransactionDto) => ({
        url: "/",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Transactions"],
    }),
    importBankStatement: builder.mutation<
      ResponseWithoutData,
      { id: string; file: File }
    >({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/imports/bank-statements/${id}`,
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["Transactions"],
    }),
  }),
});

export const {
  useCreateTransactionMutation,
  useDeleteTransactionsMutation,
  useGetTransactionsQuery,
  useUpdateTransactionMutation,
  useImportBankStatementMutation,
} = transactionsApi;
