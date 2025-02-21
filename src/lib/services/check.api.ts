import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.OFD_API_URL;

export const checkApi = createApi({
  reducerPath: "checkApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/api/v1/` }),
  endpoints: (builder) => ({
    getCheckByQr: builder.mutation({
      query: (qrraw: string) => ({
        url: "check/get",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          qrraw,
          token: process.env.OFD_TOKEN || "",
        }).toString(),
      }),
    }),
  }),
});

export const { useGetCheckByQrMutation } = checkApi;
