"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import type { ApplianceOptions } from "../types"

// Helper for select value normalization
const nv = (v: string) => v === "__none__" ? "" : v

interface AppliancesSectionProps {
  appliances: ApplianceOptions
  onUpdate: (appliances: Partial<ApplianceOptions>) => void
}

export function AppliancesSection({ appliances, onUpdate }: AppliancesSectionProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <div className="flex items-center gap-3">
        <Switch
          checked={appliances.enabled}
          onCheckedChange={(checked) => onUpdate({ enabled: checked })}
        />
        <Label className="font-medium">Appliances</Label>
      </div>

      {appliances.enabled && (
        <div className="space-y-3 pt-2">
          {/* Refrigerator */}
          <Collapsible>
            <CollapsibleTrigger className="group flex w-full items-center justify-between rounded border border-border/40 p-2 hover:bg-secondary/30">
              <div className="flex items-center gap-2">
                <Switch
                  checked={appliances.refrigerator.enabled}
                  onCheckedChange={(checked) => onUpdate({ refrigerator: { ...appliances.refrigerator, enabled: checked } })}
                  onClick={(e) => e.stopPropagation()}
                />
                <Label className="text-sm">Refrigerator</Label>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pl-4">
              {appliances.refrigerator.enabled && (
                <div className="flex flex-wrap gap-2">
                  <Select value={appliances.refrigerator.type} onValueChange={(v) => onUpdate({ refrigerator: { ...appliances.refrigerator, type: nv(v) } })}>
                    <SelectTrigger className="w-[120px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="top-freezer">Top Freezer</SelectItem>
                      <SelectItem value="bottom-freezer">Bottom Freezer</SelectItem>
                      <SelectItem value="side-by-side">Side by Side</SelectItem>
                      <SelectItem value="french-door">French Door</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={appliances.refrigerator.size} onValueChange={(v) => onUpdate({ refrigerator: { ...appliances.refrigerator, size: nv(v) } })}>
                    <SelectTrigger className="w-[100px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="18">18 cu ft</SelectItem>
                      <SelectItem value="21">21 cu ft</SelectItem>
                      <SelectItem value="25">25 cu ft</SelectItem>
                      <SelectItem value="28">28 cu ft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={appliances.refrigerator.grade} onValueChange={(v) => onUpdate({ refrigerator: { ...appliances.refrigerator, grade: nv(v) } })}>
                    <SelectTrigger className="w-[100px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High Grade</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={appliances.refrigerator.action} onValueChange={(v) => onUpdate({ refrigerator: { ...appliances.refrigerator, action: nv(v) } })}>
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
                    value={appliances.refrigerator.f9Note}
                    onChange={(e) => onUpdate({ refrigerator: { ...appliances.refrigerator, f9Note: e.target.value } })}
                    className="w-[120px] h-8 text-sm border-border/60 bg-secondary/50"
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Dishwasher */}
          <Collapsible>
            <CollapsibleTrigger className="group flex w-full items-center justify-between rounded border border-border/40 p-2 hover:bg-secondary/30">
              <div className="flex items-center gap-2">
                <Switch
                  checked={appliances.dishwasher.enabled}
                  onCheckedChange={(checked) => onUpdate({ dishwasher: { ...appliances.dishwasher, enabled: checked } })}
                  onClick={(e) => e.stopPropagation()}
                />
                <Label className="text-sm">Dishwasher</Label>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pl-4">
              {appliances.dishwasher.enabled && (
                <div className="flex flex-wrap gap-2">
                  <Select value={appliances.dishwasher.grade} onValueChange={(v) => onUpdate({ dishwasher: { ...appliances.dishwasher, grade: nv(v) } })}>
                    <SelectTrigger className="w-[100px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High Grade</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={appliances.dishwasher.action} onValueChange={(v) => onUpdate({ dishwasher: { ...appliances.dishwasher, action: nv(v) } })}>
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
                    value={appliances.dishwasher.f9Note}
                    onChange={(e) => onUpdate({ dishwasher: { ...appliances.dishwasher, f9Note: e.target.value } })}
                    className="w-[120px] h-8 text-sm border-border/60 bg-secondary/50"
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Range */}
          <Collapsible>
            <CollapsibleTrigger className="group flex w-full items-center justify-between rounded border border-border/40 p-2 hover:bg-secondary/30">
              <div className="flex items-center gap-2">
                <Switch
                  checked={appliances.range.enabled}
                  onCheckedChange={(checked) => onUpdate({ range: { ...appliances.range, enabled: checked } })}
                  onClick={(e) => e.stopPropagation()}
                />
                <Label className="text-sm">Range</Label>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pl-4">
              {appliances.range.enabled && (
                <div className="flex flex-wrap gap-2">
                  <Select value={appliances.range.type} onValueChange={(v) => onUpdate({ range: { ...appliances.range, type: nv(v) } })}>
                    <SelectTrigger className="w-[100px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="gas">Gas</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="induction">Induction</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={appliances.range.options} onValueChange={(v) => onUpdate({ range: { ...appliances.range, options: nv(v) } })}>
                    <SelectTrigger className="w-[120px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Options" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="freestanding">Freestanding</SelectItem>
                      <SelectItem value="slide-in">Slide-in</SelectItem>
                      <SelectItem value="drop-in">Drop-in</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={appliances.range.grade} onValueChange={(v) => onUpdate({ range: { ...appliances.range, grade: nv(v) } })}>
                    <SelectTrigger className="w-[100px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High Grade</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={appliances.range.action} onValueChange={(v) => onUpdate({ range: { ...appliances.range, action: nv(v) } })}>
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
                    value={appliances.range.f9Note}
                    onChange={(e) => onUpdate({ range: { ...appliances.range, f9Note: e.target.value } })}
                    className="w-[120px] h-8 text-sm border-border/60 bg-secondary/50"
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Water Heater */}
          <Collapsible>
            <CollapsibleTrigger className="group flex w-full items-center justify-between rounded border border-border/40 p-2 hover:bg-secondary/30">
              <div className="flex items-center gap-2">
                <Switch
                  checked={appliances.waterHeater.enabled}
                  onCheckedChange={(checked) => onUpdate({ waterHeater: { ...appliances.waterHeater, enabled: checked } })}
                  onClick={(e) => e.stopPropagation()}
                />
                <Label className="text-sm">Water Heater</Label>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pl-4">
              {appliances.waterHeater.enabled && (
                <div className="flex flex-wrap gap-2">
                  <Select value={appliances.waterHeater.type} onValueChange={(v) => onUpdate({ waterHeater: { ...appliances.waterHeater, type: nv(v) } })}>
                    <SelectTrigger className="w-[100px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="tank">Tank</SelectItem>
                      <SelectItem value="tankless">Tankless</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={appliances.waterHeater.size} onValueChange={(v) => onUpdate({ waterHeater: { ...appliances.waterHeater, size: nv(v) } })}>
                    <SelectTrigger className="w-[100px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="30">30 gal</SelectItem>
                      <SelectItem value="40">40 gal</SelectItem>
                      <SelectItem value="50">50 gal</SelectItem>
                      <SelectItem value="75">75 gal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={appliances.waterHeater.rating} onValueChange={(v) => onUpdate({ waterHeater: { ...appliances.waterHeater, rating: nv(v) } })}>
                    <SelectTrigger className="w-[100px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="gas">Gas</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={appliances.waterHeater.action} onValueChange={(v) => onUpdate({ waterHeater: { ...appliances.waterHeater, action: nv(v) } })}>
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
                    value={appliances.waterHeater.f9Note}
                    onChange={(e) => onUpdate({ waterHeater: { ...appliances.waterHeater, f9Note: e.target.value } })}
                    className="w-[120px] h-8 text-sm border-border/60 bg-secondary/50"
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  )
}
