"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ElectricalOptions } from "../types"

interface ElectricalSectionProps {
  electrical: ElectricalOptions
  onChange: (updates: Partial<ElectricalOptions>) => void
}

export function ElectricalSection({ electrical, onChange }: ElectricalSectionProps) {
  const nv = (v: string) => v === "__none__" ? "" : v

  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <div className="flex items-center gap-3">
        <Switch
          checked={electrical.enabled}
          onCheckedChange={(checked) => onChange({ enabled: checked })}
        />
        <Label className="font-medium">Electrical</Label>
      </div>
      {electrical.enabled && (
        <div className="flex flex-wrap items-center gap-4">
          {/* 110 Outlets */}
          <div className="space-y-1 w-[80px]">
            <Label className="text-xs text-muted-foreground">110 Outlets</Label>
            <Input
              type="number"
              min="0"
              placeholder="QTY"
              value={electrical.outlets110 || ""}
              onChange={(e) => onChange({ outlets110: parseInt(e.target.value) || 0 })}
              className="border-border/60 bg-secondary/50"
            />
          </div>

          {/* 220 Outlets */}
          <div className="space-y-1 w-[80px]">
            <Label className="text-xs text-muted-foreground">220 Outlets</Label>
            <Input
              type="number"
              min="0"
              placeholder="QTY"
              value={electrical.outlets220 || ""}
              onChange={(e) => onChange({ outlets220: parseInt(e.target.value) || 0 })}
              className="border-border/60 bg-secondary/50"
            />
          </div>

          {/* GFI Outlets */}
          <div className="space-y-1 w-[80px]">
            <Label className="text-xs text-muted-foreground">GFI Outlets</Label>
            <Input
              type="number"
              min="0"
              placeholder="QTY"
              value={electrical.gfiOutlets || ""}
              onChange={(e) => onChange({ gfiOutlets: parseInt(e.target.value) || 0 })}
              className="border-border/60 bg-secondary/50"
            />
          </div>

          {/* Light Switches */}
          <div className="space-y-1 w-[80px]">
            <Label className="text-xs text-muted-foreground">Light Switches</Label>
            <Input
              type="number"
              min="0"
              placeholder="QTY"
              value={electrical.lightSwitches || ""}
              onChange={(e) => onChange({ lightSwitches: parseInt(e.target.value) || 0 })}
              className="border-border/60 bg-secondary/50"
            />
          </div>

          {/* Ceiling Lights */}
          <div className="space-y-1 w-[80px]">
            <Label className="text-xs text-muted-foreground">Ceiling Lights</Label>
            <Input
              type="number"
              min="0"
              placeholder="QTY"
              value={electrical.ceilingLights || ""}
              onChange={(e) => onChange({ ceilingLights: parseInt(e.target.value) || 0 })}
              className="border-border/60 bg-secondary/50"
            />
          </div>

          {/* Ceiling Fans */}
          <div className="space-y-1 w-[80px]">
            <Label className="text-xs text-muted-foreground">Ceiling Fans</Label>
            <Input
              type="number"
              min="0"
              placeholder="QTY"
              value={electrical.ceilingFans || ""}
              onChange={(e) => onChange({ ceilingFans: parseInt(e.target.value) || 0 })}
              className="border-border/60 bg-secondary/50"
            />
          </div>

          {/* Bathroom Light Bar */}
          <div className="space-y-1 min-w-[130px]">
            <Label className="text-xs text-muted-foreground">Bathroom Light Bar</Label>
            <Select value={electrical.bathroomLightBar} onValueChange={(v) => onChange({ bathroomLightBar: nv(v) })}>
              <SelectTrigger className="border-border/60 bg-secondary/50">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                <SelectItem value="1">1 light</SelectItem>
                <SelectItem value="2">2 light</SelectItem>
                <SelectItem value="3">3 light</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bathroom Light Bar Qty */}
          <div className="space-y-1 w-[80px]">
            <Input
              type="number"
              min="0"
              placeholder="QTY"
              value={electrical.bathroomLightBarQty || ""}
              onChange={(e) => onChange({ bathroomLightBarQty: parseInt(e.target.value) || 0 })}
              className="border-border/60 bg-secondary/50"
            />
          </div>
        </div>
      )}
    </div>
  )
}
