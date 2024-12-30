"use client";

import { Button, Heading, Card, CardHeader, CardBody } from "@chakra-ui/react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useParams, useRouter } from "next/navigation";
import { useRestoreAccountMutation } from "@/lib/services/auth.api";
import { showToast } from "@/lib/utils/toast";
import { RestoreAccountSchema } from "@/lib/validation/restore-account.schema";

export default function ConfirmRestoreAccountPage() {
  const params = useParams();
  const router = useRouter();

  const [restoreAccount, { isLoading }] = useRestoreAccountMutation();

  const handleConfirmRestore = async () => {
    if (!params.slug) {
      showToast({
        title: "Error",
        description: "Token not found in the URL",
        status: "error",
      });
      return;
    }
    try {
      const data = { token: params.slug as string };
      RestoreAccountSchema.parse(data);

      const { message } = await restoreAccount(data).unwrap();

      showToast({
        title: message,
        description: "You will now be redirected to the login page.",
        status: "success",
      });

      router.push("/auth/signin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayout
      heading="Recover your removed account"
      subHeading="Confirm restoring and continue managing your finances"
    >
      <Card width="100%" maxW="md" gap={6} p={8}>
        <CardHeader justifyItems="center" p={0}>
          <Heading variant="cardHeader">Complete restoring</Heading>
        </CardHeader>
        <CardBody display="flex" flexDir="column" gap={6} p={0}>
          <Button
            variant="callToActionButton"
            onClick={handleConfirmRestore}
            isLoading={isLoading}
          >
            Confirm restore
          </Button>
        </CardBody>
      </Card>
    </AuthLayout>
  );
}
