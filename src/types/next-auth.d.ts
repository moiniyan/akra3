type Role = "klient" | "administrator"

declare module "auth" {
  interface User {
    id: string
    email: string
    name: string
    role: Role
  }

  interface Session {
    user: User
    expires: string
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role
  }
}
