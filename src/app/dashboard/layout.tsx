"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLazyGetBudgetsQuery } from "@/lib/services/budget.api";
import { useLazyGetUserQuery } from "@/lib/services/user.api";
import { Budget } from "@/lib/types/budget.types";
import { UserDetails } from "@/lib/types/user.types";
import { Flex } from "@chakra-ui/react";
import { Brief } from "@/components/brief/Brief";
import { Sidebar } from "@/components/sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [getUser] = useLazyGetUserQuery();
  const [getBudgets] = useLazyGetBudgetsQuery();

  const [isBriefVisible, setBriefVisible] = useState(false);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const budgetResponse = await getBudgets().unwrap();
        const firstBudget = budgetResponse[0];
        setBudget(firstBudget);

        if (!pathname.includes(firstBudget?.id) && firstBudget?.id) {
          router.replace(`/dashboard/${firstBudget.id}`);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchBudget();
  }, [getBudgets, pathname, router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await getUser().unwrap();

        setUser(userResponse);
        setBriefVisible(!userResponse.isBriefCompleted);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [getUser]);

  return (
    <Flex height="100vh" overflow="hidden">
      {isBriefVisible && <Brief onClose={() => setBriefVisible(false)} />}
      <Sidebar user={user} budget={budget} />
      <Flex flex="1" direction="column">
        {children}
      </Flex>
    </Flex>
  );
}
