import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  FormControl,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { IconType } from "react-icons";

type Props = {
  type: "text" | "password" | "email";
  placeholder: string;
  icon?: IconType;
};

const FormInputUI = ({ type, placeholder, icon }: Props) => {
  const [showPassword, setShowPassword] = useState(type);
  const togglePasswordVisibility = () =>
    setShowPassword(showPassword === "password" ? "text" : type);

  return (
    <FormControl>
      <InputGroup>
        {icon && (
          <InputLeftElement>
            <Icon as={icon} color="neutrals.neutral400" />
          </InputLeftElement>
        )}
        <Input
          border="1px solid"
          borderColor="neutrals.neutral400"
          type={showPassword}
          placeholder={placeholder}
        />
        {type === "password" && (
          <InputRightElement maxH="100%">
            <IconButton
              variant="unstyled"
              aria-label="show password"
              icon={
                showPassword !== "password" ? <ViewOffIcon /> : <ViewIcon />
              }
              onClick={togglePasswordVisibility}
            />
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};

export default FormInputUI;
