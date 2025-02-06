import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { UserDetails } from "../types/user.types";
import { MutationResponse, ResponseWithoutData } from "../types/types";
import { UpdateUserDto } from "../validation/user.schema";

export const usersApi = createApi({
  reducerPath: "users",
  baseQuery: axiosBaseQuery({ baseUrl: "/users" }),
  endpoints: (builder) => ({
    getUser: builder.query<UserDetails, void>({
      query: () => ({ url: "/", method: "GET" }),
    }),
    updateUser: builder.mutation<MutationResponse<UserDetails>, UpdateUserDto>({
      query: (data: UpdateUserDto) => ({ url: "/", method: "PATCH", data }),
    }),
    deleteProfile: builder.mutation<ResponseWithoutData, void>({
      query: () => ({ url: "/", method: "DELETE" }),
    }),
  }),
});

export const {
  useLazyGetUserQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteProfileMutation,
} = usersApi;
