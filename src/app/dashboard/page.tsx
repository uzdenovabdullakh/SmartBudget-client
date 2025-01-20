"use client";

import { Box } from "@chakra-ui/react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Box p={8}>Dashboard Overview Content</Box>
    </DashboardLayout>
  );
}
