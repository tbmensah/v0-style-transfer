"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { NFIPCleaningOptions } from "../types"

interface NFIPCleaningSectionProps {
  nfipCleaning: NFIPCleaningOptions
  onChange: (updates: Partial<NFIPCleaningOptions>) => void
}

export function NFIPCleaningSection({ nfipCleaning, onChange }: NFIPCleaningSectionProps) {
  const updateWall = (wallUpdates: Partial<NFIPCleaningOptions["wall"]>) => {
    onChange({ wall: { ...nfipCleaning.wall, ...wallUpdates } })
  }

  const updateFloor = (floorUpdates: Partial<NFIPCleaningOptions["floor"]>) => {
    onChange({ floor: { ...nfipCleaning.floor, ...floorUpdates } })
  }

  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <div className="flex items-center gap-3">
        <Switch
          checked={nfipCleaning.enabled}
          onCheckedChange={(checked) => onChange({ enabled: checked })}
        />
        <Label className="font-medium">NFIP Cleaning</Label>
      </div>
      {nfipCleaning.enabled && (
        <div className="flex flex-wrap items-center gap-6">
          {/* Wall Cleaning */}
          <div className="flex items-center gap-3 border-r border-border/40 pr-6">
            <Label className="text-sm text-muted-foreground">Wall:</Label>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Height</Label>
              <Input
                placeholder="ft"
                value={nfipCleaning.wall.height}
                onChange={(e) => updateWall({ height: e.target.value })}
                className="w-[60px] border-border/60 bg-secondary/50"
              />
            </div>
            {/* Wall Type Radios */}
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="wall-block"
                checked={nfipCleaning.wall.wallType === "block"}
                onChange={() => updateWall({ wallType: "block" })}
                className="h-4 w-4"
              />
              <label htmlFor="wall-block" className="text-sm">Block</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="wall-stud"
                checked={nfipCleaning.wall.wallType === "stud"}
                onChange={() => updateWall({ wallType: "stud" })}
                className="h-4 w-4"
              />
              <label htmlFor="wall-stud" className="text-sm">Stud</label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={nfipCleaning.wall.ceilingAffected}
                onCheckedChange={(checked) => updateWall({ ceilingAffected: checked })}
              />
              <Label className="text-sm">Ceiling</Label>
            </div>
          </div>

          {/* Floor Cleaning */}
          <div className="flex items-center gap-3">
            <Label className="text-sm text-muted-foreground">Floor:</Label>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="floor-muck-out"
                checked={nfipCleaning.floor.type === "muck-out"}
                onChange={() => updateFloor({ type: "muck-out" })}
                className="h-4 w-4"
              />
              <label htmlFor="floor-muck-out" className="text-sm">Muck Out</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="floor-muck-heavy"
                checked={nfipCleaning.floor.type === "muck-heavy"}
                onChange={() => updateFloor({ type: "muck-heavy" })}
                className="h-4 w-4"
              />
              <label htmlFor="floor-muck-heavy" className="text-sm">Muck Heavy</label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={nfipCleaning.floor.areaOnCrawlspace}
                onCheckedChange={(checked) => updateFloor({ areaOnCrawlspace: checked })}
              />
              <Label className="text-sm">Crawlspace</Label>
            </div>
          </div>
        </div>
      )}
      {nfipCleaning.enabled && (
        <p className="text-xs text-amber-500">Note: Section includes standard method 1 SF drycut.</p>
      )}
      {nfipCleaning.enabled && nfipCleaning.floor.type === "muck-heavy" && (
        <p className="text-xs text-amber-500">Note: NFIP requires photos of standing mud to endorse for heavy Muck</p>
      )}
    </div>
  )
}
