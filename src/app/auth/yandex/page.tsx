"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOauthMutation } from "@/lib/services/auth.api";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { OauthDto, OauthSchema } from "@/lib/validation/oauth.schema";

export default function YandexAuth() {
  const { data: session } = useSession();
  const router = useRouter();
  const { setLocalStorageItem } = useLocalStorage();

  const [oauth] = useOauthMutation();

  useEffect(() => {
    const handleOauth = async (data: OauthDto) => {
      try {
        OauthSchema.parse(data);

        const { accessToken, refreshToken } = await oauth(data).unwrap();

        setLocalStorageItem("authAccessToken", accessToken);
        setLocalStorageItem("authRefreshToken", refreshToken);

        router.push("/dashboard");
      } catch (error) {
        console.log(error);
      }
    };

    if (session) {
      const { user } = session;
      if (user?.id && user?.name && user?.email) {
        const oauthData: OauthDto = {
          yandexId: user.id,
          login: user.name,
          email: user.email,
        };

        handleOauth(oauthData);
      }
    }
    // NOTE -  don't set setLocalStorageItem in dependencies because it cause circular updating
  }, [oauth, session, router]);

  return <div>Redirecting...</div>;
}
