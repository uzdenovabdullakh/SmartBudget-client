export type LayoutProps = {
  children: React.ReactNode;
  heading?: string;
  subHeading?: string;
};

export type DefaultModalProps = {
  isOpen: boolean;
  onClose: (val?: any) => void;
};

export type PaginationParams = {
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};
