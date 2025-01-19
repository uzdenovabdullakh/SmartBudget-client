import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { CreateUnlinkedAccountDto } from "../validation/account.schema";
import { Account } from "../types/account.types";
import { PaginationParams } from "../types/types";

export const accountApi = createApi({
  reducerPath: "account",
  baseQuery: axiosBaseQuery({ baseUrl: "/accounts" }),
  endpoints: (builder) => ({
    getAccounts: builder.query<Account[], { id: string } & PaginationParams>({
      query: ({ id, order, page, pageSize }) => {
        const params = new URLSearchParams();
        if (order) params.append("order", order);
        if (page) params.append("page", page.toString());
        if (pageSize) params.append("pageSize", pageSize.toString());

        return {
          url: `/list/${id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    createUnlinkedAccount: builder.mutation<void, CreateUnlinkedAccountDto>({
      query: (data: CreateUnlinkedAccountDto) => ({
        url: "/unlinked-account",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useCreateUnlinkedAccountMutation, useLazyGetAccountsQuery } =
  accountApi;
