import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export const loginFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>

export const loginDefaultValues: LoginFormValues = {
  email: "",
  password: "",
}

export const loginResolver = zodResolver(loginFormSchema)
