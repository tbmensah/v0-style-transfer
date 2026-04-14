"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "@/lib/auth/sign-out"
import { userInitials } from "@/lib/utilities/user-display"
import { useAuthStore } from "@/lib/stores/auth-store"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Upload, ClipboardList, Coins, Settings, HelpCircle, LogOut, History, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { createContext, useContext, useState, type ReactNode } from "react"

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

// Context for sidebar state
const SidebarContext = createContext<{
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}>({
  isCollapsed: false,
  setIsCollapsed: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [loggingOut, setLoggingOut] = useState(false)
  const { isCollapsed, setIsCollapsed } = useSidebar()

  const displayName = user?.fullName?.trim() || user?.email || "Account"
  const email = user?.email ?? ""
  const initials = userInitials(user)

  async function handleLogout() {
    setLoggingOut(true)
    await signOut()
    router.push("/login")
    router.refresh()
    setLoggingOut(false)
  }

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border/60 bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <Link 
        href="/" 
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border/60 transition-colors hover:bg-sidebar-accent/30",
          isCollapsed ? "justify-center px-2" : "gap-2.5 px-6"
        )}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary shadow-md shadow-sidebar-primary/30">
          <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        {!isCollapsed && (
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">AdjustAid</span>
        )}
      </Link>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground/70 shadow-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                  isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-sidebar-primary/15 text-sidebar-primary ring-1 ring-sidebar-primary/20"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
                {!isCollapsed && item.name}
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
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                  isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-sidebar-primary/15 text-sidebar-primary ring-1 ring-sidebar-primary/20"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
                {!isCollapsed && item.name}
              </Link>
            )
          })}
          <button
            type="button"
            title={isCollapsed ? "Log Out" : undefined}
            disabled={loggingOut}
            onClick={() => void handleLogout()}
            className={cn(
              "flex w-full items-center rounded-lg text-sm font-medium text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground disabled:opacity-50",
              isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && (loggingOut ? "Signing out…" : "Log Out")}
          </button>
        </div>
      </nav>

      {/* User Info */}
      <div className={cn(
        "border-t border-sidebar-border/60 p-4",
        isCollapsed && "flex justify-center"
      )}>
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "gap-3"
        )}>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary/20 text-sm font-medium text-sidebar-primary ring-1 ring-sidebar-primary/20"
            title={isCollapsed ? displayName : undefined}
          >
            {initials}
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user?.fullName?.trim() || email || "Signed in"}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">{email || "—"}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
