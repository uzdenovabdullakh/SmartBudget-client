"use client";

import { format } from "date-fns";
import { Box } from "@chakra-ui/react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function Budget() {
  const date = format(new Date(), "MMM yyyy");

  return (
    <>
      <PageHeader text={date} />
      <Box p={8}>Dashboard Overview Content</Box>
    </>
  );
}
