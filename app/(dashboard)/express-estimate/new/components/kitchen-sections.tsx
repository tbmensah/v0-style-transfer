"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CabinetOptions, CountertopOptions, PlumbingOptions } from "../types"

// Helper for select value normalization
const nv = (v: string) => v === "__none__" ? "" : v

interface CabinetrySectionProps {
  cabinets: CabinetOptions
  onUpdate: (cabinets: Partial<CabinetOptions>) => void
}

export function CabinetrySection({ cabinets, onUpdate }: CabinetrySectionProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <Label className="font-medium">Cabinetry</Label>
      <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Size</Label>
          <Select value={cabinets.size} onValueChange={(v) => onUpdate({ size: nv(v) })}>
            <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={String(num)}>{num} LF</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Grade</Label>
          <Select value={cabinets.grade} onValueChange={(v) => onUpdate({ grade: nv(v) })}>
            <SelectTrigger className="w-[110px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="high">High Grade</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 pb-1">
          <Switch
            checked={cabinets.detachAndReset}
            onCheckedChange={(checked) => onUpdate({ detachAndReset: checked })}
          />
          <Label className="text-xs whitespace-nowrap">Detach and reset</Label>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Toe Kick</Label>
          <Select value={cabinets.toeKick.size} onValueChange={(v) => onUpdate({ toeKick: { ...cabinets.toeKick, size: nv(v) } })}>
            <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={String(num)}>{num} LF</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Backsplash and additional options */}
      <div className="flex flex-wrap items-end gap-x-3 gap-y-2 pt-2 border-t border-border/30">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Backsplash</Label>
          <Select value={cabinets.toeKick.backSplash} onValueChange={(v) => onUpdate({ toeKick: { ...cabinets.toeKick, backSplash: nv(v) } })}>
            <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={String(num)}>{num} SF</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Grade</Label>
          <Select value={cabinets.toeKick.grade} onValueChange={(v) => onUpdate({ toeKick: { ...cabinets.toeKick, grade: nv(v) } })}>
            <SelectTrigger className="w-[110px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="high">High Grade</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 pb-1">
          <Switch
            checked={cabinets.toeKick.glass}
            onCheckedChange={(checked) => onUpdate({ toeKick: { ...cabinets.toeKick, glass: checked } })}
          />
          <Label className="text-xs">Glass</Label>
        </div>
        <div className="flex items-center gap-2 pb-1">
          <Switch
            checked={cabinets.toeKick.diagonalInstallation}
            onCheckedChange={(checked) => onUpdate({ toeKick: { ...cabinets.toeKick, diagonalInstallation: checked } })}
          />
          <Label className="text-xs whitespace-nowrap">Diagonal Installation</Label>
        </div>
      </div>
    </div>
  )
}

interface CountertopSectionProps {
  countertop: CountertopOptions
  onUpdate: (countertop: Partial<CountertopOptions>) => void
}

export function CountertopSection({ countertop, onUpdate }: CountertopSectionProps) {
  const sizeUnit = countertop.type === "cultured-marble" || countertop.type === "laminate" ? "LF" : "SF"
  
  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <Label className="font-medium">Countertop</Label>
      <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Type</Label>
          <Select value={countertop.type} onValueChange={(v) => onUpdate({ type: nv(v) })}>
            <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              <SelectItem value="cultured-marble">Cultured Marble</SelectItem>
              <SelectItem value="laminate">Laminate</SelectItem>
              <SelectItem value="granite">Granite</SelectItem>
              <SelectItem value="quartz">Quartz</SelectItem>
              <SelectItem value="solid-surface">Solid Surface</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Grade</Label>
          <Select value={countertop.grade} onValueChange={(v) => onUpdate({ grade: nv(v) })}>
            <SelectTrigger className="w-[110px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="high">High Grade</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Size ({sizeUnit})</Label>
          <Select value={countertop.size} onValueChange={(v) => onUpdate({ size: nv(v) })}>
            <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={String(num)}>{num} {sizeUnit}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 pb-1">
          <Switch
            checked={countertop.detachAndReset}
            onCheckedChange={(checked) => onUpdate({ detachAndReset: checked })}
          />
          <Label className="text-xs whitespace-nowrap">Detach and reset</Label>
        </div>
      </div>
    </div>
  )
}

interface PlumbingSectionProps {
  plumbing: PlumbingOptions
  onUpdate: (plumbing: Partial<PlumbingOptions>) => void
}

export function PlumbingSection({ plumbing, onUpdate }: PlumbingSectionProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <Label className="font-medium">Plumbing</Label>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2">
          <Switch
            checked={plumbing.replaceFaucetSink}
            onCheckedChange={(checked) => onUpdate({ replaceFaucetSink: checked })}
          />
          <Label className="text-sm">Replace Faucet/Sink</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={plumbing.drFaucetSink}
            onCheckedChange={(checked) => onUpdate({ drFaucetSink: checked })}
          />
          <Label className="text-sm">D&amp;R Faucet/Sink</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={plumbing.waterSupplyLine.enabled}
            onCheckedChange={(checked) => onUpdate({ waterSupplyLine: { ...plumbing.waterSupplyLine, enabled: checked } })}
          />
          <Label className="text-sm">Water Supply Line</Label>
          {plumbing.waterSupplyLine.enabled && (
            <Select value={plumbing.waterSupplyLine.qty} onValueChange={(v) => onUpdate({ waterSupplyLine: { ...plumbing.waterSupplyLine, qty: nv(v) } })}>
              <SelectTrigger className="w-[80px] h-8 text-sm border-border/60 bg-secondary/50">
                <SelectValue placeholder="Qty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Reverse Osmosis */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 border-t border-border/30">
        <div className="flex items-center gap-2">
          <Switch
            checked={plumbing.reverseOsmosis.enabled}
            onCheckedChange={(checked) => onUpdate({ reverseOsmosis: { ...plumbing.reverseOsmosis, enabled: checked } })}
          />
          <Label className="text-sm">Reverse Osmosis</Label>
        </div>
        {plumbing.reverseOsmosis.enabled && (
          <>
            <Select value={plumbing.reverseOsmosis.action} onValueChange={(v) => onUpdate({ reverseOsmosis: { ...plumbing.reverseOsmosis, action: nv(v) } })}>
              <SelectTrigger className="w-[110px] h-8 text-sm border-border/60 bg-secondary/50">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                <SelectItem value="replace">Replace</SelectItem>
                <SelectItem value="detach-reset">Detach &amp; Reset</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="F9 Note"
              value={plumbing.reverseOsmosis.f9Note}
              onChange={(e) => onUpdate({ reverseOsmosis: { ...plumbing.reverseOsmosis, f9Note: e.target.value } })}
              className="w-[120px] h-8 text-sm border-border/60 bg-secondary/50"
            />
          </>
        )}
      </div>

      {/* Garbage Disposal */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 border-t border-border/30">
        <div className="flex items-center gap-2">
          <Switch
            checked={plumbing.garbageDisposal.enabled}
            onCheckedChange={(checked) => onUpdate({ garbageDisposal: { ...plumbing.garbageDisposal, enabled: checked } })}
          />
          <Label className="text-sm">Garbage Disposal</Label>
        </div>
        {plumbing.garbageDisposal.enabled && (
          <>
            <Select value={plumbing.garbageDisposal.action} onValueChange={(v) => onUpdate({ garbageDisposal: { ...plumbing.garbageDisposal, action: nv(v) } })}>
              <SelectTrigger className="w-[110px] h-8 text-sm border-border/60 bg-secondary/50">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                <SelectItem value="replace">Replace</SelectItem>
                <SelectItem value="detach-reset">Detach &amp; Reset</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="F9 Note"
              value={plumbing.garbageDisposal.f9Note}
              onChange={(e) => onUpdate({ garbageDisposal: { ...plumbing.garbageDisposal, f9Note: e.target.value } })}
              className="w-[120px] h-8 text-sm border-border/60 bg-secondary/50"
            />
          </>
        )}
      </div>
    </div>
  )
}
