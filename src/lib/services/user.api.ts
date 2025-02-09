import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { UserDetails } from "../types/user.types";
import { ResponseWithoutData } from "../types/types";
import { UpdateUserDto } from "../validation/user.schema";

export const usersApi = createApi({
  reducerPath: "users",
  baseQuery: axiosBaseQuery({ baseUrl: "/users" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query<UserDetails, void>({
      query: () => ({ url: "/", method: "GET" }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<ResponseWithoutData, UpdateUserDto>({
      query: (data: UpdateUserDto) => ({ url: "/", method: "PATCH", data }),
      invalidatesTags: ["User"],
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
