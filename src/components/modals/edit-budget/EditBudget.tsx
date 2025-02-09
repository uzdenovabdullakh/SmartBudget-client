import { useUpdateBudgetMutation } from "@/lib/services/budget.api";
import {
  UpdateBudgetDto,
  UpdateBudgetSchema,
} from "@/lib/validation/budget.schema";
import { BaseBudget } from "@/lib/types/budget.types";
import { DefaultModalProps } from "@/lib/types/types";
import { EditEntityModal } from "../EditEntityModal";

type EditBudgetModalProps = {
  budget: BaseBudget;
} & DefaultModalProps;

export const EditBudgetModal = ({
  isOpen,
  onClose,
  budget,
}: EditBudgetModalProps) => {
  const [updateBudget] = useUpdateBudgetMutation();

  return (
    <EditEntityModal<UpdateBudgetDto>
      isOpen={isOpen}
      onClose={onClose}
      title="Edit budget name"
      defaultValues={{ name: budget.name }}
      validationSchema={UpdateBudgetSchema}
      updateMutation={(data) =>
        updateBudget({ id: budget.id, ...data }).unwrap()
      }
      fields={[{ name: "name", placeholder: "Enter new name", type: "text" }]}
    />
  );
};
