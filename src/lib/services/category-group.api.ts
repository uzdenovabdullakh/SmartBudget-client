import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { CategoryGroup } from "../types/category.types";
import { ResponseWithoutData } from "../types/types";
import {
  CreateCategoryGroupDto,
  GetCategoryGroup,
  ReorderCategoryGroupsDto,
  UpdateCategoryGroupDto,
} from "../validation/category-group.schema";

export const categoryGroupApi = createApi({
  reducerPath: "categoryGroup",
  baseQuery: axiosBaseQuery({ baseUrl: "/category-groups" }),
  endpoints: (builder) => ({
    getCategoryGroup: builder.query<CategoryGroup[], GetCategoryGroup>({
      query: (query) => {
        const { id, defaultCategory, filter } = query;

        const params = new URLSearchParams();
        if (defaultCategory)
          params.append("default", defaultCategory.toString());
        if (filter) {
          params.append("filter", filter.toString());
        }

        return {
          url: `/${id}/?${params.toString()}`,
          method: "GET",
        };
      },
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
    reorderCategoryGroups: builder.mutation<void, ReorderCategoryGroupsDto>({
      query: (data: ReorderCategoryGroupsDto) => ({
        url: "/reorder",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useLazyGetCategoryGroupQuery,
  useGetCategoryGroupQuery,
  useCreateCategoryGroupMutation,
  useRemoveCategoryGroupMutation,
  useUpdateCategoryGroupMutation,
  useReorderCategoryGroupsMutation,
} = categoryGroupApi;
