import { Box, Button } from "@chakra-ui/react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => (
  <Box mt={4} display="flex" justifyContent="space-between">
    <Button
      isDisabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
    >
      Previous
    </Button>
    <Button
      isDisabled={totalPages <= currentPage}
      onClick={() => onPageChange(currentPage + 1)}
    >
      Next
    </Button>
  </Box>
);
