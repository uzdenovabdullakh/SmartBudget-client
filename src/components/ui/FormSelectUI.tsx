import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  SelectProps,
} from "@chakra-ui/react";
import { forwardRef } from "react";

type Props = {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
} & SelectProps;

const FormSelectUI = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, options, ...rest }, ref) => {
    return (
      <FormControl isInvalid={!!error}>
        {label && <FormLabel>{label}</FormLabel>}
        <Select ref={ref} {...rest}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  },
);

FormSelectUI.displayName = "FormSelectUI";

export default FormSelectUI;
