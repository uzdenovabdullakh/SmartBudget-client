import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { CreateUnlinkedAccountDto } from "../validation/account.schema";

export const accountApi = createApi({
  reducerPath: "account",
  baseQuery: axiosBaseQuery({ baseUrl: "/accounts" }),
  endpoints: (builder) => ({
    createUnlinkedAccount: builder.mutation<void, CreateUnlinkedAccountDto>({
      query: (data: CreateUnlinkedAccountDto) => ({
        url: "/unlinked-account",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useCreateUnlinkedAccountMutation } = accountApi;
