import { DefaultModalProps } from "@/lib/types/types";
import { showToast } from "@/lib/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  UpdateBudgetDto,
  UpdateBudgetSchema,
} from "@/lib/validation/budget.schema";
import { useUpdateBudgetMutation } from "@/lib/services/budget.api";
import { Budget } from "@/lib/types/budget.types";
import { Button, VStack } from "@chakra-ui/react";
import FormInputUI from "@/components/ui/FormInputUI";
import { DefaultModal } from "..";

type EditBudgetModalProps = {
  budget: Budget;
} & DefaultModalProps;

export const EditBudgetModal = ({
  isOpen,
  onClose,
  budget,
}: EditBudgetModalProps) => {
  const [updateBudget, { isLoading }] = useUpdateBudgetMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateBudgetDto>({
    resolver: zodResolver(UpdateBudgetSchema),
    defaultValues: {
      name: budget.name,
    },
  });

  const onSubmit = async (data: UpdateBudgetDto) => {
    try {
      const { message } = await updateBudget({
        id: budget.id,
        ...data,
      }).unwrap();

      showToast({ title: message, status: "success" });

      reset();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit budget name"
      size="sm"
      body={
        <VStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={5}
          align="stretch"
        >
          <FormInputUI
            type="text"
            placeholder="Enter new name"
            error={errors.name?.message}
            {...register("name")}
          />
        </VStack>
      }
      footer={
        <Button
          onClick={handleSubmit(onSubmit)}
          colorScheme="blue"
          isLoading={isLoading}
          width="full"
        >
          Save Changes
        </Button>
      }
    />
  );
};
