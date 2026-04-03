"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WallCoveringOptions } from "../types"

interface WallCoveringSectionProps {
  wallCovering: WallCoveringOptions
  onChange: (updates: Partial<WallCoveringOptions>) => void
}

export function WallCoveringSection({ wallCovering, onChange }: WallCoveringSectionProps) {
  const nv = (v: string) => v === "__none__" ? "" : v

  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <div className="flex items-center gap-3">
        <Switch
          checked={wallCovering.enabled}
          onCheckedChange={(checked) => onChange({ enabled: checked })}
        />
        <Label className="font-medium">Wall Covering</Label>
      </div>
      {wallCovering.enabled && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-end gap-4">
            {/* Material */}
            <div className="space-y-1 min-w-[140px]">
              <Label className="text-xs text-muted-foreground">Material</Label>
              <Select 
                value={wallCovering.material} 
                onValueChange={(v) => onChange({ material: nv(v), type: "", replacementHeight: "" })}
              >
                <SelectTrigger className="border-border/60 bg-secondary/50">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                  <SelectItem value="drywall-sf">Drywall (SF)</SelectItem>
                  <SelectItem value="drywall-lf">Drywall (LF)</SelectItem>
                  <SelectItem value="plaster">Plaster</SelectItem>
                  <SelectItem value="paneling">Paneling</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type - conditional based on material */}
            {wallCovering.material && (
              <div className="space-y-1 min-w-[200px]">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <Select value={wallCovering.type} onValueChange={(v) => onChange({ type: nv(v) })}>
                  <SelectTrigger className="border-border/60 bg-secondary/50">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                    {wallCovering.material === "drywall-sf" && (
                      <>
                        <SelectItem value="1/2-sf">1/2 - Drywall</SelectItem>
                        <SelectItem value="5/8-sf">5/8 - Drywall</SelectItem>
                        <SelectItem value="water-resistant">Water Resistant Drywall</SelectItem>
                      </>
                    )}
                    {wallCovering.material === "drywall-lf" && (
                      <>
                        <SelectItem value="1/2-lf-4ft">1/2 - Drywall Per LF - up to 4&apos; tall</SelectItem>
                        <SelectItem value="5/8-lf-4ft">5/8 Drywall Per LF - up to 4&apos; tall</SelectItem>
                      </>
                    )}
                    {wallCovering.material === "plaster" && (
                      <>
                        <SelectItem value="two-coat-no-lath">Two Coat Plaster (No Lath)</SelectItem>
                        <SelectItem value="acoustic-1/2-blueboard">Acoustic Plaster Over 1/2 Gypsum Core Blueboard</SelectItem>
                        <SelectItem value="acoustic-5/8-blueboard">Acoustic Plaster Over 5/8 Gypsum Core Blueboard</SelectItem>
                        <SelectItem value="acoustic-1/2-metal-lath">Acoustic Plaster Over 1/2 Metal Lath</SelectItem>
                      </>
                    )}
                    {wallCovering.material === "paneling" && (
                      <>
                        <SelectItem value="paneling">Paneling</SelectItem>
                        <SelectItem value="paneling-standard">Paneling - Standard Grade</SelectItem>
                        <SelectItem value="paneling-high">Paneling High Grade</SelectItem>
                        <SelectItem value="paneling-premium">Paneling Premium Grade</SelectItem>
                        <SelectItem value="paneling-mobile-home">Paneling - Mobile Home</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Replacement Height - conditional based on material */}
            {wallCovering.material && wallCovering.material !== "paneling" && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Replacement Height</Label>
                <Select value={wallCovering.replacementHeight} onValueChange={(v) => onChange({ replacementHeight: nv(v) })}>
                  <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                    {wallCovering.material === "drywall-sf" && (
                      <>
                        <SelectItem value="0.5W">0.5W</SelectItem>
                        <SelectItem value="W">W</SelectItem>
                      </>
                    )}
                    {wallCovering.material === "drywall-lf" && (
                      <>
                        <SelectItem value="PF">PF</SelectItem>
                        <SelectItem value="PFx2">PFx2</SelectItem>
                      </>
                    )}
                    {wallCovering.material === "plaster" && (
                      <>
                        <SelectItem value="0.25W">0.25W</SelectItem>
                        <SelectItem value="0.5W">0.5W</SelectItem>
                        <SelectItem value="0.75W">0.75W</SelectItem>
                        <SelectItem value="W">W</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Texture toggle */}
            <div className="flex items-center gap-2 pb-1">
              <Switch
                checked={wallCovering.texture}
                onCheckedChange={(checked) => onChange({ texture: checked })}
              />
              <Label className="text-sm">Texture</Label>
            </div>
            {wallCovering.texture && (
              <div className="space-y-1">
                <Select value={wallCovering.textureType} onValueChange={(v) => onChange({ textureType: nv(v) })}>
                  <SelectTrigger className="w-[160px] border-border/60 bg-secondary/50">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                    <SelectItem value="smooth">Smooth</SelectItem>
                    <SelectItem value="hand-texture">Hand texture</SelectItem>
                    <SelectItem value="machine-texture">Machine texture</SelectItem>
                    <SelectItem value="heavy-texture">Heavy texture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <p className="text-xs text-amber-500">Note: Some carriers require drywall calculated in SF instead of LF, please check with current guidelines of carriers</p>
        </div>
      )}
    </div>
  )
}
