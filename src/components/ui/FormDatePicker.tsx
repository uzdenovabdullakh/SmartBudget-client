import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import DatePicker, { DatePickerProps } from "react-datepicker";
import { Controller } from "react-hook-form";
import DatePickerUI from "./DatePickerUI";

type Props = {
  control: any;
  label?: string;
  placeholder?: string;
  error?: string;
} & DatePickerProps;

const FormDatePicker = forwardRef<DatePicker, Props>(
  ({ control, label, error, placeholder }, ref) => {
    return (
      <FormControl isInvalid={!!error}>
        {label && <FormLabel>{label}</FormLabel>}
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Box>
              <DatePickerUI
                ref={ref}
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date?.toISOString())}
                isClearable
                placeholderText={placeholder}
              />
            </Box>
          )}
        />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  },
);

FormDatePicker.displayName = "FormDatePicker";

export default FormDatePicker;
