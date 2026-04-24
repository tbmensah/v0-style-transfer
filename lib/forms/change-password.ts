import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    message: "New password must differ from current",
    path: ["newPassword"],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>

export const changePasswordDefaultValues: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
}

export const changePasswordResolver = zodResolver(changePasswordFormSchema)
