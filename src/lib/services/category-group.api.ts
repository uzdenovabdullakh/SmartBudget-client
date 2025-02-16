import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { CategoryGroup } from "../types/category.types";

export const categoryGroupApi = createApi({
  reducerPath: "categoryGroup",
  baseQuery: axiosBaseQuery({ baseUrl: "/category-groups" }),
  endpoints: (builder) => ({
    getCategoryGroup: builder.query<CategoryGroup[], string>({
      query: (id: string) => ({ url: `/${id}`, method: "GET" }),
    }),
  }),
});

export const { useLazyGetCategoryGroupQuery } = categoryGroupApi;
