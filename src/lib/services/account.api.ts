import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { CreateUnlinkedAccountDto } from "../validation/account.schema";
import { Account, AccountsResult } from "../types/account.types";
import { PaginationParams, ResponseWithoutData } from "../types/types";

export const accountApi = createApi({
  reducerPath: "account",
  baseQuery: axiosBaseQuery({ baseUrl: "/accounts" }),
  tagTypes: ["Accounts"],
  endpoints: (builder) => ({
    getAccounts: builder.query<
      AccountsResult,
      { id: string } & PaginationParams
    >({
      query: ({ id, order, page, pageSize, search }) => {
        const params = new URLSearchParams();
        if (order) params.append("order", order);
        if (page) params.append("page", page.toString());
        if (pageSize) params.append("pageSize", pageSize.toString());
        if (search) params.append("search", search);

        return {
          url: `/list/${id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Accounts"],
    }),
    createUnlinkedAccount: builder.mutation<void, CreateUnlinkedAccountDto>({
      query: (data: CreateUnlinkedAccountDto) => ({
        url: "/unlinked-account",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Accounts"],
    }),
    getAccount: builder.query<Account, string>({
      query: (id: string) => ({ url: `/${id}`, method: "GET" }),
    }),
    deleteAccount: builder.mutation<ResponseWithoutData, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useCreateUnlinkedAccountMutation,
  useGetAccountQuery,
  useGetAccountsQuery,
  useDeleteAccountMutation,
} = accountApi;
