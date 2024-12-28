import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast();

export const showToast = ({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: "success" | "error" | "info" | "warning";
}) => {
  toast({
    title,
    description,
    status,
    duration: 5000,
    isClosable: true,
    position: "top-right",
  });
};
