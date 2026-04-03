"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import type { DoorItem } from "../types"
import { createDoorItem } from "../defaults"
import { DoorItemComponent } from "./door-item"

interface DoorsSectionProps {
  doors: DoorItem[]
  onChange: (doors: DoorItem[]) => void
}

export function DoorsSection({ doors, onChange }: DoorsSectionProps) {
  const handleDoorChange = (doorIndex: number, updates: Partial<DoorItem>) => {
    const newDoors = [...doors]
    newDoors[doorIndex] = { ...newDoors[doorIndex], ...updates }
    onChange(newDoors)
  }

  const handleDoorDelete = (doorId: number) => {
    onChange(doors.filter(d => d.id !== doorId))
  }

  const handleAddDoor = (category: "interior" | "exterior") => {
    const newDoor = createDoorItem()
    newDoor.category = category
    onChange([...doors, newDoor])
  }

  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <div className="flex items-center justify-between">
        <Label className="font-medium">Doors ({doors.length})</Label>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-border/60" onClick={() => handleAddDoor("interior")}>
            <Plus className="h-3 w-3" />
            Interior
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-border/60" onClick={() => handleAddDoor("exterior")}>
            <Plus className="h-3 w-3" />
            Exterior
          </Button>
        </div>
      </div>
      {doors.map((door, idx) => (
        <DoorItemComponent
          key={door.id}
          door={door}
          onChange={(updates) => handleDoorChange(idx, updates)}
          onDelete={() => handleDoorDelete(door.id)}
        />
      ))}
    </div>
  )
}
