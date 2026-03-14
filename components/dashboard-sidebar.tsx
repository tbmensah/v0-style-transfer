"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Upload, ClipboardList, Coins, Settings, HelpCircle, LogOut, History, Zap } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Fast Fill", href: "/fast-fill", icon: Upload },
  { name: "Express Estimate", href: "/express-estimate", icon: ClipboardList },
  { name: "Tokens", href: "/tokens", icon: Coins },
  { name: "Job History", href: "/history", icon: History },
]

const secondaryNavigation = [
  { name: "Account Settings", href: "/account", icon: Settings },
  { name: "Support", href: "/support", icon: HelpCircle },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border/60 bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border/60 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary shadow-md shadow-sidebar-primary/30">
          <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">ClaimFlow</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary/15 text-sidebar-primary ring-1 ring-sidebar-primary/20"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-sidebar-primary")} />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="mt-auto space-y-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary/15 text-sidebar-primary ring-1 ring-sidebar-primary/20"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-sidebar-primary")} />
                {item.name}
              </Link>
            )
          })}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </Link>
        </div>
      </nav>

      {/* User Info */}
      <div className="border-t border-sidebar-border/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary/20 text-sm font-medium text-sidebar-primary ring-1 ring-sidebar-primary/20">
            SM
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">Sarah Mitchell</p>
            <p className="truncate text-xs text-sidebar-foreground/60">sarah@insuranceco.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
