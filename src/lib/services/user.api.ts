import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { UserDetails } from "../types/user.types";

export const usersApi = createApi({
  reducerPath: "users",
  baseQuery: axiosBaseQuery({ baseUrl: "/users" }),
  endpoints: (builder) => ({
    getUser: builder.query<UserDetails, void>({
      query: () => ({ url: "/", method: "GET" }),
    }),
  }),
});

export const { useLazyGetUserQuery } = usersApi;
