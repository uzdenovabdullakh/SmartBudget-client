import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.OFD_API_URL;
const token = process.env.OFD_TOKEN || "";

export const checkApi = createApi({
  reducerPath: "checkApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/api/v1/check/get` }),
  endpoints: (builder) => ({
    getCheckByQr: builder.mutation({
      query: (qrraw: string) => ({
        url: "",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          qrraw,
          token,
        }).toString(),
      }),
    }),
    uploadCheckByFile: builder.mutation({
      query: (file: File) => {
        const formData = new FormData();
        formData.append("qrfile", file);
        formData.append("token", token);
        return {
          url: "",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useGetCheckByQrMutation, useUploadCheckByFileMutation } =
  checkApi;
