import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { ResponseWithoutData } from "../types/types";
import {
  CreateAutoReplenishmentDto,
  UpdateAutoReplenishmentDto,
} from "../validation/auto-replenishment.schema";

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
    }),
    deactivateAutoReplenishment: builder.mutation<ResponseWithoutData, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateAutoReplenishmentMutation,
  useUpdateAutoReplenishmentMutation,
  useDeactivateAutoReplenishmentMutation,
} = autoReplenishmentApi;
