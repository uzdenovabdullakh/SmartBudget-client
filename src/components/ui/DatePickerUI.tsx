import { forwardRef } from "react";
import DatePicker, { DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";

const DatePickerUI = forwardRef<DatePicker, DatePickerProps>(
  ({ ...rest }, ref) => {
    const { i18n } = useTranslation();

    return (
      <DatePicker
        {...rest}
        ref={ref}
        dateFormat={i18n.language === "ru" ? "dd-MM-yyyy" : "yyyy-MM-dd"}
      />
    );
  },
);

DatePickerUI.displayName = "DatePickerUI";

export default DatePickerUI;
