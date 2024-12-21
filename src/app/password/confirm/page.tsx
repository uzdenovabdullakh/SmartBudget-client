"use client";

import { Button, FormControl } from "@chakra-ui/react";
import PasswordLayout from "@/components/layouts/PasswordLayout";
import FormInputUI from "@/components/ui/FormInputUI";
import { FaLock } from "react-icons/fa";

export default function ConfirmNewPasswordPage() {
  return (
    <PasswordLayout
      heading="Confirm password resetting"
      subHeading="Enter your new password. Keep it safe, and don't forget it again:)"
    >
      <FormControl display="flex" flexDir="column" gap={6} p={0}>
        <FormInputUI
          type="password"
          placeholder="Your new password"
          icon={FaLock}
        />
        <FormInputUI
          type="password"
          placeholder="Repeat your password"
          icon={FaLock}
        />
      </FormControl>
      <Button variant="primaryButton">Reset password</Button>
    </PasswordLayout>
  );
}
