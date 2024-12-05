"use client"

import * as React from "react"

interface AuthProviderProps {
  children: React.ReactNode
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = React.useState<User | null>(null)

  const signIn = async (email: string, password: string) => {
    // Implement your sign-in logic here
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      setUser(data.user)
    } else {
      throw new Error('Invalid credentials')
    }
  }

  const signOut = () => {
    // Implement your sign-out logic here
    fetch('/api/auth/signout', {
      method: 'POST',
    }).then(() => {
      setUser(null)
    })
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}