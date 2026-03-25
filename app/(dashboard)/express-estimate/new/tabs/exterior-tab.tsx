"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Plus, Trash2, Droplets, Wind, Zap, Home } from "lucide-react"
import type { ExteriorState } from "../types"

interface ExteriorTabProps {
  exterior: ExteriorState
  updateExterior: <K extends keyof ExteriorState>(key: K, value: ExteriorState[K]) => void
  handleSave: () => void
}

export function ExteriorTab({ exterior, updateExterior, handleSave }: ExteriorTabProps) {
  const setExterior = (updates: Partial<ExteriorState>) => {
    Object.entries(updates).forEach(([key, value]) => {
      updateExterior(key as keyof ExteriorState, value as ExteriorState[keyof ExteriorState])
    })
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Pressure Wash / Cleaning */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center gap-3">
            <Droplets className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Pressure Wash / Cleaning</span>
            {exterior.pressureWash.enabled && <Badge variant="secondary" className="text-xs">Saved</Badge>}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={exterior.pressureWash.enabled}
                onCheckedChange={(checked) => { 
                  setExterior({ pressureWash: { ...exterior.pressureWash, enabled: checked } })
                  handleSave()
                }}
              />
              <Label>Enable Pressure Wash</Label>
            </div>
            {exterior.pressureWash.enabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Perimeter Feet</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter PF"
                    value={exterior.pressureWash.perimeterFeet}
                    onChange={(e) => { 
                      const val = e.target.value.replace(/^0+/, '') || ""
                      setExterior({ pressureWash: { ...exterior.pressureWash, perimeterFeet: val } })
                      handleSave()
                    }}
                    className="border-border/60 bg-secondary/50 w-32"
                  />
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={exterior.pressureWash.regularPwash}
                      onCheckedChange={(checked) => { 
                        setExterior({ pressureWash: { ...exterior.pressureWash, regularPwash: checked } })
                        handleSave()
                      }}
                    />
                    <Label className="text-sm">Regular Pwash</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={exterior.pressureWash.cleanWithSteam}
                      onCheckedChange={(checked) => { 
                        setExterior({ pressureWash: { ...exterior.pressureWash, cleanWithSteam: checked } })
                        handleSave()
                      }}
                    />
                    <Label className="text-sm">Clean with Steam</Label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Dumpster */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Dumpster / Debris Removal</span>
            {exterior.dumpster.enabled && <Badge variant="secondary" className="text-xs">Saved</Badge>}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={exterior.dumpster.enabled}
                onCheckedChange={(checked) => { 
                  setExterior({ dumpster: { ...exterior.dumpster, enabled: checked } })
                  handleSave()
                }}
              />
              <Label>Add Dumpster</Label>
            </div>
            {exterior.dumpster.enabled && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label># of Dumpsters</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={exterior.dumpster.count}
                    onChange={(e) => { 
                      setExterior({ dumpster: { ...exterior.dumpster, count: e.target.value.replace(/^0+/, '') || "" } })
                      handleSave()
                    }}
                    className="border-border/60 bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dumpster Size</Label>
                  <Select 
                    value={exterior.dumpster.size} 
                    onValueChange={(value) => { 
                      setExterior({ dumpster: { ...exterior.dumpster, size: value } })
                      handleSave()
                    }}
                  >
                    <SelectTrigger className="border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 Yards</SelectItem>
                      <SelectItem value="20">20 Yards</SelectItem>
                      <SelectItem value="30">30 Yards</SelectItem>
                      <SelectItem value="40">40 Yards</SelectItem>
                      <SelectItem value="pickup">Pickup Truck Load</SelectItem>
                      <SelectItem value="dump-truck">Single Axle Dump Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* HVAC */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center gap-3">
            <Wind className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">HVAC</span>
            {(exterior.hvac.condenserUnits.length > 0 || exterior.hvac.packageUnits.length > 0 || exterior.hvac.miniSplits.length > 0) && 
              <Badge variant="secondary" className="text-xs">Saved</Badge>
            }
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
          <div className="space-y-6">
            {/* Condenser Units */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Condenser Unit / AC Unit</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1 border-border/60"
                  onClick={() => {
                    const newUnit = { id: Date.now(), tonnage: "", seer: "", replace: false, serviceCall: false, f9Note: "" }
                    setExterior({ hvac: { ...exterior.hvac, condenserUnits: [...exterior.hvac.condenserUnits, newUnit] } })
                    handleSave()
                  }}
                >
                  <Plus className="h-3 w-3" /> Add Unit
                </Button>
              </div>
              {exterior.hvac.condenserUnits.map((unit, index) => (
                <div key={unit.id} className="ml-4 rounded-lg border border-border/40 bg-secondary/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Unit {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => {
                        setExterior({ hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.filter(u => u.id !== unit.id) } })
                        handleSave()
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm">Tonnage</Label>
                      <Select value={unit.tonnage} onValueChange={(value) => {
                        setExterior({ hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, tonnage: value } : u) } })
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
                    <div className="space-y-2">
                      <Label className="text-sm">SEER Rating</Label>
                      <Select value={unit.seer} onValueChange={(value) => {
                        setExterior({ hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, seer: value } : u) } })
                        handleSave()
                      }}>
                        <SelectTrigger className="border-border/60 bg-secondary/50">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="13">13</SelectItem>
                          <SelectItem value="14-16">14-16</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={unit.replace}
                        onCheckedChange={(checked) => {
                          setExterior({ hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, replace: checked } : u) } })
                          handleSave()
                        }}
                      />
                      <Label className="text-sm">Replace</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={unit.serviceCall}
                        onCheckedChange={(checked) => {
                          setExterior({ hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, serviceCall: checked } : u) } })
                          handleSave()
                        }}
                      />
                      <Label className="text-sm">Service Call</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">F9 Note</Label>
                    <p className="text-xs text-muted-foreground">Model and Serial Number</p>
                    <Input
                      placeholder="Enter model and serial number..."
                      value={unit.f9Note}
                      onChange={(e) => {
                        setExterior({ hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, f9Note: e.target.value } : u) } })
                        handleSave()
                      }}
                      className="border-border/60 bg-secondary/50"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Package Units */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Package Unit</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1 border-border/60"
                  onClick={() => {
                    const newUnit = { id: Date.now(), unitType: "", tonnage: "", seer: "", replace: false, serviceCall: false, f9Note: "" }
                    setExterior({ hvac: { ...exterior.hvac, packageUnits: [...exterior.hvac.packageUnits, newUnit] } })
                    handleSave()
                  }}
                >
                  <Plus className="h-3 w-3" /> Add Unit
                </Button>
              </div>
              {exterior.hvac.packageUnits.map((unit, index) => (
                <div key={unit.id} className="ml-4 rounded-lg border border-border/40 bg-secondary/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Unit {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => {
                        setExterior({ hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.filter(u => u.id !== unit.id) } })
                        handleSave()
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Unit Type</Label>
                    <Select value={unit.unitType} onValueChange={(value) => {
                      setExterior({ hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, unitType: value } : u) } })
                      handleSave()
                    }}>
                      <SelectTrigger className="border-border/60 bg-secondary/50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ac">AC Unit</SelectItem>
                        <SelectItem value="gas-furnace-ac">Gas Furnace & AC Unit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm">Tonnage</Label>
                      <Select value={unit.tonnage} onValueChange={(value) => {
                        setExterior({ hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, tonnage: value } : u) } })
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
                    <div className="space-y-2">
                      <Label className="text-sm">SEER Rating</Label>
                      <Select value={unit.seer} onValueChange={(value) => {
                        setExterior({ hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, seer: value } : u) } })
                        handleSave()
                      }}>
                        <SelectTrigger className="border-border/60 bg-secondary/50">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="13">13</SelectItem>
                          <SelectItem value="14-16">14-16</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={unit.replace}
                        onCheckedChange={(checked) => {
                          setExterior({ hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, replace: checked } : u) } })
                          handleSave()
                        }}
                      />
                      <Label className="text-sm">Replace</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={unit.serviceCall}
                        onCheckedChange={(checked) => {
                          setExterior({ hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, serviceCall: checked } : u) } })
                          handleSave()
                        }}
                      />
                      <Label className="text-sm">Service Call</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">F9 Note</Label>
                    <p className="text-xs text-muted-foreground">Model and Serial Number</p>
                    <Input
                      placeholder="Enter model and serial number..."
                      value={unit.f9Note}
                      onChange={(e) => {
                        setExterior({ hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, f9Note: e.target.value } : u) } })
                        handleSave()
                      }}
                      className="border-border/60 bg-secondary/50"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mini Splits */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Mini Split / Duct-Free System</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1 border-border/60"
                  onClick={() => {
                    const newUnit = { id: Date.now(), zones: "", highEfficiency: false, replace: false, serviceCall: false, f9Note: "" }
                    setExterior({ hvac: { ...exterior.hvac, miniSplits: [...exterior.hvac.miniSplits, newUnit] } })
                    handleSave()
                  }}
                >
                  <Plus className="h-3 w-3" /> Add Unit
                </Button>
              </div>
              {exterior.hvac.miniSplits.map((unit, index) => (
                <div key={unit.id} className="ml-4 rounded-lg border border-border/40 bg-secondary/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Unit {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => {
                        setExterior({ hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.filter(u => u.id !== unit.id) } })
                        handleSave()
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm">Number of Zones</Label>
                      <Select value={unit.zones} onValueChange={(value) => {
                        setExterior({ hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, zones: value } : u) } })
                        handleSave()
                      }}>
                        <SelectTrigger className="border-border/60 bg-secondary/50">
                          <SelectValue placeholder="QTY" />
                        </SelectTrigger>
                        <SelectContent>
                          {["1", "2", "3", "4"].map(z => (
                            <SelectItem key={z} value={z}>{z} Zone</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <Switch
                        checked={unit.highEfficiency}
                        onCheckedChange={(checked) => {
                          setExterior({ hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, highEfficiency: checked } : u) } })
                          handleSave()
                        }}
                      />
                      <Label className="text-sm">High Efficiency</Label>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={unit.replace}
                        onCheckedChange={(checked) => {
                          setExterior({ hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, replace: checked } : u) } })
                          handleSave()
                        }}
                      />
                      <Label className="text-sm">Replace</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={unit.serviceCall}
                        onCheckedChange={(checked) => {
                          setExterior({ hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, serviceCall: checked } : u) } })
                          handleSave()
                        }}
                      />
                      <Label className="text-sm">Service Call</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">F9 Note</Label>
                    <p className="text-xs text-muted-foreground">Model and Serial Number</p>
                    <Input
                      placeholder="Enter model and serial number..."
                      value={unit.f9Note}
                      onChange={(e) => {
                        setExterior({ hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, f9Note: e.target.value } : u) } })
                        handleSave()
                      }}
                      className="border-border/60 bg-secondary/50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Electrical */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Electrical</span>
            {(exterior.electrical.exteriorOutlets !== "" || exterior.electrical.breakerPanel.enabled) && 
              <Badge variant="secondary" className="text-xs">Saved</Badge>
            }
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Exterior Outlets</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={exterior.electrical.exteriorOutlets}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+/, '') || ""
                    setExterior({ electrical: { ...exterior.electrical, exteriorOutlets: val } })
                    handleSave()
                  }}
                  className="border-border/60 bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>30 Amp Disconnect</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={exterior.electrical.disconnect30Amp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+/, '') || ""
                    setExterior({ electrical: { ...exterior.electrical, disconnect30Amp: val } })
                    handleSave()
                  }}
                  className="border-border/60 bg-secondary/50"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={exterior.electrical.breakerPanel.enabled}
                  onCheckedChange={(checked) => { 
                    setExterior({ electrical: { ...exterior.electrical, breakerPanel: { ...exterior.electrical.breakerPanel, enabled: checked } } })
                    handleSave()
                  }}
                />
                <Label>Breaker Panel</Label>
              </div>
              {exterior.electrical.breakerPanel.enabled && (
                <div className="ml-8 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm">Amperage</Label>
                    <Select 
                      value={exterior.electrical.breakerPanel.amps} 
                      onValueChange={(value) => { 
                        setExterior({ electrical: { ...exterior.electrical, breakerPanel: { ...exterior.electrical.breakerPanel, amps: value } } })
                        handleSave()
                      }}
                    >
                      <SelectTrigger className="border-border/60 bg-secondary/50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {["70", "100", "125", "150", "200", "300"].map(a => (
                          <SelectItem key={a} value={a}>{a} Amp</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch
                      checked={exterior.electrical.breakerPanel.arcFaults}
                      onCheckedChange={(checked) => { 
                        setExterior({ electrical: { ...exterior.electrical, breakerPanel: { ...exterior.electrical.breakerPanel, arcFaults: checked } } })
                        handleSave()
                      }}
                    />
                    <Label className="text-sm">With Arc Faults</Label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Finishes */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center gap-3">
            <Home className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Finishes</span>
            {exterior.finishes.length > 0 && <Badge variant="secondary" className="text-xs">Saved</Badge>}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={exterior.finishes.some(f => f.type === "exterior-paint")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setExterior({ finishes: [...exterior.finishes, { id: Date.now(), type: "exterior-paint", measureType: "pf", value: "" }] })
                    } else {
                      setExterior({ finishes: exterior.finishes.filter(f => f.type !== "exterior-paint") })
                    }
                    handleSave()
                  }}
                />
                <Label className="text-sm">Exterior Paint</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={exterior.finishes.some(f => f.type === "exterior-siding")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setExterior({ finishes: [...exterior.finishes, { id: Date.now(), type: "exterior-siding", measureType: "sf", value: "" }] })
                    } else {
                      setExterior({ finishes: exterior.finishes.filter(f => f.type !== "exterior-siding") })
                    }
                    handleSave()
                  }}
                />
                <Label className="text-sm">Exterior Siding</Label>
              </div>
            </div>
            {exterior.finishes.map((finish) => (
              <div key={finish.id} className="ml-4 flex items-center gap-4 rounded-lg border border-border/40 bg-secondary/30 p-3">
                <span className="text-sm font-medium capitalize">{finish.type.replace("-", " ")}</span>
                <div className="flex items-center gap-2">
                  {(["pf", "sf", "lf"] as const).map((mt) => (
                    <Button
                      key={mt}
                      type="button"
                      variant={finish.measureType === mt ? "default" : "outline"}
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        setExterior({ finishes: exterior.finishes.map(f => f.id === finish.id ? { ...f, measureType: mt } : f) })
                        handleSave()
                      }}
                    >
                      {mt.toUpperCase()}
                    </Button>
                  ))}
                </div>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder={finish.measureType.toUpperCase()}
                  value={finish.value}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+/, '') || ""
                    setExterior({ finishes: exterior.finishes.map(f => f.id === finish.id ? { ...f, value: val } : f) })
                    handleSave()
                  }}
                  className="w-24 border-border/60 bg-secondary/50"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1 border-border/60"
              onClick={() => {
                setExterior({ finishes: [...exterior.finishes, { id: Date.now(), type: "other", measureType: "sf", value: "" }] })
                handleSave()
              }}
            >
              <Plus className="h-3 w-3" /> Add Finish
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
