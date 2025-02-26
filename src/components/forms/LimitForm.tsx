import { VStack, HStack, Button } from "@chakra-ui/react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CategoryLimitDto } from "@/lib/validation/category-limit.schema";
import { Period } from "@/lib/constants/enums";
import FormInputUI from "../ui/FormInputUI";
import FormSelectUI from "../ui/FormSelectUI";

type LimitFormProps = {
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  control: Control<CategoryLimitDto, any>;
  errors: FieldErrors<CategoryLimitDto>;
};

export const LimitForm = ({
  onSubmit,
  onCancel,
  onDelete,
  control,
  errors,
}: LimitFormProps) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <Controller
        name="limitAmount"
        control={control}
        render={({ field }) => (
          <FormInputUI
            type="number"
            label={t("I will spend")}
            error={errors.limitAmount?.message}
            {...field}
            onChange={(e) => field.onChange(e.target.valueAsNumber)}
          />
        )}
      />
      <Controller
        name="limitResetPeriod"
        control={control}
        render={({ field }) => (
          <FormSelectUI
            label={t("Every")}
            error={errors.limitResetPeriod?.message}
            options={Object.values(Period).map((period) => ({
              value: period,
              label: t(period),
            }))}
            {...field}
          />
        )}
      />
      <VStack alignItems="center" justifyContent="center" mt={4}>
        {onDelete && (
          <Button
            alignItems="center"
            type="button"
            colorScheme="red"
            onClick={onDelete}
          >
            {t("Delete", { entity: "" })}
          </Button>
        )}
        <HStack alignSelf="stretch" justifyContent="center">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("Cancel")}
          </Button>
          <Button type="submit" colorScheme="blue">
            {t("Save")}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};
