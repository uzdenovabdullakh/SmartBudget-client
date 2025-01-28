import { Input } from "@chakra-ui/react";

type SearchInputProps = {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export const SearchInput = ({
  searchQuery,
  placeholder,
  onSearchChange,
}: SearchInputProps) => (
  <Input
    placeholder={placeholder || "Search"}
    value={searchQuery}
    onChange={onSearchChange}
    mr={4}
  />
);
