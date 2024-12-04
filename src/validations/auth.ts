import * as z from "zod"

import { emailSchema } from "@/validations/email"

// User ID validation schema
export const userIdSchema = z
  .string({
    required_error: "User ID is required",
    invalid_type_error: "Input must be a string",
  })
  .min(1, {
    message: "ID must have at least 1 character",
  })
  .max(128, {
    message: "ID can have a maximum of 128 characters",
  })

// Password validation schema
export const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Invalid data type",
  })
  .min(8, {
    message: "Password must be at least 8 characters long",
  })
  .max(256, {
    message: "Password cannot exceed 256 characters",
  })

// Sign up with password schema
export const signUpWithPasswordSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema.regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      {
        message:
          "Password must be between 8 and 256 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Sign in with password schema
export const signInWithPasswordSchema = z.object({
  email: emailSchema,
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Invalid data type",
  }),
})

// Password reset schema
export const passwordResetSchema = z.object({
  email: emailSchema,
})

// Password update schema
export const passwordUpdateSchema = z
  .object({
    password: passwordSchema.regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      {
        message:
          "Password must be between 8 and 256 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Extended password update schema (with reset token)
export const passwordUpdateSchemaExtended = z
  .object({
    password: passwordSchema.regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      {
        message:
          "Password must be between 8 and 256 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
    confirmPassword: z.string(),
    resetPasswordToken: z
      .string({
        required_error: "Password reset token is required",
        invalid_type_error: "Invalid data type",
      })
      .min(16)
      .max(512),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Link OAuth account schema
export const linkOAuthAccountSchema = z.object({
  userId: userIdSchema,
})

export type SignUpWithPasswordFormInput = z.infer<
  typeof signUpWithPasswordSchema
>

export type SignInWithPasswordFormInput = z.infer<
  typeof signInWithPasswordSchema
>

export type PasswordResetFormInput = z.infer<typeof passwordResetSchema>

export type PasswordUpdateFormInput = z.infer<typeof passwordUpdateSchema>

export type PasswordUpdateFormInputExtended = z.infer<
  typeof passwordUpdateSchemaExtended
>

export type LinkOAuthAccountInput = z.infer<typeof linkOAuthAccountSchema>
