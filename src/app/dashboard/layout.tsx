"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useLazyGetBudgetInfoQuery,
  useLazyGetBudgetsQuery,
} from "@/lib/services/budget.api";
import { useLazyGetUserQuery } from "@/lib/services/user.api";
import { UserDetails } from "@/lib/types/user.types";
import { Flex } from "@chakra-ui/react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { BudgetData } from "@/lib/types/budget.types";

const Brief = dynamic(
  () => import("@/components/brief/Brief").then((mod) => mod.Brief),
  {
    ssr: false,
  },
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const budgetId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [getUser] = useLazyGetUserQuery();
  const [getBudgets] = useLazyGetBudgetsQuery();
  const [getBudgetInfo] = useLazyGetBudgetInfoQuery();

  const [isBriefVisible, setBriefVisible] = useState(false);
  const [budget, setBudget] = useState<BudgetData>(null);
  const [user, setUser] = useState<UserDetails | null>(null);

  const fetchBudget = useCallback(async () => {
    try {
      if (!budgetId) {
        const budgetResponse = await getBudgets().unwrap();
        const firstBudget = budgetResponse[0];
        setBudget(firstBudget);
      } else {
        const budgetResponse = await getBudgetInfo(budgetId).unwrap();
        setBudget(budgetResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }, [budgetId, getBudgetInfo, getBudgets]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

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
      <Flex flex="1" direction="column" overflowY="auto" overflowX="hidden">
        {children}
      </Flex>
    </Flex>
  );
}
