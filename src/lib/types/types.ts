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
  order?: "ASC" | "DESC";
  page?: number;
  pageSize?: number;
  search?: string;
};

export type DateRange = {
  from: Date | null;
  to: Date | null;
};

export type PredefinedRange =
  | "This month"
  | "Latest 3 Months"
  | "This Year"
  | "Custom";

export type ResponseWithoutData = {
  message: string;
};

export type Message = {
  id: string;
  text: string;
  isUser: boolean;
};
