import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { AnswerToBriefDto } from "../validation/brief.schema";

export const briefApi = createApi({
  reducerPath: "brief",
  baseQuery: axiosBaseQuery({ baseUrl: "/brief" }),
  endpoints: (builder) => ({
    answerToBrief: builder.mutation<void, AnswerToBriefDto>({
      query: (data: AnswerToBriefDto) => ({
        url: "/",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useAnswerToBriefMutation } = briefApi;
