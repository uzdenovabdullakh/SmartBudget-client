import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { ResponseWithoutData } from "../types/types";
import { CreateGoalDto, UpdateGoalDto } from "../validation/goal.schema";
import { Goal } from "../types/goal.types";

export const goalApi = createApi({
  reducerPath: "goals",
  baseQuery: axiosBaseQuery({ baseUrl: "/goals" }),
  tagTypes: ["goals"],
  endpoints: (builder) => ({
    getGoals: builder.query<Goal[], string>({
      query: (id: string) => ({ url: `/${id}`, method: "GET" }),
      providesTags: ["goals"],
    }),
    createGoal: builder.mutation<
      ResponseWithoutData,
      { id: string } & CreateGoalDto
    >({
      query: ({ id, ...data }: CreateGoalDto & { id: string }) => ({
        url: `/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["goals"],
    }),
    updateGoal: builder.mutation<
      ResponseWithoutData,
      UpdateGoalDto & { id: string }
    >({
      query: ({ id, ...data }: UpdateGoalDto & { id: string }) => ({
        url: `/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["goals"],
    }),
    removeGoal: builder.mutation<ResponseWithoutData, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["goals"],
    }),
  }),
});

export const {
  useGetGoalsQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useRemoveGoalMutation,
} = goalApi;
