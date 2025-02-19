import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { Category } from "../types/category.types";
import { ResponseWithoutData } from "../types/types";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  AssigningChangeDto,
  MoveAvaliableDto,
  ReorderCategoriesDto,
} from "../validation/category.schema";

export const categoryApi = createApi({
  reducerPath: "category",
  baseQuery: axiosBaseQuery({ baseUrl: "/categories" }),
  tagTypes: ["DefaultCategory"],
  endpoints: (builder) => ({
    getDefaultCategory: builder.query<Category, string>({
      query: (id: string) => ({ url: `/default/${id}`, method: "GET" }),
      providesTags: ["DefaultCategory"],
    }),
    removeCategory: builder.mutation<ResponseWithoutData, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    createCategory: builder.mutation<ResponseWithoutData, CreateCategoryDto>({
      query: (data: CreateCategoryDto) => ({
        url: "/",
        method: "POST",
        data,
      }),
    }),
    updateCategory: builder.mutation<
      ResponseWithoutData,
      { id: string } & UpdateCategoryDto
    >({
      query: ({ id, ...data }: UpdateCategoryDto & { id: string }) => ({
        url: `/${id}`,
        method: "PATCH",
        data,
      }),
    }),
    assignChange: builder.mutation<
      ResponseWithoutData,
      { id: string } & AssigningChangeDto
    >({
      query: ({ id, ...data }: AssigningChangeDto & { id: string }) => ({
        url: `/assign/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["DefaultCategory"],
    }),
    moveAvailable: builder.mutation<ResponseWithoutData, MoveAvaliableDto>({
      query: (data: MoveAvaliableDto) => ({
        url: "/move",
        method: "PUT",
        data,
      }),
    }),
    reorderCategories: builder.mutation<void, ReorderCategoriesDto>({
      query: (data: ReorderCategoriesDto) => ({
        url: "/reorder",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useGetDefaultCategoryQuery,
  useUpdateCategoryMutation,
  useAssignChangeMutation,
  useCreateCategoryMutation,
  useMoveAvailableMutation,
  useRemoveCategoryMutation,
  useReorderCategoriesMutation,
} = categoryApi;
