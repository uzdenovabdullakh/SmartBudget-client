import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { ResponseWithoutData } from "../types/types";
import { CreateGoalDto, UpdateGoalDto } from "../validation/goal.schema";
import { Goal, GoalWithSavings } from "../types/goal.types";
import { GetGoalFilter } from "../constants/enums";

export const goalApi = createApi({
  reducerPath: "goals",
  baseQuery: axiosBaseQuery({ baseUrl: "/goals" }),
  tagTypes: ["goals", "goal"],
  endpoints: (builder) => ({
    getGoals: builder.query<Goal[], { id: string; filter?: GetGoalFilter }>({
      query: ({ id, filter }) => {
        const params = new URLSearchParams();
        if (filter) params.append("filter", filter);

        return { url: `/all/${id}?${params.toString()}`, method: "GET" };
      },
      providesTags: ["goals"],
    }),
    getGoal: builder.query<GoalWithSavings, string>({
      query: (id: string) => ({ url: `/${id}`, method: "GET" }),
      providesTags: ["goal"],
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
      invalidatesTags: ["goals", "goal"],
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
  useGetGoalQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useRemoveGoalMutation,
} = goalApi;
