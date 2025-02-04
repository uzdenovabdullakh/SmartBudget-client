import i18n from "@/app/i18n";
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, i18n.t("validation.Password must be at least 8 characters long"))
  .max(32, i18n.t("validation.Password must be less than 32 characters long"))
  .regex(
    /[A-Z]/,
    i18n.t("validation.Password must contain at least one uppercase letter"),
  )
  .regex(
    /[a-z]/,
    i18n.t("validation.Password must contain at least one lowercase letter"),
  )
  .regex(
    /[0-9]/,
    i18n.t("validation.Password must contain at least one number"),
  )
  .regex(
    /[\W_]/,
    i18n.t("validation.Password must contain at least one special character"),
  );
