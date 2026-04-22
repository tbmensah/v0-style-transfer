"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useMetrics } from "@/lib/api/hooks/use-metrics"

export type MetricsContextValue = ReturnType<typeof useMetrics>

const MetricsContext = createContext<MetricsContextValue | null>(null)

/** Subscribes once to `GET /metrics` + job-status summary. Wrap dashboard (inside `QueryProvider`). */
export function MetricsProvider({ children }: { children: ReactNode }) {
  const value = useMetrics()
  return <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>
}

export function useMetricsContext(): MetricsContextValue {
  const ctx = useContext(MetricsContext)
  if (!ctx) {
    throw new Error("useMetricsContext must be used within MetricsProvider")
  }
  return ctx
}
