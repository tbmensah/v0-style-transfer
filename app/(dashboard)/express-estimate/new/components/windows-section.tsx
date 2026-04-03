"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import type { WindowItem } from "../types"
import { createWindowItem } from "../defaults"
import { WindowItemComponent } from "./window-item"

interface WindowsSectionProps {
  windows: WindowItem[]
  onChange: (windows: WindowItem[]) => void
}

export function WindowsSection({ windows, onChange }: WindowsSectionProps) {
  const handleWindowChange = (windowIndex: number, updates: Partial<WindowItem>) => {
    const newWindows = [...windows]
    newWindows[windowIndex] = { ...newWindows[windowIndex], ...updates }
    onChange(newWindows)
  }

  const handleWindowDelete = (windowId: number) => {
    onChange(windows.filter(w => w.id !== windowId))
  }

  const handleAddWindow = () => {
    onChange([...windows, createWindowItem()])
  }

  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <div className="flex items-center justify-between">
        <Label className="font-medium">Windows ({windows.length})</Label>
        <Button variant="outline" size="sm" className="gap-2 border-border/60" onClick={handleAddWindow}>
          <Plus className="h-3 w-3" />
          Add Window
        </Button>
      </div>
      {windows.map((window, idx) => (
        <WindowItemComponent
          key={window.id}
          window={window}
          onChange={(updates) => handleWindowChange(idx, updates)}
          onDelete={() => handleWindowDelete(window.id)}
        />
      ))}
    </div>
  )
}
