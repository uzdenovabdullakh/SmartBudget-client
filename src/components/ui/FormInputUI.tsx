import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormErrorMessage,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  InputProps,
} from "@chakra-ui/react";
import { useState, forwardRef } from "react";
import { IconType } from "react-icons";

type Props = {
  type: "text" | "password" | "email";
  placeholder: string;
  icon?: IconType;
  error?: string;
} & InputProps;

const FormInputUI = forwardRef<HTMLInputElement, Props>(
  ({ type, placeholder, icon, error, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(type);

    const togglePasswordVisibility = () =>
      setShowPassword(showPassword === "password" ? "text" : type);

    return (
      <FormControl isInvalid={!!error}>
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
            ref={ref}
            {...rest}
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
        {error && (
          <FormErrorMessage
            position="absolute"
            bottom="-20px"
            left="0"
            right="0"
          >
            {error}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  },
);

FormInputUI.displayName = "FormInputUI";

export default FormInputUI;
