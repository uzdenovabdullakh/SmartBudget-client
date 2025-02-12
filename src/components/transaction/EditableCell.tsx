import { Flex, Input, Select } from "@chakra-ui/react";
import { TransactionType } from "@/lib/constants/enums";
import { Transaction } from "@/lib/types/transaction.types";
import { useTranslation } from "react-i18next";
import DatePickerUI from "../ui/DatePickerUI";

type EditableCellProps = {
  field: keyof Transaction;
  value: string;
  isEditing: boolean;
  editedValue: string;
  onValueChange: (value: string) => void;
};

export const EditableCell = ({
  field,
  value,
  isEditing,
  editedValue,
  onValueChange,
}: EditableCellProps) => {
  const { t } = useTranslation();

  if (!isEditing) {
    if (value === TransactionType.EXPENSE || value === TransactionType.INCOME) {
      return t(value);
    }
    return value;
  }

  switch (field) {
    case "amount":
      return (
        <Flex align="center">
          <Input
            type="number"
            value={editedValue}
            onChange={(e) => onValueChange(e.target.value)}
            autoFocus
          />
        </Flex>
      );

    case "type":
      return (
        <Select
          value={editedValue}
          onChange={(e) => onValueChange(e.target.value)}
          autoFocus
        >
          {Object.values(TransactionType).map((type) => (
            <option key={type} value={type}>
              {t(type)}
            </option>
          ))}
        </Select>
      );

    case "date":
      return (
        <DatePickerUI
          selected={editedValue ? new Date(editedValue) : null}
          onChange={(date) => {
            if (date) {
              onValueChange(date.toISOString());
            }
          }}
          autoFocus
        />
      );

    default:
      return (
        <Flex align="center">
          <Input
            value={editedValue}
            onChange={(e) => onValueChange(e.target.value)}
            autoFocus
          />
        </Flex>
      );
  }
};
