import { getUserByEmail } from "@/actions/user"
import bcryptjs from "bcryptjs"
import { signInWithPasswordSchema } from "@/validations/auth"

interface Credentials {
  email: string
  password: string
}

export async function authorize(rawCredentials: Credentials) {
  const validatedCredentials = signInWithPasswordSchema.safeParse(rawCredentials)

  if (validatedCredentials.success) {
    const user = await getUserByEmail(validatedCredentials.data.email)
    if (!user || !user.passwordHash) return null

    const passwordIsValid = await bcryptjs.compare(
      validatedCredentials.data.password,
      user.passwordHash
    )

    if (passwordIsValid) return user
  }
  return null
}