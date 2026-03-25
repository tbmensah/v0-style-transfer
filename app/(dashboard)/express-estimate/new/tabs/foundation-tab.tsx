"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Plus, Trash2, Droplets, Wind, Zap, Home } from "lucide-react"
import type { FoundationState } from "../types"

interface FoundationTabProps {
  foundation: FoundationState
  updateFoundation: <K extends keyof FoundationState>(key: K, value: FoundationState[K]) => void
  handleSave: () => void
}

export function FoundationTab({ foundation, updateFoundation, handleSave }: FoundationTabProps) {
  const setFoundation = (updates: Partial<FoundationState>) => {
    Object.entries(updates).forEach(([key, value]) => {
      updateFoundation(key as keyof FoundationState, value as FoundationState[keyof FoundationState])
    })
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Crawlspace / PFE Enclosure */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center gap-3">
            <Droplets className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Crawlspace / PFE Enclosure</span>
            {foundation.crawlspace.enabled && <Badge variant="secondary" className="text-xs">Saved</Badge>}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={foundation.crawlspace.enabled}
                  onCheckedChange={(checked) => { setFoundation({ crawlspace: { ...foundation.crawlspace, enabled: checked } }); handleSave() }}
                />
                <Label>Enable Crawlspace/Enclosure area</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={foundation.crawlspace.acControlledSpace}
                  onCheckedChange={(checked) => { setFoundation({ crawlspace: { ...foundation.crawlspace, acControlledSpace: checked } }); handleSave() }}
                />
                <Label className="text-sm">AC Controlled Space</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={foundation.crawlspace.heavyCleanArea}
                  onCheckedChange={(checked) => { setFoundation({ crawlspace: { ...foundation.crawlspace, heavyCleanArea: checked } }); handleSave() }}
                />
                <Label className="text-sm">Heavy Clean Area</Label>
              </div>
            </div>
            {foundation.crawlspace.enabled && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Foundation Wall Clean (PF)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Perimeter feet"
                      value={foundation.crawlspace.perimeterFeet}
                      onChange={(e) => { setFoundation({ crawlspace: { ...foundation.crawlspace, perimeterFeet: e.target.value.replace(/^0+/, '') } }); handleSave() }}
                      className="border-border/60 bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label># of Piers</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={foundation.crawlspace.piersCount}
                      onChange={(e) => { setFoundation({ crawlspace: { ...foundation.crawlspace, piersCount: e.target.value.replace(/^0+/, '') || "" } }); handleSave() }}
                      className="border-border/60 bg-secondary/50"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={foundation.crawlspace.piersType === "short"}
                        onChange={() => { setFoundation({ crawlspace: { ...foundation.crawlspace, piersType: "short" } }); handleSave() }}
                        className="h-4 w-4"
                      />
                      <Label className="text-sm">Short Piers</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={foundation.crawlspace.piersType === "tall"}
                        onChange={() => { setFoundation({ crawlspace: { ...foundation.crawlspace, piersType: "tall" } }); handleSave() }}
                        className="h-4 w-4"
                      />
                      <Label className="text-sm">Tall Piers</Label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={foundation.crawlspace.cleanJoist}
                    onCheckedChange={(checked) => { setFoundation({ crawlspace: { ...foundation.crawlspace, cleanJoist: checked } }); handleSave() }}
                  />
                  <Label className="text-sm">Clean Joist</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={foundation.crawlspace.preFirm}
                    onCheckedChange={(checked) => { setFoundation({ crawlspace: { ...foundation.crawlspace, preFirm: checked } }); handleSave() }}
                  />
                  <Label className="text-sm">Pre-FIRM</Label>
                </div>
                {foundation.crawlspace.preFirm && (
                  <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 space-y-3">
                    <p className="text-sm font-medium text-foreground">Pre-FIRM Options</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={foundation.crawlspace.bellyPaper}
                          onCheckedChange={(checked) => { setFoundation({ crawlspace: { ...foundation.crawlspace, bellyPaper: checked } }); handleSave() }}
                        />
                        <Label className="text-sm">Belly Paper</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={foundation.crawlspace.floorInsulation}
                          onCheckedChange={(checked) => { setFoundation({ crawlspace: { ...foundation.crawlspace, floorInsulation: checked } }); handleSave() }}
                        />
                        <Label className="text-sm">Floor Insulation</Label>
                      </div>
                      {foundation.crawlspace.floorInsulation && (
                        <Select value={foundation.crawlspace.floorInsulationType} onValueChange={(value) => { setFoundation({ crawlspace: { ...foundation.crawlspace, floorInsulationType: value } }); handleSave() }}>
                          <SelectTrigger className="w-36 border-border/60 bg-secondary/50">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spray-foam">Spray Foam</SelectItem>
                            <SelectItem value="r13">R-13</SelectItem>
                            <SelectItem value="r19">R-19</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={foundation.crawlspace.muck}
                      onCheckedChange={(checked) => { setFoundation({ crawlspace: { ...foundation.crawlspace, muck: checked, muckHeavy: checked ? false : foundation.crawlspace.muckHeavy } }); handleSave() }}
                    />
                    <Label className="text-sm">Water Muck</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={foundation.crawlspace.muckHeavy}
                      onCheckedChange={(checked) => { setFoundation({ crawlspace: { ...foundation.crawlspace, muckHeavy: checked, muck: checked ? false : foundation.crawlspace.muck } }); handleSave() }}
                    />
                    <Label className="text-sm">Water Muck Heavy</Label>
                  </div>
                </div>
                {foundation.crawlspace.muckHeavy && (
                  <p className="text-xs text-amber-500">Note: NFIP requires photos of standing mud to endorse for heavy Muck</p>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={foundation.crawlspace.standingWater}
                      onCheckedChange={(checked) => { setFoundation({ crawlspace: { ...foundation.crawlspace, standingWater: checked } }); handleSave() }}
                    />
                    <Label className="text-sm">Standing Water</Label>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">House Rewire</Label>
                    <Input
                      type="text"
                      placeholder="enter home SF..."
                      value={foundation.crawlspace.houseRewire}
                      onChange={(e) => { setFoundation({ crawlspace: { ...foundation.crawlspace, houseRewire: e.target.value } }); handleSave() }}
                      className="w-32 border-border/60 bg-secondary/50"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Enclosure Removal Items */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Enclosure Removal Items</span>
            {(foundation.enclosureRemoval.sandRemoval.enabled || foundation.enclosureRemoval.backfill.enabled) && <Badge variant="secondary" className="text-xs">Saved</Badge>}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
          <div className="space-y-4">
            {/* Sand/Mud Removal */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={foundation.enclosureRemoval.sandRemoval.enabled}
                  onCheckedChange={(checked) => { setFoundation({ enclosureRemoval: { ...foundation.enclosureRemoval, sandRemoval: { ...foundation.enclosureRemoval.sandRemoval, enabled: checked } } }); handleSave() }}
                />
                <Label>Sand/Mud Removal</Label>
                <span className="text-xs text-muted-foreground">(cubic feet)</span>
                {foundation.enclosureRemoval.sandRemoval.enabled && (
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="# ft cubic"
                    value={foundation.enclosureRemoval.sandRemoval.cubicFeet}
                    onChange={(e) => { setFoundation({ enclosureRemoval: { ...foundation.enclosureRemoval, sandRemoval: { ...foundation.enclosureRemoval.sandRemoval, cubicFeet: e.target.value } } }); handleSave() }}
                    className="w-24 border-border/60 bg-secondary/50"
                  />
                )}
              </div>
              {foundation.enclosureRemoval.sandRemoval.enabled && (
                <div className="ml-8 grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Length (FT)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Length"
                      value={foundation.enclosureRemoval.sandRemoval.length}
                      onChange={(e) => { setFoundation({ enclosureRemoval: { ...foundation.enclosureRemoval, sandRemoval: { ...foundation.enclosureRemoval.sandRemoval, length: e.target.value } } }); handleSave() }}
                      className="border-border/60 bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Width (FT)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Width"
                      value={foundation.enclosureRemoval.sandRemoval.width}
                      onChange={(e) => { setFoundation({ enclosureRemoval: { ...foundation.enclosureRemoval, sandRemoval: { ...foundation.enclosureRemoval.sandRemoval, width: e.target.value } } }); handleSave() }}
                      className="border-border/60 bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Depth (FT)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Depth"
                      value={foundation.enclosureRemoval.sandRemoval.depth}
                      onChange={(e) => { setFoundation({ enclosureRemoval: { ...foundation.enclosureRemoval, sandRemoval: { ...foundation.enclosureRemoval.sandRemoval, depth: e.target.value } } }); handleSave() }}
                      className="border-border/60 bg-secondary/50"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Backfill */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={foundation.enclosureRemoval.backfill.enabled}
                  onCheckedChange={(checked) => { setFoundation({ enclosureRemoval: { ...foundation.enclosureRemoval, backfill: { ...foundation.enclosureRemoval.backfill, enabled: checked } } }); handleSave() }}
                />
                <Label>Backfill Around/In Foundation</Label>
                <span className="text-xs text-muted-foreground">(cubic ft)</span>
                {foundation.enclosureRemoval.backfill.enabled && (
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="# ft cubic"
                    value={foundation.enclosureRemoval.backfill.cubicFeet}
                    onChange={(e) => { setFoundation({ enclosureRemoval: { ...foundation.enclosureRemoval, backfill: { ...foundation.enclosureRemoval.backfill, cubicFeet: e.target.value } } }); handleSave() }}
                    className="w-24 border-border/60 bg-secondary/50"
                  />
                )}
              </div>
              {foundation.enclosureRemoval.backfill.enabled && (
                <div className="ml-8 grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Length (FT)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={foundation.enclosureRemoval.backfill.length}
                      onChange={(e) => { setFoundation({ enclosureRemoval: { ...foundation.enclosureRemoval, backfill: { ...foundation.enclosureRemoval.backfill, length: e.target.value } } }); handleSave() }}
                      className="border-border/60 bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Width (FT)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={foundation.enclosureRemoval.backfill.width}
                      onChange={(e) => { setFoundation({ enclosureRemoval: { ...foundation.enclosureRemoval, backfill: { ...foundation.enclosureRemoval.backfill, width: e.target.value } } }); handleSave() }}
                      className="border-border/60 bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Depth (FT)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={foundation.enclosureRemoval.backfill.depth}
                      onChange={(e) => { setFoundation({ enclosureRemoval: { ...foundation.enclosureRemoval, backfill: { ...foundation.enclosureRemoval.backfill, depth: e.target.value } } }); handleSave() }}
                      className="border-border/60 bg-secondary/50"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={foundation.enclosureRemoval.confinedSpace}
                onCheckedChange={(checked) => { setFoundation({ enclosureRemoval: { ...foundation.enclosureRemoval, confinedSpace: checked } }); handleSave() }}
              />
              <Label>Confined Space</Label>
            </div>
            {foundation.enclosureRemoval.confinedSpace && (
              <p className="text-xs text-muted-foreground">Note: Confined space charges can be applied to areas where you can not stand to shovel or operate with equipment for removal</p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Sump Pump */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center gap-3">
            <Droplets className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Sump Pump</span>
            {foundation.sumpPump.enabled && <Badge variant="secondary" className="text-xs">Saved</Badge>}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={foundation.sumpPump.enabled}
                onCheckedChange={(checked) => { setFoundation({ sumpPump: { ...foundation.sumpPump, enabled: checked } }); handleSave() }}
              />
              <Label>Enable Sump Pump</Label>
              {foundation.sumpPump.enabled && (
                <span className="text-xs text-muted-foreground">MinorAdjustment...</span>
              )}
            </div>
            {foundation.sumpPump.enabled && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select value={foundation.sumpPump.action} onValueChange={(value) => { setFoundation({ sumpPump: { ...foundation.sumpPump, action: value } }); handleSave() }}>
                    <SelectTrigger className="border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="replace">Replace</SelectItem>
                      <SelectItem value="detach-reset">Detach and Reset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Horsepower</Label>
                  <Select value={foundation.sumpPump.hp} onValueChange={(value) => { setFoundation({ sumpPump: { ...foundation.sumpPump, hp: value } }); handleSave() }}>
                    <SelectTrigger className="border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1/3">1/3 HP - up to 1 1/2 discharge</SelectItem>
                      <SelectItem value="1/2">1/2 HP - up to 1 1/2 discharge</SelectItem>
                      <SelectItem value="3/4">3/4 HP - up to 1 1/2 discharge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Info put the basement below the crawlspace items</p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* HVAC (Air Handler) */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center gap-3">
            <Wind className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">HVAC</span>
            {foundation.hvac.airHandlers.length > 0 && <Badge variant="secondary" className="text-xs">Saved</Badge>}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={foundation.hvac.airHandlers.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked && foundation.hvac.airHandlers.length === 0) {
                      setFoundation({ hvac: { ...foundation.hvac, airHandlers: [{ id: Date.now(), type: "", tonnage: "", heatElementCount: "", action: "", f9Note: "" }] } })
                    } else if (!checked) {
                      setFoundation({ hvac: { ...foundation.hvac, airHandlers: [] } })
                    }
                    handleSave()
                  }}
                />
                <Label>Enable Air Handler</Label>
              </div>
              {foundation.hvac.airHandlers.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1 border-border/60"
                  onClick={() => {
                    setFoundation({ hvac: { ...foundation.hvac, airHandlers: [...foundation.hvac.airHandlers, { id: Date.now(), type: "", tonnage: "", heatElementCount: "", action: "", f9Note: "" }] } })
                    handleSave()
                  }}
                >
                  <Plus className="h-3 w-3" /> Add Air Handler
                </Button>
              )}
            </div>
            {foundation.hvac.airHandlers.map((handler, index) => (
              <div key={handler.id} className="ml-4 rounded-lg border border-border/40 bg-secondary/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Air Handler {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => {
                      setFoundation({ hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.filter(h => h.id !== handler.id) } })
                      handleSave()
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Type</Label>
                    <Select value={handler.type} onValueChange={(value) => {
                      setFoundation({ hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.map(h => h.id === handler.id ? { ...h, type: value } : h) } })
                      handleSave()
                    }}>
                      <SelectTrigger className="border-border/60 bg-secondary/50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="air-handler">Air Handler</SelectItem>
                        <SelectItem value="with-heat-element">With Heat Element</SelectItem>
                        <SelectItem value="with-heat-element-a-coil">With Heat Element & A-coil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Tonnage</Label>
                    <Select value={handler.tonnage} onValueChange={(value) => {
                      setFoundation({ hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.map(h => h.id === handler.id ? { ...h, tonnage: value } : h) } })
                      handleSave()
                    }}>
                      <SelectTrigger className="border-border/60 bg-secondary/50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {["2", "2.5", "3", "4", "5"].map(t => (
                          <SelectItem key={t} value={t}>{t} Ton</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {(handler.type === "with-heat-element" || handler.type === "with-heat-element-a-coil") && (
                    <div className="space-y-2">
                      <Label className="text-sm">With Heat Element</Label>
                      <Select value={handler.heatElementCount} onValueChange={(value) => {
                        setFoundation({ hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.map(h => h.id === handler.id ? { ...h, heatElementCount: value } : h) } })
                        handleSave()
                      }}>
                        <SelectTrigger className="border-border/60 bg-secondary/50">
                          <SelectValue placeholder="QTY" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(n => (
                            <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Action</Label>
                  <Select value={handler.action} onValueChange={(value) => {
                    setFoundation({ hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.map(h => h.id === handler.id ? { ...h, action: value } : h) } })
                    handleSave()
                  }}>
                    <SelectTrigger className="w-48 border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="replace">Replace</SelectItem>
                      <SelectItem value="detach-reset">Detach and reset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Basement */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center gap-3">
            <Home className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Basement</span>
            {foundation.basement.enabled && <Badge variant="secondary" className="text-xs">Saved</Badge>}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={foundation.basement.enabled}
                onCheckedChange={(checked) => { setFoundation({ basement: { ...foundation.basement, enabled: checked } }); handleSave() }}
              />
              <Label>Enable Basement</Label>
            </div>
            {foundation.basement.enabled && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Foundation Wall Clean (PF)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Perimeter feet"
                      value={foundation.basement.wallCleanPf}
                      onChange={(e) => { setFoundation({ basement: { ...foundation.basement, wallCleanPf: e.target.value.replace(/^0+/, '') } }); handleSave() }}
                      className="border-border/60 bg-secondary/50"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={foundation.basement.muck}
                        onCheckedChange={(checked) => { setFoundation({ basement: { ...foundation.basement, muck: checked, muckHeavy: checked ? false : foundation.basement.muckHeavy } }); handleSave() }}
                      />
                      <Label className="text-sm">Water Muck</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={foundation.basement.muckHeavy}
                        onCheckedChange={(checked) => { setFoundation({ basement: { ...foundation.basement, muckHeavy: checked, muck: checked ? false : foundation.basement.muck } }); handleSave() }}
                      />
                      <Label className="text-sm">Water Muck Heavy</Label>
                    </div>
                  </div>
                </div>
                {foundation.basement.muckHeavy && (
                  <p className="text-xs text-amber-500">Note: NFIP requires photos of standing mud to endorse for heavy Muck</p>
                )}
                {/* Drywall */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={foundation.basement.drywallEnabled}
                      onCheckedChange={(checked) => { setFoundation({ basement: { ...foundation.basement, drywallEnabled: checked } }); handleSave() }}
                    />
                    <Label>Drywall Replacement Height</Label>
                    <p className="text-xs text-muted-foreground">Certain locations require SF calculations, you will need to update this periodically as they get updated</p>
                  </div>
                  {foundation.basement.drywallEnabled && (
                    <div className="ml-8 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant={foundation.basement.drywallMeasureType === "sf" ? "default" : "outline"}
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => { setFoundation({ basement: { ...foundation.basement, drywallMeasureType: "sf" } }); handleSave() }}
                        >
                          Square Feet
                        </Button>
                        <Button
                          type="button"
                          variant={foundation.basement.drywallMeasureType === "lf" ? "default" : "outline"}
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => { setFoundation({ basement: { ...foundation.basement, drywallMeasureType: "lf" } }); handleSave() }}
                        >
                          Linear Feet
                        </Button>
                      </div>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder={foundation.basement.drywallMeasureType.toUpperCase()}
                        value={foundation.basement.drywallValue}
                        onChange={(e) => { setFoundation({ basement: { ...foundation.basement, drywallValue: e.target.value.replace(/^0+/, '') } }); handleSave() }}
                        className="w-24 border-border/60 bg-secondary/50"
                      />
                    </div>
                  )}
                </div>
                {/* Stair Cleaning */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={foundation.basement.stairCleaning}
                      onCheckedChange={(checked) => { setFoundation({ basement: { ...foundation.basement, stairCleaning: checked } }); handleSave() }}
                    />
                    <Label>Enable Stair Cleaning</Label>
                  </div>
                  {foundation.basement.stairCleaning && (
                    <div className="ml-8 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-sm"># of stairs submerged</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={foundation.basement.stairCount}
                          onChange={(e) => { setFoundation({ basement: { ...foundation.basement, stairCount: e.target.value.replace(/^0+/, '') || "" } }); handleSave() }}
                          className="border-border/60 bg-secondary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Width of treads</Label>
                        <Input
                          type="text"
                          placeholder="3 ft"
                          value={foundation.basement.totalStairsSubmerged}
                          onChange={(e) => { setFoundation({ basement: { ...foundation.basement, totalStairsSubmerged: e.target.value } }); handleSave() }}
                          className="border-border/60 bg-secondary/50"
                        />
                      </div>
                    </div>
                  )}
                </div>
                {/* Foundation Door */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={foundation.basement.foundationDoor}
                      onCheckedChange={(checked) => { setFoundation({ basement: { ...foundation.basement, foundationDoor: checked } }); handleSave() }}
                    />
                    <Label>Enable Foundation Door</Label>
                    {foundation.basement.foundationDoor && (
                      <Select value={foundation.basement.foundationDoorAction} onValueChange={(value) => { setFoundation({ basement: { ...foundation.basement, foundationDoorAction: value } }); handleSave() }}>
                        <SelectTrigger className="w-44 border-border/60 bg-secondary/50">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="detach-reset-handle">Detach & Reset Handle</SelectItem>
                          <SelectItem value="replace">Replace</SelectItem>
                          <SelectItem value="replace-handle">Replace Handle</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                {/* Foundation Windows */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={foundation.basement.foundationWindows.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked && foundation.basement.foundationWindows.length === 0) {
                            setFoundation({ basement: { ...foundation.basement, foundationWindows: [{ id: Date.now(), type: "", size: "", quantity: "", material: "" }] } })
                          } else if (!checked) {
                            setFoundation({ basement: { ...foundation.basement, foundationWindows: [] } })
                          }
                          handleSave()
                        }}
                      />
                      <Label>Enable Foundation Window</Label>
                    </div>
                    {foundation.basement.foundationWindows.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1 border-border/60"
                        onClick={() => {
                          setFoundation({ basement: { ...foundation.basement, foundationWindows: [...foundation.basement.foundationWindows, { id: Date.now(), type: "", size: "", quantity: "", material: "" }] } })
                          handleSave()
                        }}
                      >
                        <Plus className="h-3 w-3" /> Add Window
                      </Button>
                    )}
                  </div>
                  {foundation.basement.foundationWindows.map((win, index) => (
                    <div key={win.id} className="ml-8 flex flex-wrap items-center gap-3 rounded-lg border border-border/40 bg-secondary/30 p-3">
                      <span className="text-sm font-medium">Window {index + 1}</span>
                      <Select value={win.type} onValueChange={(value) => {
                        setFoundation({ basement: { ...foundation.basement, foundationWindows: foundation.basement.foundationWindows.map(w => w.id === win.id ? { ...w, type: value } : w) } })
                        handleSave()
                      }}>
                        <SelectTrigger className="w-28 border-border/60 bg-secondary/50">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="casement">Casement</SelectItem>
                          <SelectItem value="single-hung">Single Hung</SelectItem>
                          <SelectItem value="double-hung">Double Hung</SelectItem>
                          <SelectItem value="slider">Slider</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={win.size} onValueChange={(value) => {
                        setFoundation({ basement: { ...foundation.basement, foundationWindows: foundation.basement.foundationWindows.map(w => w.id === win.id ? { ...w, size: value } : w) } })
                        handleSave()
                      }}>
                        <SelectTrigger className="w-24 border-border/60 bg-secondary/50">
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3-4">3-4 sf</SelectItem>
                          <SelectItem value="5-8">5-8 sf</SelectItem>
                          <SelectItem value="9-12">9-12 sf</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-1">
                        <Label className="text-xs">Qty</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="QTY"
                          value={win.quantity}
                          onChange={(e) => {
                            setFoundation({ basement: { ...foundation.basement, foundationWindows: foundation.basement.foundationWindows.map(w => w.id === win.id ? { ...w, quantity: e.target.value.replace(/^0+/, '') || "" } : w) } })
                            handleSave()
                          }}
                          className="w-14 border-border/60 bg-secondary/50"
                        />
                      </div>
                      <Select value={win.material} onValueChange={(value) => {
                        setFoundation({ basement: { ...foundation.basement, foundationWindows: foundation.basement.foundationWindows.map(w => w.id === win.id ? { ...w, material: value } : w) } })
                        handleSave()
                      }}>
                        <SelectTrigger className="w-24 border-border/60 bg-secondary/50">
                          <SelectValue placeholder="Material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vinyl">Vinyl</SelectItem>
                          <SelectItem value="aluminum">Aluminum</SelectItem>
                          <SelectItem value="wood">Wood</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => {
                          setFoundation({ basement: { ...foundation.basement, foundationWindows: foundation.basement.foundationWindows.filter(w => w.id !== win.id) } })
                          handleSave()
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Electrical */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Electrical</span>
            {(foundation.electrical.outlets110 !== "" || foundation.electrical.breakerPanel.enabled || foundation.electrical.meterBox) && <Badge variant="secondary" className="text-xs">Saved</Badge>}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label>110 outlet</Label>
                <Select value={foundation.electrical.outlets110} onValueChange={(value) => { setFoundation({ electrical: { ...foundation.electrical, outlets110: value } }); handleSave() }}>
                  <SelectTrigger className="border-border/60 bg-secondary/50">
                    <SelectValue placeholder="QTY" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>220 outlet</Label>
                <Select value={foundation.electrical.outlets220} onValueChange={(value) => { setFoundation({ electrical: { ...foundation.electrical, outlets220: value } }); handleSave() }}>
                  <SelectTrigger className="border-border/60 bg-secondary/50">
                    <SelectValue placeholder="QTY" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>GFI outlet</Label>
                <Select value={foundation.electrical.gfiOutlets} onValueChange={(value) => { setFoundation({ electrical: { ...foundation.electrical, gfiOutlets: value } }); handleSave() }}>
                  <SelectTrigger className="border-border/60 bg-secondary/50">
                    <SelectValue placeholder="QTY" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Light Switch</Label>
                <Select value={foundation.electrical.lightSwitch} onValueChange={(value) => { setFoundation({ electrical: { ...foundation.electrical, lightSwitch: value } }); handleSave() }}>
                  <SelectTrigger className="border-border/60 bg-secondary/50">
                    <SelectValue placeholder="QTY" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Junction Box</Label>
              <Select value={foundation.electrical.junctionBox} onValueChange={(value) => { setFoundation({ electrical: { ...foundation.electrical, junctionBox: value } }); handleSave() }}>
                <SelectTrigger className="w-24 border-border/60 bg-secondary/50">
                  <SelectValue placeholder="QTY" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map(n => (
                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Breaker Panel */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={foundation.electrical.breakerPanel.enabled}
                  onCheckedChange={(checked) => { setFoundation({ electrical: { ...foundation.electrical, breakerPanel: { ...foundation.electrical.breakerPanel, enabled: checked } } }); handleSave() }}
                />
                <Label>Enable Breaker Panel</Label>
              </div>
              {foundation.electrical.breakerPanel.enabled && (
                <div className="ml-8 flex items-center gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Amperage</Label>
                    <Select value={foundation.electrical.breakerPanel.amps} onValueChange={(value) => { setFoundation({ electrical: { ...foundation.electrical, breakerPanel: { ...foundation.electrical.breakerPanel, amps: value } } }); handleSave() }}>
                      <SelectTrigger className="w-32 border-border/60 bg-secondary/50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {["100", "150", "200", "300"].map(a => (
                          <SelectItem key={a} value={a}>{a} Amp</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      checked={foundation.electrical.breakerPanel.arcFaults}
                      onCheckedChange={(checked) => { setFoundation({ electrical: { ...foundation.electrical, breakerPanel: { ...foundation.electrical.breakerPanel, arcFaults: checked } } }); handleSave() }}
                    />
                    <Label className="text-sm">With Arc Faults</Label>
                  </div>
                </div>
              )}
            </div>
            {/* Meter Box */}
            <div className="flex items-center gap-3">
              <Switch
                checked={foundation.electrical.meterBox}
                onCheckedChange={(checked) => { setFoundation({ electrical: { ...foundation.electrical, meterBox: checked } }); handleSave() }}
              />
              <Label>Enable Meter Box</Label>
              {foundation.electrical.meterBox && (
                <Select defaultValue="qty">
                  <SelectTrigger className="w-20 border-border/60 bg-secondary/50">
                    <SelectValue placeholder="QTY" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qty">QTY</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
