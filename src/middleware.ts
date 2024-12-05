import { NextRequest, NextResponse } from "next/server"
// import { verifyToken } from "@/utils/auth" // Assume you have a utility function to verify tokens

export const authRoutes = ["/logowanie", "/rejestracja", "/error"]
export const publicRoutes = [
  "/",
  "/polityka-prywatnosci",
  "/rezerwacja",
  "/rejestracja/potwierdz-email",
  "/rejestracja/potwierdz-email-ponownie",
  "/logowanie/haslo-reset",
  "/logowanie/haslo-aktualizacja",
]

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if the request is for an auth route
  if (authRoutes.includes(pathname)) {
    const token = req.cookies.get("auth-token")

    if (!token) {
      return NextResponse.redirect(new URL("/logowanie", req.url))
    }

    try {
      // const user = await verifyToken(token)
      // req.user = user
      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL("/logowanie", req.url))
    }
  }

  // Default response for other routes
  return NextResponse.next()
}