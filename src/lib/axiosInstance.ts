import axios, { AxiosResponse } from "axios";
import { useLocalStorage } from "./hooks/useLocalStorage";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Access-Control-Allow-Origin": baseURL,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { getLocalStorageItem } = useLocalStorage();
    const token = getLocalStorageItem("authAccessToken");

    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const { getLocalStorageItem, setLocalStorageItem, clearLocalStorage } =
      useLocalStorage();
    const originalRequest = error.config;

    const unauthorized =
      error.response.data.statusCode === 401 &&
      error.response.data.message === "Invalid or missing token";

    if (unauthorized && !originalRequest.isRetry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest.isRetry = true;

        try {
          const refreshTokenFromStorage =
            getLocalStorageItem("authRefreshToken");

          const {
            data: { refreshToken, accessToken },
          } = await axios.post(`${baseURL}/auth/refresh-token`, {
            refreshToken: JSON.parse(refreshTokenFromStorage),
          });

          setLocalStorageItem("authRefreshToken", refreshToken);
          setLocalStorageItem("authAccessToken", accessToken);

          axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          isRefreshing = false;
          onRefreshed(accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return await axiosInstance(originalRequest);
        } catch (err) {
          isRefreshing = false;

          clearLocalStorage();
          window.location.assign("/auth/signin");

          return Promise.reject(err);
        }
      } else {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${JSON.parse(token)}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
