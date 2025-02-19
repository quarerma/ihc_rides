import { z } from "zod";

// Helper function to check if the user is at least 12 years old
const minAgeDate = new Date();
minAgeDate.setFullYear(minAgeDate.getFullYear() - 12);

export const signupSchema = z
  .object({
    user_firstname: z
      .string()
      .min(2, "First name must be at least 2 characters"),
    user_lastname: z.string().min(2, "Last name must be at least 2 characters"),
    birth_date: z
      .string()
      .refine(
        (date) => new Date(date) <= minAgeDate,
        "You must be at least 12 years old"
      ),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirm_password: z.string(),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Invalid CPF format"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  });

export type SignupData = z.infer<typeof signupSchema>;
