"use client";

import { useEffect, useState } from "react";
import { useLazyGetUserQuery } from "@/lib/services/user.api";
import { UserDetails } from "@/lib/types/user.types";
import { Flex } from "@chakra-ui/react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import dynamic from "next/dynamic";
import { BudgetProvider } from "@/lib/context/BudgetContext";

const Brief = dynamic(
  () => import("@/components/brief/Brief").then((mod) => mod.Brief),
  { ssr: false },
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [getUser] = useLazyGetUserQuery();
  const [isBriefVisible, setBriefVisible] = useState(false);
  const [user, setUser] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await getUser().unwrap();
        setUser(userResponse);
        setBriefVisible(!userResponse.isBriefCompleted);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [getUser]);

  return (
    <BudgetProvider>
      <Flex height="100vh" overflow="hidden">
        {isBriefVisible && <Brief onClose={() => setBriefVisible(false)} />}
        <Sidebar user={user} />
        <Flex flex="1" direction="column" overflowY="auto" overflowX="hidden">
          {children}
        </Flex>
      </Flex>
    </BudgetProvider>
  );
}
