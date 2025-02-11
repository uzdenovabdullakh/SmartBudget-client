import { Flex, Input, Select } from "@chakra-ui/react";
import { TransactionType } from "@/lib/constants/enums";
import { Transaction } from "@/lib/types/transaction.types";
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
  if (!isEditing) {
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
              {type}
            </option>
          ))}
        </Select>
      );

    case "date":
      return (
        <DatePickerUI
          selected={editedValue ? new Date(editedValue) : null}
          onChange={(date) => {
            console.log(date);
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
