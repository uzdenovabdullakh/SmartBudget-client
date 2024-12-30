export type RegisterResponse = {
  email: string;
  login: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type ResponseWithoutData = {
  message: string;
};

export enum TokenType {
  ACTIVATE_ACCOUNT = "activate_account",
  RESET_PASSWORD = "reset_password",
  RESTORE_ACCOUNT = "restore_account",
}
