import { DefaultModalProps } from "@/lib/types/types";
import {
  UpdateAccountDto,
  UpdateAccountSchema,
} from "@/lib/validation/account.schema";
import { useUpdateAccountMutation } from "@/lib/services/account.api";
import { Account } from "@/lib/types/account.types";
import { useTranslation } from "react-i18next";
import { EditEntityModal } from "../EditEntityModal";

type EditUserModalProps = {
  account?: Omit<Account, "createdAt">;
} & DefaultModalProps;

export const EditAccountModal = ({
  isOpen,
  onClose,
  account,
}: EditUserModalProps) => {
  const { t } = useTranslation();
  const [updateAccount] = useUpdateAccountMutation();

  return (
    <EditEntityModal<UpdateAccountDto>
      isOpen={isOpen}
      onClose={onClose}
      title="Edit name"
      defaultValues={{ name: account?.name, amount: account?.amount }}
      validationSchema={UpdateAccountSchema}
      updateMutation={(data) =>
        updateAccount({ id: account?.id!, ...data }).unwrap()
      }
      fields={[
        { name: "name", placeholder: t("Enter new name"), type: "text" },
        {
          name: "amount",
          placeholder: t("Update amount"),
          type: "number",
        },
      ]}
    />
  );
};
