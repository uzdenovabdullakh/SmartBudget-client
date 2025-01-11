import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./services/auth.api";
import { usersApi } from "./services/user.api";
import { briefApi } from "./services/brief.api";
import { budgetsApi } from "./services/budget.api";
import { accountApi } from "./services/account.api";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [briefApi.reducerPath]: briefApi.reducer,
    [budgetsApi.reducerPath]: budgetsApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      usersApi.middleware,
      briefApi.middleware,
      budgetsApi.middleware,
      accountApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
