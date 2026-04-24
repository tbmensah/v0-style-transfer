import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export const signupFormSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().email("Enter a valid email"),
    company: z.string().trim(),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type SignupFormValues = z.infer<typeof signupFormSchema>

export const signupDefaultValues: SignupFormValues = {
  fullName: "",
  email: "",
  company: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
}

export const signupResolver = zodResolver(signupFormSchema)
