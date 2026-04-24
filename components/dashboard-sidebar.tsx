"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "@/lib/auth/sign-out"
import { userInitials } from "@/lib/utilities/user-display"
import { useAuthStore } from "@/lib/stores/auth-store"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Upload,
  ClipboardList,
  Coins,
  Settings,
  HelpCircle,
  LogOut,
  History,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react"
import { X } from "lucide-react"

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

const LG_MIN = "(min-width: 1024px)"

type SidebarContextValue = {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
  mobileNavOpen: boolean
  setMobileNavOpen: (value: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue>({
  isCollapsed: false,
  setIsCollapsed: () => {},
  mobileNavOpen: false,
  setMobileNavOpen: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const setCollapsed = useCallback((value: boolean) => {
    setIsCollapsed(value)
  }, [])
  const setMobileOpen = useCallback((value: boolean) => {
    setMobileNavOpen(value)
  }, [])
  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed: setCollapsed,
        mobileNavOpen,
        setMobileNavOpen: setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

function useIsLgDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useLayoutEffect(() => {
    const mq = window.matchMedia(LG_MIN)
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return isDesktop
}

export function DashboardSidebar() {
  const pathname = usePathname() ?? ""
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [loggingOut, setLoggingOut] = useState(false)
  const { isCollapsed, setIsCollapsed, mobileNavOpen, setMobileNavOpen } = useSidebar()
  const isDesktop = useIsLgDesktop()

  const displayName = user?.fullName?.trim() || user?.email || "Account"
  const email = user?.email ?? ""
  const initials = userInitials(user)

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname, setMobileNavOpen])

  useEffect(() => {
    if (isDesktop) {
      setMobileNavOpen(false)
    }
  }, [isDesktop, setMobileNavOpen])

  async function handleLogout() {
    setLoggingOut(true)
    await signOut()
    router.push("/login")
    router.refresh()
    setLoggingOut(false)
  }

  const closeMobileNav = () => setMobileNavOpen(false)
  const navLinkClass = (isActive: boolean, collapsed: boolean) =>
    cn(
      "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
      collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
      isActive
        ? "bg-sidebar-primary/15 text-sidebar-primary ring-1 ring-sidebar-primary/20"
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
    )

  const showLabels = isDesktop ? !isCollapsed : true
  const collapsedLayout = isDesktop && isCollapsed

  return (
    <>
      {!isDesktop && mobileNavOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={closeMobileNav}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border/60 bg-sidebar transition-transform duration-300 ease-out lg:transition-[width,transform] lg:duration-300",
          !isDesktop && (mobileNavOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"),
          isDesktop && "translate-x-0",
          isDesktop && (isCollapsed ? "lg:w-16" : "lg:w-64"),
        )}
      >
        <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border/60">
          <Link
            href="/"
            onClick={!isDesktop ? closeMobileNav : undefined}
            className={cn(
              "flex min-w-0 flex-1 items-center transition-colors hover:bg-sidebar-accent/30",
              collapsedLayout ? "justify-center px-2" : "gap-2.5 px-4 lg:px-6",
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary shadow-md shadow-sidebar-primary/30">
              <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            {showLabels ? (
              <span className="truncate text-lg font-semibold tracking-tight text-sidebar-foreground">
                AdjustAid
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={closeMobileNav}
            className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground/70 shadow-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground lg:flex"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={collapsedLayout ? item.name : undefined}
                  onClick={!isDesktop ? closeMobileNav : undefined}
                  className={navLinkClass(isActive, collapsedLayout)}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
                  {showLabels ? item.name : null}
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
                  title={collapsedLayout ? item.name : undefined}
                  onClick={!isDesktop ? closeMobileNav : undefined}
                  className={navLinkClass(isActive, collapsedLayout)}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
                  {showLabels ? item.name : null}
                </Link>
              )
            })}
            <button
              type="button"
              title={collapsedLayout ? "Log Out" : undefined}
              disabled={loggingOut}
              onClick={() => {
                if (!isDesktop) closeMobileNav()
                void handleLogout()
              }}
              className={cn(
                "flex w-full items-center rounded-lg text-sm font-medium text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground disabled:opacity-50",
                collapsedLayout ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {showLabels ? (loggingOut ? "Signing out…" : "Log Out") : null}
            </button>
          </div>
        </nav>

        <div
          className={cn(
            "border-t border-sidebar-border/60 p-4",
            collapsedLayout && "flex justify-center",
          )}
        >
          <div className={cn("flex items-center", collapsedLayout ? "justify-center" : "gap-3")}>
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/20 text-sm font-medium text-sidebar-primary ring-1 ring-sidebar-primary/20"
              title={collapsedLayout ? displayName : undefined}
            >
              {initials}
            </div>
            {showLabels ? (
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {user?.fullName?.trim() || email || "Signed in"}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/60">{email || "—"}</p>
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  )
}
