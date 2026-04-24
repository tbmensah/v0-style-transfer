import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const resetPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>

export const resetPasswordDefaultValues: ResetPasswordFormValues = {
  newPassword: "",
  confirmPassword: "",
}

export const resetPasswordResolver = zodResolver(resetPasswordFormSchema)
