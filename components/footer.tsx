import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="AdjustAid Logo" width={28} height={28} className="rounded-lg" />
            <span className="text-sm font-medium text-foreground">AdjustAid</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/support" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Support
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AdjustAid. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
