"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import type { DoorItem as DoorItemType } from "../types"

interface DoorItemProps {
  door: DoorItemType
  onChange: (updates: Partial<DoorItemType>) => void
  onDelete: () => void
}

export function DoorItemComponent({ door, onChange, onDelete }: DoorItemProps) {
  const nv = (v: string) => v === "__none__" ? "" : v

  return (
    <div className="space-y-3 rounded-lg bg-secondary/30 p-3">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary" className="capitalize">{door.category}</Badge>
        
        {/* Type */}
        <Select value={door.type} onValueChange={(v) => onChange({ type: nv(v) })}>
          <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[130px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
            {door.category === "interior" ? (
              <>
                <SelectItem value="6-panel">6 Panel</SelectItem>
                <SelectItem value="8ft-paneled">8ft Paneled</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="bifold-single">Bifold Single</SelectItem>
                <SelectItem value="bifold-double">Bifold Double</SelectItem>
                <SelectItem value="pocket-single">Pocket Single</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="fiberglass">Fiberglass</SelectItem>
                <SelectItem value="steel">Steel</SelectItem>
                <SelectItem value="french-wood">French Wood</SelectItem>
                <SelectItem value="french-metal">French Metal</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>

        {/* Grade */}
        <Select value={door.grade} onValueChange={(v) => onChange({ grade: nv(v) })}>
          <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[100px]">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>

        {/* Handle Action */}
        <Select value={door.handleAction} onValueChange={(v) => onChange({ handleAction: nv(v) })}>
          <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[120px]">
            <SelectValue placeholder="Handle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
            <SelectItem value="replace">Replace</SelectItem>
            <SelectItem value="detach-reset">Detach & Reset</SelectItem>
          </SelectContent>
        </Select>

        {/* Finish */}
        <Select value={door.finish} onValueChange={(v) => onChange({ finish: nv(v) })}>
          <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[100px]">
            <SelectValue placeholder="Finish" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
            <SelectItem value="paint">Paint</SelectItem>
            <SelectItem value="stain">Stain</SelectItem>
          </SelectContent>
        </Select>

        {/* Spacer and Delete */}
        <div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-destructive hover:bg-destructive/20"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Misc options for Exterior doors */}
      {door.category === "exterior" && (
        <div className="flex items-center gap-4 pt-2 border-t border-border/20">
          <Label className="text-sm font-medium">Misc</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={door.peepHole}
              onCheckedChange={(checked) => onChange({ peepHole: checked })}
            />
            <Label className="text-sm">Peep Hole</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={door.mailSlot}
              onCheckedChange={(checked) => onChange({ mailSlot: checked })}
            />
            <Label className="text-sm">Mail Slot</Label>
          </div>
        </div>
      )}
    </div>
  )
}
