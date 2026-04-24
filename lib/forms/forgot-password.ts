import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export const forgotPasswordFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>

export const forgotPasswordDefaultValues: ForgotPasswordFormValues = {
  email: "",
}

export const forgotPasswordResolver = zodResolver(forgotPasswordFormSchema)
