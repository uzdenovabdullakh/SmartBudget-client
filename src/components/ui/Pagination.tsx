import { Button, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex mt={4} justifyContent={isMobile ? "flex-start" : "space-between"}>
      <Button
        isDisabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {t("Previous")}
      </Button>
      <Button
        isDisabled={totalPages <= currentPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {t("Next")}
      </Button>
    </Flex>
  );
};
