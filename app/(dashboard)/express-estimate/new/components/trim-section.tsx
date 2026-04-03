"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TrimOptions } from "../types"

interface TrimSectionProps {
  trim: TrimOptions
  onChange: (updates: Partial<TrimOptions>) => void
}

export function TrimSection({ trim, onChange }: TrimSectionProps) {
  const nv = (v: string) => v === "__none__" ? "" : v

  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <div className="flex items-center gap-3">
        <Switch
          checked={trim.enabled}
          onCheckedChange={(checked) => onChange({ enabled: checked })}
        />
        <Label className="font-medium">Trim / Baseboard</Label>
      </div>
      {trim.enabled && (
        <div className="flex flex-wrap items-end gap-4">
          {/* Height */}
          <div className="space-y-1 min-w-[120px]">
            <Label className="text-xs text-muted-foreground">Height</Label>
            <Select value={trim.baseboardHeight} onValueChange={(v) => onChange({ baseboardHeight: nv(v) })}>
              <SelectTrigger className="border-border/60 bg-secondary/50">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                {["2", "3", "4", "5", "6"].map(h => (
                  <SelectItem key={h} value={h}>{h}&quot; Baseboard</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Material */}
          <div className="space-y-1 min-w-[100px]">
            <Label className="text-xs text-muted-foreground">Material</Label>
            <Select value={trim.material} onValueChange={(v) => onChange({ material: nv(v) })}>
              <SelectTrigger className="border-border/60 bg-secondary/50">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                <SelectItem value="mdf">MDF</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="wood">Wood</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Finish */}
          <div className="space-y-1 min-w-[100px]">
            <Label className="text-xs text-muted-foreground">Finish</Label>
            <Select value={trim.finish} onValueChange={(v) => onChange({ finish: nv(v) })}>
              <SelectTrigger className="border-border/60 bg-secondary/50">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                <SelectItem value="paint">Paint</SelectItem>
                <SelectItem value="stain">Stain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cap */}
          <div className="flex items-center gap-2 pb-1">
            <Switch
              checked={trim.cap}
              onCheckedChange={(checked) => onChange({ cap: checked })}
            />
            <Label className="text-sm">Cap</Label>
          </div>

          {/* Shoe */}
          <div className="flex items-center gap-2 pb-1">
            <Switch
              checked={trim.shoe}
              onCheckedChange={(checked) => onChange({ shoe: checked })}
            />
            <Label className="text-sm">Shoe</Label>
          </div>
          {trim.shoe && (
            <div className="space-y-1">
              <Select value={trim.shoeFinish} onValueChange={(v) => onChange({ shoeFinish: nv(v) })}>
                <SelectTrigger className="w-[90px] border-border/60 bg-secondary/50">
                  <SelectValue placeholder="Finish" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                  <SelectItem value="paint">Paint</SelectItem>
                  <SelectItem value="stain">Stain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Subtract Cabinetry */}
          <div className="flex items-center gap-2 pb-1">
            <Switch
              checked={trim.subtractCabinetry}
              onCheckedChange={(checked) => onChange({ subtractCabinetry: checked })}
            />
            <Label className="text-sm whitespace-nowrap">Subtract cabinetry</Label>
          </div>
        </div>
      )}
    </div>
  )
}
