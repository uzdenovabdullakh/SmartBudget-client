import { useLogoutMutation } from "@/lib/services/auth.api";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { TokenSchema } from "@/lib/validation/logout.schema";
import { useRouter } from "next/navigation";

export const useLogoutHandler = () => {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const { getLocalStorageItem, clearLocalStorage } = useLocalStorage();

  return async () => {
    try {
      const refreshToken = getLocalStorageItem("authRefreshToken");
      TokenSchema.parse({ refreshToken });

      await logout({ refreshToken });
      clearLocalStorage();

      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
};
