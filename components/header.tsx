"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon.png" alt="AdjustAid Logo" width={36} height={36} className="rounded-lg" />
          <span className="text-xl font-semibold tracking-tight text-foreground">AdjustAid</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="shadow-md shadow-primary/20">Get Started</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
