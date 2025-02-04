import { Input } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type SearchInputProps = {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export const SearchInput = ({
  searchQuery,
  placeholder,
  onSearchChange,
}: SearchInputProps) => {
  const { t } = useTranslation();

  return (
    <Input
      placeholder={placeholder || t("Search")}
      value={searchQuery}
      onChange={onSearchChange}
      mr={4}
    />
  );
};
