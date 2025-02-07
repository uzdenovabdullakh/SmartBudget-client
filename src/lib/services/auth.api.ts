import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { LoginDto } from "../validation/login.schema";
import { RegisterDto } from "../validation/register.schema";
import { ResendEmailDto } from "../validation/resend-email.schema";
import { ConfirmSignUpDto } from "../validation/confirm-signup.schema";
import { ResponseWithoutData } from "../types/types";
import { LoginResponse, RegisterResponse } from "../types/auth.types";
import { ResetPasswordRequestDto } from "../validation/reset-password-request.schema";
import { ResetPasswordDto } from "../validation/reset-password.schema";
import { RestoreAccountRequestDto } from "../validation/restore-account-request.schema";
import { RestoreAccountDto } from "../validation/restore-account.schema";
import { TokenDto } from "../validation/logout.schema";
import { OauthDto } from "../validation/oauth.schema";
import { ChangePasswordDto } from "../validation/change-password.schema";

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
    register: builder.mutation<
      RegisterResponse,
      Omit<RegisterDto, "agreement">
    >({
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
    restoreAccountRequest: builder.mutation<
      ResponseWithoutData,
      RestoreAccountRequestDto
    >({
      query: (data: RestoreAccountRequestDto) => ({
        url: "/restore-request",
        method: "POST",
        data,
      }),
    }),
    restoreAccount: builder.mutation<ResponseWithoutData, RestoreAccountDto>({
      query: (data: RestoreAccountDto) => ({
        url: "/restore-account",
        method: "POST",
        data,
      }),
    }),
    logout: builder.mutation<void, TokenDto>({
      query: (data: TokenDto) => ({
        url: "/logout",
        method: "POST",
        data,
      }),
    }),
    oauth: builder.mutation<LoginResponse, OauthDto>({
      query: (data: OauthDto) => ({
        url: "/oauth",
        method: "POST",
        data,
      }),
    }),
    changePassword: builder.mutation<
      ResponseWithoutData,
      Omit<ChangePasswordDto, "confirmNewPassword">
    >({
      query: (data: Omit<ChangePasswordDto, "confirmNewPassword">) => ({
        url: "/change-password",
        method: "PATCH",
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
  useRestoreAccountRequestMutation,
  useRestoreAccountMutation,
  useLogoutMutation,
  useOauthMutation,
  useChangePasswordMutation,
} = authApi;
