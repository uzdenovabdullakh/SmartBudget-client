import { DefaultModalProps } from "@/lib/types/types";
import {
  UpdateAccountDto,
  UpdateAccountSchema,
} from "@/lib/validation/account.schema";
import { useUpdateAccountMutation } from "@/lib/services/account.api";
import { Account } from "@/lib/types/account.types";
import { EditEntityModal } from "../EditEntityModal";

type EditUserModalProps = {
  account?: Account;
} & DefaultModalProps;

export const EditAccountModal = ({
  isOpen,
  onClose,
  account,
}: EditUserModalProps) => {
  const [updateAccount] = useUpdateAccountMutation();

  return (
    <EditEntityModal<UpdateAccountDto>
      isOpen={isOpen}
      onClose={onClose}
      title="Edit name"
      defaultValues={{ name: account?.name }}
      validationSchema={UpdateAccountSchema}
      updateMutation={(data) =>
        updateAccount({ id: account?.id!, ...data }).unwrap()
      }
      fields={[{ name: "name", placeholder: "Enter new name", type: "text" }]}
    />
  );
};
