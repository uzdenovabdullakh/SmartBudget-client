import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { CategoryGroup } from "../types/category.types";
import { ResponseWithoutData } from "../types/types";
import {
  CreateCategoryGroupDto,
  UpdateCategoryGroupDto,
} from "../validation/category-group.schema";

export const categoryGroupApi = createApi({
  reducerPath: "categoryGroup",
  baseQuery: axiosBaseQuery({ baseUrl: "/category-groups" }),
  endpoints: (builder) => ({
    getCategoryGroup: builder.query<CategoryGroup[], string>({
      query: (id: string) => ({ url: `/${id}`, method: "GET" }),
    }),
    removeCategoryGroup: builder.mutation<ResponseWithoutData, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    createCategoryGroup: builder.mutation<
      ResponseWithoutData,
      CreateCategoryGroupDto
    >({
      query: (data: CreateCategoryGroupDto) => ({
        url: "/",
        method: "POST",
        data,
      }),
    }),
    updateCategoryGroup: builder.mutation<
      ResponseWithoutData,
      { id: string } & UpdateCategoryGroupDto
    >({
      query: ({ id, ...data }: UpdateCategoryGroupDto & { id: string }) => ({
        url: `/${id}`,
        method: "PATCH",
        data,
      }),
    }),
  }),
});

export const {
  useLazyGetCategoryGroupQuery,
  useCreateCategoryGroupMutation,
  useRemoveCategoryGroupMutation,
  useUpdateCategoryGroupMutation,
} = categoryGroupApi;
