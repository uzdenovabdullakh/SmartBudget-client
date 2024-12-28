import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { LoginDto } from "../validation/login.schema";
import { RegisterDto } from "../validation/register.schema";
import { ResendEmailDto } from "../validation/resend-email.schema";
import { ConfirmSignUpDto } from "../validation/confirm-signup.schema";
import {
  LoginResponse,
  RegisterResponse,
  ResponseWithoutData,
} from "../types/auth.types";
import { ResetPasswordRequestDto } from "../validation/reset-password-request.schema";
import { ResetPasswordDto } from "../validation/reset-password.schema";

export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: axiosBaseQuery({ baseUrl: "/auth" }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginDto>({
      query: (data: LoginDto) => ({
        url: "/login",
        method: "POST",
        data,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterDto>({
      query: (data: RegisterDto) => ({
        url: "/signup",
        method: "POST",
        data,
      }),
    }),
    confirmRegister: builder.mutation<
      ResponseWithoutData,
      Omit<ConfirmSignUpDto, "confirmPassword">
    >({
      query: (data: Omit<ConfirmSignUpDto, "confirmPassword">) => ({
        url: "/confirm",
        method: "POST",
        data,
      }),
    }),
    resendEmail: builder.mutation<ResponseWithoutData, ResendEmailDto>({
      query: (data: ResendEmailDto) => ({
        url: "/resend-email",
        method: "POST",
        data,
      }),
    }),
    resetPasswordRequest: builder.mutation<
      ResponseWithoutData,
      ResetPasswordRequestDto
    >({
      query: (data: ResetPasswordRequestDto) => ({
        url: "/reset-password-request",
        method: "POST",
        data,
      }),
    }),
    resetPassword: builder.mutation<
      ResponseWithoutData,
      Omit<ResetPasswordDto, "confirmNewPassword">
    >({
      query: (data: Omit<ResetPasswordDto, "confirmNewPassword">) => ({
        url: "/reset-password",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useResendEmailMutation,
  useConfirmRegisterMutation,
  useResetPasswordMutation,
  useResetPasswordRequestMutation,
} = authApi;
