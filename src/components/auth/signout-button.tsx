"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function SignOutButton(): JSX.Element {
  return (
    <Button
      aria-label="Sign Out"
      variant="ghost"
      className="w-full justify-start text-sm"
      onClick={() =>
      {}
      }
    >
      <Icons.logout className="mr-2 size-4" aria-hidden="true" />
      Wyloguj
    </Button>
  )
}
