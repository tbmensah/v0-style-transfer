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

          {/* Cooktop */}
          <Collapsible>
            <CollapsibleTrigger className="group flex w-full items-center justify-between rounded border border-border/40 p-2 hover:bg-secondary/30">
              <div className="flex items-center gap-2">
                <Switch
                  checked={appliances.cooktop.enabled}
                  onCheckedChange={(checked) => onUpdate({ cooktop: { ...appliances.cooktop, enabled: checked } })}
                  onClick={(e) => e.stopPropagation()}
                />
                <Label className="text-sm">Cooktop</Label>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pl-4">
              {appliances.cooktop.enabled && (
                <div className="flex flex-wrap gap-2">
                  <Select value={appliances.cooktop.type} onValueChange={(v) => onUpdate({ cooktop: { ...appliances.cooktop, type: nv(v) } })}>
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
                  <Select value={appliances.cooktop.grade} onValueChange={(v) => onUpdate({ cooktop: { ...appliances.cooktop, grade: nv(v) } })}>
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
                  <Select value={appliances.cooktop.action} onValueChange={(v) => onUpdate({ cooktop: { ...appliances.cooktop, action: nv(v) } })}>
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
                    value={appliances.cooktop.f9Note}
                    onChange={(e) => onUpdate({ cooktop: { ...appliances.cooktop, f9Note: e.target.value } })}
                    className="w-[120px] h-8 text-sm border-border/60 bg-secondary/50"
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Wall Oven */}
          <Collapsible>
            <CollapsibleTrigger className="group flex w-full items-center justify-between rounded border border-border/40 p-2 hover:bg-secondary/30">
              <div className="flex items-center gap-2">
                <Switch
                  checked={appliances.wallOven.enabled}
                  onCheckedChange={(checked) => onUpdate({ wallOven: { ...appliances.wallOven, enabled: checked } })}
                  onClick={(e) => e.stopPropagation()}
                />
                <Label className="text-sm">Wall Oven</Label>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pl-4">
              {appliances.wallOven.enabled && (
                <div className="flex flex-wrap gap-2">
                  <Select value={appliances.wallOven.type} onValueChange={(v) => onUpdate({ wallOven: { ...appliances.wallOven, type: nv(v) } })}>
                    <SelectTrigger className="w-[100px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="microwave-combo">Microwave Combo</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={appliances.wallOven.grade} onValueChange={(v) => onUpdate({ wallOven: { ...appliances.wallOven, grade: nv(v) } })}>
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
                  <Select value={appliances.wallOven.action} onValueChange={(v) => onUpdate({ wallOven: { ...appliances.wallOven, action: nv(v) } })}>
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
                    value={appliances.wallOven.f9Note}
                    onChange={(e) => onUpdate({ wallOven: { ...appliances.wallOven, f9Note: e.target.value } })}
                    className="w-[120px] h-8 text-sm border-border/60 bg-secondary/50"
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Air Handler */}
          <Collapsible>
            <CollapsibleTrigger className="group flex w-full items-center justify-between rounded border border-border/40 p-2 hover:bg-secondary/30">
              <div className="flex items-center gap-2">
                <Switch
                  checked={appliances.airHandler.enabled}
                  onCheckedChange={(checked) => onUpdate({ airHandler: { ...appliances.airHandler, enabled: checked } })}
                  onClick={(e) => e.stopPropagation()}
                />
                <Label className="text-sm">Air Handler</Label>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pl-4">
              {appliances.airHandler.enabled && (
                <div className="flex flex-wrap gap-2">
                  <Select value={appliances.airHandler.type} onValueChange={(v) => onUpdate({ airHandler: { ...appliances.airHandler, type: nv(v) } })}>
                    <SelectTrigger className="w-[140px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="gas">Gas</SelectItem>
                      <SelectItem value="heat-pump">Heat Pump</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={appliances.airHandler.options} onValueChange={(v) => onUpdate({ airHandler: { ...appliances.airHandler, options: nv(v) } })}>
                    <SelectTrigger className="w-[140px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Options" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="upflow">Upflow</SelectItem>
                      <SelectItem value="downflow">Downflow</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={appliances.airHandler.action} onValueChange={(v) => onUpdate({ airHandler: { ...appliances.airHandler, action: nv(v) } })}>
                    <SelectTrigger className="w-[110px] h-8 text-sm border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="replace">Replace</SelectItem>
                      <SelectItem value="detach-reset">Detach &amp; Reset</SelectItem>
                      <SelectItem value="service-call">Service Call</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="F9 Note"
                    value={appliances.airHandler.f9Note}
                    onChange={(e) => onUpdate({ airHandler: { ...appliances.airHandler, f9Note: e.target.value } })}
                    className="flex-1 min-w-[150px] h-8 text-sm border-border/60 bg-secondary/50"
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Boiler */}
          <Collapsible>
            <CollapsibleTrigger className="group flex w-full items-center justify-between rounded border border-border/40 p-2 hover:bg-secondary/30">
              <div className="flex items-center gap-2">
                <Switch
                  checked={appliances.boiler.enabled}
                  onCheckedChange={(checked) => onUpdate({ boiler: { ...appliances.boiler, enabled: checked } })}
                  onClick={(e) => e.stopPropagation()}
                />
                <Label className="text-sm">Boiler</Label>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pl-4">
              {appliances.boiler.enabled && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Select value={appliances.boiler.type} onValueChange={(v) => onUpdate({ boiler: { ...appliances.boiler, type: nv(v) } })}>
                      <SelectTrigger className="w-[120px] h-8 text-sm border-border/60 bg-secondary/50">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                        <SelectItem value="natural-gas">Natural Gas</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="oil-fired">Oil fired</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={appliances.boiler.action} onValueChange={(v) => onUpdate({ boiler: { ...appliances.boiler, action: nv(v) } })}>
                      <SelectTrigger className="w-[140px] h-8 text-sm border-border/60 bg-secondary/50">
                        <SelectValue placeholder="Action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                        <SelectItem value="detach-reset">Detach &amp; Reset</SelectItem>
                        <SelectItem value="replace">Replace</SelectItem>
                        <SelectItem value="service-call">Service Call</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={appliances.boiler.expansionTank}
                        onCheckedChange={(checked) => onUpdate({ boiler: { ...appliances.boiler, expansionTank: checked } })}
                      />
                      <Label className="text-sm whitespace-nowrap">Expansion Tank</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={appliances.boiler.circulatorPump}
                        onCheckedChange={(checked) => onUpdate({ boiler: { ...appliances.boiler, circulatorPump: checked } })}
                      />
                      <Label className="text-sm whitespace-nowrap">Circulator pump</Label>
                    </div>
                  </div>
                  <Input
                    placeholder="F9 Note"
                    value={appliances.boiler.f9Note}
                    onChange={(e) => onUpdate({ boiler: { ...appliances.boiler, f9Note: e.target.value } })}
                    className="w-full h-8 text-sm border-border/60 bg-secondary/50"
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
