import { Period } from "@/lib/constants/enums";
import {
  useCreateCategoryLimitMutation,
  useDeleteCategoryLimitMutation,
  useGetCategoryLimitQuery,
  useUpdateCategoryLimitMutation,
} from "@/lib/services/category-limit.api";
import { BudgetSettings } from "@/lib/types/budget.types";
import { Category } from "@/lib/types/category.types";
import { formatCurrency } from "@/lib/utils/helpers";
import { showToast } from "@/lib/utils/toast";
import {
  CategoryLimitDto,
  CategoryLimitSchema,
} from "@/lib/validation/category-limit.schema";
import {
  Card,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  Heading,
  Text,
  Divider,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FormInputUI from "../ui/FormInputUI";
import FormSelectUI from "../ui/FormSelectUI";

type LimitCardProps = { category: Category; budgetSettings?: BudgetSettings };

export const LimitCard = ({ category, budgetSettings }: LimitCardProps) => {
  const { t } = useTranslation();

  const [isCreating, setIsCreating] = useState(false);

  const { data: categoryLimit } = useGetCategoryLimitQuery(category.id);
  const [createCategoryLimit] = useCreateCategoryLimitMutation();
  const [updateCategoryLimit] = useUpdateCategoryLimitMutation();
  const [deleteCategoryLimit] = useDeleteCategoryLimitMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CategoryLimitDto>({
    resolver: zodResolver(CategoryLimitSchema),
    defaultValues: {
      limitAmount: categoryLimit?.limitAmount || 0,
      limitResetPeriod: categoryLimit?.limitResetPeriod || Period.MONTHLY,
    },
  });

  const onSubmit = async (data: CategoryLimitDto) => {
    try {
      if (categoryLimit) {
        const { message } = await updateCategoryLimit({
          id: categoryLimit.id,
          ...data,
        }).unwrap();
        showToast({
          title: message,
          status: "success",
        });
      } else {
        const { message } = await createCategoryLimit({
          id: category.id,
          ...data,
        }).unwrap();
        showToast({
          title: message,
          status: "success",
        });
      }
      setIsCreating(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      if (categoryLimit) {
        const { message } = await deleteCategoryLimit(
          categoryLimit.id,
        ).unwrap();
        showToast({
          title: message,
          status: "success",
        });
        setIsCreating(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => {
    if (categoryLimit && !isCreating) {
      return (
        <>
          <Heading size="xs">
            {t("Current Limit for", { name: category.name })}
          </Heading>
          <Text mt={4} mb={4}>
            {t("Limit Amount")}:{" "}
            {formatCurrency(
              categoryLimit.limitAmount,
              budgetSettings?.currency,
              budgetSettings?.currencyPlacement,
            )}
          </Text>
          <Text mb={4}>
            {t("Period")}: {t(categoryLimit.limitResetPeriod)}
          </Text>
          <Button
            width="100%"
            colorScheme="blue"
            onClick={() => setIsCreating(true)}
          >
            {t("Edit Limit")}
          </Button>
        </>
      );
    }

    if (isCreating || categoryLimit) {
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
            {categoryLimit && (
              <Button
                alignItems="center"
                type="button"
                colorScheme="red"
                onClick={handleDelete}
              >
                {t("Delete", { entity: "" })}
              </Button>
            )}
            <HStack alignSelf="stretch" justifyContent="center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                {t("Cancel")}
              </Button>
              <Button type="submit" colorScheme="blue">
                {t("Save")}
              </Button>
            </HStack>
          </VStack>
        </form>
      );
    }

    return (
      <>
        <Heading size="xs">
          {t("How much do you need for", { name: category.name })}
        </Heading>
        <Text mt={4} mb={4}>
          {t("limit_card_description")}
        </Text>
        <Button
          width="100%"
          colorScheme="blue"
          onClick={() => setIsCreating(true)}
        >
          {t("Create Limit")}
        </Button>
      </>
    );
  };

  useEffect(() => {
    if (categoryLimit) {
      reset({
        limitAmount: categoryLimit.limitAmount,
        limitResetPeriod: categoryLimit.limitResetPeriod,
      });
    }
  }, [categoryLimit, reset]);

  return (
    <Card borderRadius="md" bg="white" mt={4}>
      <Accordion allowToggle defaultIndex={0}>
        <AccordionItem border="none">
          <AccordionButton p={4}>
            <Heading size="xs" fontWeight="semibold">
              {t("Limit")}
              <AccordionIcon />
            </Heading>
          </AccordionButton>
          <Divider borderColor="gray.300" />
          <AccordionPanel pb={4} pt={4} wordBreak="break-word">
            {renderContent()}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
