import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { Category } from "../types/category.types";

export const categoryApi = createApi({
  reducerPath: "category",
  baseQuery: axiosBaseQuery({ baseUrl: "/categories" }),
  tagTypes: ["DefaultCategory"],
  endpoints: (builder) => ({
    getDefaultCategory: builder.query<Category, string>({
      query: (id: string) => ({ url: `/default/${id}`, method: "GET" }),
      providesTags: ["DefaultCategory"],
    }),
  }),
});

export const { useGetDefaultCategoryQuery } = categoryApi;
