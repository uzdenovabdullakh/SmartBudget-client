import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosError, AxiosRequestConfig } from "axios";
import axiosInstance from "./axiosInstance";
import { showToast } from "./utils/toast";

interface ErrorResponse {
  message?: string;
}

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" },
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: any;
      params?: any;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<ErrorResponse>;
      console.log(err);
      const errorMessage =
        err.response?.data?.message || "An unknown error occurred";

      showToast({
        title: "Request Failed",
        description: errorMessage,
        status: "error",
      });

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || errorMessage,
        },
      };
    }
  };
