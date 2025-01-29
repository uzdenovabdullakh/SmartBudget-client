import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast();

type ToastType = {
  title: string;
  status: "success" | "error" | "info" | "warning";
  description?: string;
};

export const showToast = ({ title, description, status }: ToastType) => {
  toast({
    title,
    description,
    status,
    duration: 5000,
    isClosable: true,
    position: "top-right",
  });
};
