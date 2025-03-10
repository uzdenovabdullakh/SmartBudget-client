import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { ResponseWithoutData } from "../types/types";
import {
  CreateAutoReplenishmentDto,
  UpdateAutoReplenishmentDto,
} from "../validation/auto-replenishment.schema";
import { goalApi } from "./goal.api";

export const autoReplenishmentApi = createApi({
  reducerPath: "auto-replenishment",
  baseQuery: axiosBaseQuery({ baseUrl: "/auto-replenishments" }),
  endpoints: (builder) => ({
    createAutoReplenishment: builder.mutation<
      ResponseWithoutData,
      CreateAutoReplenishmentDto
    >({
      query: (data: CreateAutoReplenishmentDto & { id: string }) => ({
        url: "/",
        method: "POST",
        data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(goalApi.util.invalidateTags(["goals"]));
      },
    }),
    updateAutoReplenishment: builder.mutation<
      ResponseWithoutData,
      UpdateAutoReplenishmentDto & { id: string }
    >({
      query: ({
        id,
        ...data
      }: UpdateAutoReplenishmentDto & { id: string }) => ({
        url: `/${id}`,
        method: "PATCH",
        data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(goalApi.util.invalidateTags(["goals"]));
      },
    }),
    deactivateAutoReplenishment: builder.mutation<ResponseWithoutData, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(goalApi.util.invalidateTags(["goals"]));
      },
    }),
  }),
});

export const {
  useCreateAutoReplenishmentMutation,
  useUpdateAutoReplenishmentMutation,
  useDeactivateAutoReplenishmentMutation,
} = autoReplenishmentApi;
