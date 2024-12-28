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
