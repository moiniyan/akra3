"use server"

import { unstable_noStore as noStore } from "next/cache"
import { getUserByEmail, getUserByResetPasswordToken } from "@/actions/user"
import { signIn } from "@/auth"
import bcryptjs from "bcryptjs"
import { eq } from "drizzle-orm"

import { db } from "@/config/db"
import { resend } from "@/config/email"
import { psLinkOAuthAccount } from "@/db/prepared-statements/auth"
import { users } from "@/db/schema"
import {
  linkOAuthAccountSchema,
  passwordResetSchema,
  passwordUpdateSchemaExtended,
  signInWithPasswordSchema,
  signUpWithPasswordSchema,
  type LinkOAuthAccountInput,
  type PasswordResetFormInput,
  type PasswordUpdateFormInputExtended,
  type SignInWithPasswordFormInput,
  type SignUpWithPasswordFormInput,
} from "@/validations/auth"

import { generateId } from "@/lib/utils"

import { EmailVerificationEmail } from "@/components/emails/auth/email-verification-email"
import { ResetPasswordEmail } from "@/components/emails/auth/reset-password-email"


function generateToken(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
}

export async function signUpWithPassword(
  rawInput: SignUpWithPasswordFormInput
): Promise<"invalid-input" | "exists" | "success" | "error"> {
  try {
    const validatedInput = signUpWithPasswordSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const user = await getUserByEmail({ email: validatedInput.data.email })
    if (user) return "exists"

    const passwordHash = await bcryptjs.hash(validatedInput.data.password, 10)
    //create 32 bytes token without randomBytes function
    const emailVerificationToken = generateToken(32)

    const newUser = await db
      .insert(users)
      .values({
        id: generateId(),
        email: validatedInput.data.email,
        passwordHash,
        emailVerificationToken,
      })
      .returning()

    const emailSent = await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM,
      to: [validatedInput.data.email],
      subject: "Verify your email address",
      react: EmailVerificationEmail({
        email: validatedInput.data.email,
        emailVerificationToken,
      }),
    })

    return newUser && emailSent ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error signing up with password")
  }
}

export async function signInWithPassword(
  rawInput: SignInWithPasswordFormInput
): Promise<
  | "invalid-input"
  | "invalid-credentials"
  | "not-registered"
  | "unverified-email"
  | "success"
> {
  try {
    const validatedInput = signInWithPasswordSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const existingUser = await getUserByEmail({
      email: validatedInput.data.email,
    })
    if (!existingUser) return "not-registered"

    if (!existingUser.emailVerified) return "unverified-email"

    const passwordHash = await bcryptjs.hash(validatedInput.data.password, 10)

    // await signIn("credentials", {
    //   email: validatedInput.data.email,
    //   password: passwordHash,
    //   redirect: false,
    // })

    return "success"
  } catch (error) {
    console.error(error)
    {
      throw new Error("Error signing in with password")
    }
  }
}

export async function resetPassword(
  rawInput: PasswordResetFormInput
): Promise<"invalid-input" | "not-found" | "success" | "error"> {
  try {
    const validatedInput = passwordResetSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const user = await getUserByEmail({ email: validatedInput.data.email })
    if (!user) return "not-found"

    const today = new Date()
    const resetPasswordToken = generateToken(32)
    const resetPasswordTokenExpiry = new Date(
      today.setDate(today.getDate() + 1)
    ) // 24 hours from now

    const userUpdated = await db
      .update(users)
      .set({
        resetPasswordToken,
        resetPasswordTokenExpiry,
      })
      .where(eq(users.email, validatedInput.data.email))
      .returning()

    const emailSent = await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM,
      to: [validatedInput.data.email],
      subject: "Resetowanie hasła",
      react: ResetPasswordEmail({
        email: validatedInput.data.email,
        resetPasswordToken,
      }),
    })

    return userUpdated && emailSent ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error resetting password")
  }
}

export async function updatePassword(
  rawInput: PasswordUpdateFormInputExtended
): Promise<"invalid-input" | "not-found" | "expired" | "success" | "error"> {
  try {
    const validatedInput = passwordUpdateSchemaExtended.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const user = await getUserByResetPasswordToken({
      token: validatedInput.data.resetPasswordToken,
    })
    if (!user) return "not-found"

    const resetPasswordExpiry = user.resetPasswordTokenExpiry
    if (!resetPasswordExpiry || resetPasswordExpiry < new Date())
      return "expired"

    const passwordHash = await bcryptjs.hash(validatedInput.data.password, 10)

    const userUpdated = await db
      .update(users)
      .set({
        passwordHash,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      })
      .where(eq(users.id, user.id))
      .returning()

    return userUpdated ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating password")
  }
}

export async function linkOAuthAccount(
  rawInput: LinkOAuthAccountInput
): Promise<void> {
  try {
    const validatedInput = linkOAuthAccountSchema.safeParse(rawInput)
    if (!validatedInput.success) return

    noStore()
    await psLinkOAuthAccount.execute({ userId: validatedInput.data.userId })
  } catch (error) {
    console.error(error)
    throw new Error("Error linking OAuth account")
  }
}
