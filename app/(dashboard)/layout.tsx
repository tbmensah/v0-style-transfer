"use client"

import { DashboardSidebar, SidebarProvider, useSidebar } from "@/components/dashboard-sidebar"
import { MetricsProvider } from "@/components/metrics-context"
import { MetricsPrefetch } from "@/components/metrics-prefetch"

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className={`transition-all duration-300 ${isCollapsed ? "pl-16" : "pl-64"}`}>
        <div className="min-h-screen p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <MetricsProvider>
        <MetricsPrefetch />
        <DashboardContent>{children}</DashboardContent>
      </MetricsProvider>
    </SidebarProvider>
  )
}
