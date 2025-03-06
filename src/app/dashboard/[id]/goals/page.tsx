"use client";

import { GoalsCard } from "@/components/goals/GoalsCard";
import { AddGoalModal } from "@/components/modals/add-goal/AddGoalModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkeletonUI } from "@/components/ui/SkeletonUI";
import { SpanButton } from "@/components/ui/SpanButton";
import { GetGoalFilter } from "@/lib/constants/enums";
import { useBudgetContext } from "@/lib/context/BudgetContext";
import { useGetGoalsQuery } from "@/lib/services/goal.api";
import {
  Box,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Goals() {
  const { t } = useTranslation();
  const { budget } = useBudgetContext();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [filter, setFilter] = useState(GetGoalFilter.ACTIVE);

  const { data: goals, isLoading } = useGetGoalsQuery(
    { id: budget?.id!, filter },
    {
      skip: !budget?.id,
    },
  );

  return (
    <>
      <PageHeader text={t("Goals")} />
      <Box m={4}>
        <HStack>
          <SpanButton name={t("Create goal")} onClick={onOpen} />
          <AddGoalModal isOpen={isOpen} onClose={onClose} />
        </HStack>
      </Box>
      <Box borderBottom="1px solid #e2e8f0" />
      <Box p={8}>
        <Tabs
          variant="soft-rounded"
          colorScheme="blue"
          onChange={(index) =>
            setFilter(
              index === 0 ? GetGoalFilter.ACTIVE : GetGoalFilter.REACHED,
            )
          }
          defaultIndex={0}
        >
          <TabList mb={4}>
            <Tab>{t("Active")}</Tab>
            <Tab>{t("Reached")}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <HStack columnGap={4} rowGap={6}>
                {isLoading ? (
                  <SkeletonUI length={4} height="200px" width="250px" />
                ) : (
                  goals?.map((goal) => <GoalsCard key={goal.id} goal={goal} />)
                )}
              </HStack>
            </TabPanel>
            <TabPanel p={0}>
              <HStack columnGap={4} rowGap={6}>
                {isLoading ? (
                  <SkeletonUI length={4} height="200px" width="250px" />
                ) : (
                  goals?.map((goal) => <GoalsCard key={goal.id} goal={goal} />)
                )}
              </HStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
