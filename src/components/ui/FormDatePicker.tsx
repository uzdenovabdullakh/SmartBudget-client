import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import DatePicker, { DatePickerProps } from "react-datepicker";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Props = {
  control: any;
  label?: string;
  placeholder?: string;
  error?: string;
} & DatePickerProps;

const FormDatePicker = forwardRef<DatePicker, Props>(
  ({ control, label, error, placeholder }, ref) => {
    const { i18n } = useTranslation();

    return (
      <FormControl isInvalid={!!error}>
        {label && <FormLabel>{label}</FormLabel>}
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Box>
              <DatePicker
                ref={ref}
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date?.toISOString())}
                isClearable
                placeholderText={placeholder}
                dateFormat={
                  i18n.language === "ru" ? "dd-MM-yyyy" : "yyyy-MM-dd"
                }
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
