import { useUpdateUserMutation } from "@/lib/services/user.api";
import { DefaultModalProps } from "@/lib/types/types";
import { UpdateUserDto, UpdateUserSchema } from "@/lib/validation/user.schema";
import { EditEntityModal } from "../EditEntityModal";

type EditUserModalProps = {
  login?: string;
} & DefaultModalProps;

export const EditLoginModal = ({
  isOpen,
  onClose,
  login,
}: EditUserModalProps) => {
  const [updateUser] = useUpdateUserMutation();

  return (
    <EditEntityModal<UpdateUserDto>
      isOpen={isOpen}
      onClose={onClose}
      title="Edit login"
      defaultValues={{ login }}
      validationSchema={UpdateUserSchema}
      updateMutation={(data) => updateUser(data).unwrap()}
      fields={[{ name: "login", placeholder: "Enter new login", type: "text" }]}
    />
  );
};
