import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./services/auth.api";
import { usersApi } from "./services/user.api";
import { briefApi } from "./services/brief.api";
import { budgetsApi } from "./services/budget.api";
import { accountApi } from "./services/account.api";
import { transactionsApi } from "./services/transaction.api";
import { categoryApi } from "./services/category.api";
import { categoryGroupApi } from "./services/category-group.api";
import { checkApi } from "./services/check.api";
import { analyticApi } from "./services/analytic.api";
import { AIApi } from "./services/ai.api";
import { categoryLimitApi } from "./services/category-limit.api";
import { goalApi } from "./services/goal.api";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [briefApi.reducerPath]: briefApi.reducer,
    [budgetsApi.reducerPath]: budgetsApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [categoryGroupApi.reducerPath]: categoryGroupApi.reducer,
    [checkApi.reducerPath]: checkApi.reducer,
    [analyticApi.reducerPath]: analyticApi.reducer,
    [AIApi.reducerPath]: AIApi.reducer,
    [categoryLimitApi.reducerPath]: categoryLimitApi.reducer,
    [goalApi.reducerPath]: goalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      usersApi.middleware,
      briefApi.middleware,
      budgetsApi.middleware,
      accountApi.middleware,
      transactionsApi.middleware,
      categoryApi.middleware,
      categoryGroupApi.middleware,
      checkApi.middleware,
      analyticApi.middleware,
      AIApi.middleware,
      categoryLimitApi.middleware,
      goalApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
