import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { AnalyticResponseDto, GetAnalyticQuery } from "../types/analytic.types";

export const analyticApi = createApi({
  reducerPath: "analytic",
  baseQuery: axiosBaseQuery({ baseUrl: "/analytics" }),
  endpoints: (builder) => ({
    getExpensesByCategory: builder.query<AnalyticResponseDto, GetAnalyticQuery>(
      {
        query: ({ budgetId, startDate, endDate }: GetAnalyticQuery) => {
          const params = new URLSearchParams();
          if (startDate) params.append("startDate", startDate);
          if (endDate) params.append("endDate", endDate);

          return {
            url: `/expenses/${budgetId}/?${params.toString()}`,
            method: "GET",
          };
        },
      },
    ),
    getIncomesByCategory: builder.query<AnalyticResponseDto, GetAnalyticQuery>({
      query: ({ budgetId, startDate, endDate }: GetAnalyticQuery) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        return {
          url: `/incomes/${budgetId}/?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useLazyGetExpensesByCategoryQuery,
  useLazyGetIncomesByCategoryQuery,
} = analyticApi;
