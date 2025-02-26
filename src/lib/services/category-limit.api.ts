import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { ResponseWithoutData } from "../types/types";
import {
  CategoryLimitDto,
  UpdateCategoryLimitDto,
} from "../validation/category-limit.schema";
import { CategoryLimit } from "../types/category-limit.types";

export const categoryLimitApi = createApi({
  reducerPath: "category-limit",
  baseQuery: axiosBaseQuery({ baseUrl: "/category-limit" }),
  tagTypes: ["Limit"],
  endpoints: (builder) => ({
    getCategoryLimit: builder.query<CategoryLimit, string>({
      query: (id: string) => ({ url: `/${id}`, method: "GET" }),
      providesTags: ["Limit"],
    }),
    createCategoryLimit: builder.mutation<
      ResponseWithoutData,
      CategoryLimitDto & { id: string }
    >({
      query: ({ id, ...data }: CategoryLimitDto & { id: string }) => ({
        url: `/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Limit"],
    }),
    updateCategoryLimit: builder.mutation<
      ResponseWithoutData,
      UpdateCategoryLimitDto & { id: string }
    >({
      query: ({ id, ...data }: UpdateCategoryLimitDto & { id: string }) => ({
        url: `/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["Limit"],
    }),
    deleteCategoryLimit: builder.mutation<ResponseWithoutData, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Limit"],
    }),
  }),
});

export const {
  useCreateCategoryLimitMutation,
  useDeleteCategoryLimitMutation,
  useUpdateCategoryLimitMutation,
  useGetCategoryLimitQuery,
} = categoryLimitApi;
