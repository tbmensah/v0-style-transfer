"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  CheckCircle,
  ChevronDown,
  Plus,
  Trash2,
  Home,
  Droplets,
  Zap,
  Wind,
  HelpCircle,
} from "lucide-react"

// Types and Defaults from extracted modules
import type { Room } from "./types"
import {
  defaultRoom,
  defaultBathroomExtras,
  defaultKitchenExtras,
} from "./defaults"
import { RoomCard } from "./components/room-card"

export default function NewExpressEstimatePage() {
  const [activeTab, setActiveTab] = useState("exterior")
  const nv = (v: string) => v === "__none__" ? "" : v
  const [isSaved, setIsSaved] = useState(true)

  // Project Details
  const [projectDetails, setProjectDetails] = useState({
    projectName: "",
    claimNumber: "",
    inspectionDate: "",
    propertyAddress: "",
    propertyType: "",
    preFirm: false,
    adjusterName: "",
    notes: "",
  })

  // Exterior State
  const [exterior, setExterior] = useState({
    pressureWash: { enabled: false, perimeterFeet: "", regularPwash: false, cleanWithSteam: false },
    dumpster: { enabled: false, count: "", size: "" },
    hvac: {
      condenserUnits: [] as Array<{ id: number; tonnage: string; seer: string; replace: boolean; serviceCall: boolean; f9Note: string }>,
      packageUnits: [] as Array<{ id: number; unitType: string; tonnage: string; seer: string; replace: boolean; serviceCall: boolean; f9Note: string }>,
      miniSplits: [] as Array<{ id: number; zones: string; highEfficiency: boolean; replace: boolean; serviceCall: boolean; f9Note: string }>,
    },
    electrical: {
      exteriorOutlets: "",
      disconnect30Amp: "",
      breakerPanel: { enabled: false, amps: "", arcFaults: false },
      meterBox: false,
    },
    finishes: [] as Array<{
      id: number;
      type: string;
      measureType: "pf" | "sf" | "lf";
      value: string;
    }>,
  })

  // Foundation State
  const [foundation, setFoundation] = useState({
    crawlspace: {
      enabled: false,
      preFirm: false,
      acControlledSpace: false,
      heavyCleanArea: false,
      perimeterFeet: "",
      piersType: "" as "" | "short" | "tall",
      piersCount: "",
      cleanJoist: false,
      // Pre-FIRM options
      bellyPaper: false,
      floorInsulation: false,
      floorInsulationType: "",
      // Muck options
      muck: false,
      muckHeavy: false,
      standingWater: false,
      houseRewire: "",
    },
    enclosureRemoval: {
      sandRemoval: { enabled: false, cubicFeet: "", length: "", width: "", depth: "" },
      backfill: { enabled: false, cubicFeet: "", length: "", width: "", depth: "" },
      confinedSpace: false,
    },
    sumpPump: { enabled: false, minorAdjustment: "", action: "", hp: "", f9Note: "" },
    hvac: {
      airHandlers: [] as Array<{
        id: number;
        type: string;
        tonnage: string;
        heatElementCount: string;
        action: string;
        f9Note: string;
      }>,
    },
    basement: {
      enabled: false,
      wallCleanPf: "",
      muck: false,
      muckHeavy: false,
      // Drywall
      drywallEnabled: false,
      drywallMeasureType: "sf" as "sf" | "lf",
      drywallValue: "",
      // Stair Cleaning
      stairCleaning: false,
      stairCount: "",
      treadWidth: "",
      stringersLength: "",
      // Foundation Door
      foundationDoor: false,
      foundationDoorAction: "",
      // Foundation Windows
      foundationWindows: [] as Array<{
        id: number;
        type: string;
        size: string;
        quantity: string;
        material: string;
      }>,
    },
    electrical: {
      outlets110: "",
      outlets220: "",
      gfiOutlets: "",
      lightSwitch: "",
      junctionBox: "",
      breakerPanel: { enabled: false, amps: "", arcFaults: false },
      meterBox: false,
    },
  })

  // Interior Rooms
  const [rooms, setRooms] = useState<Room[]>([])

  // Handlers
  const handleSave = () => {
    setIsSaved(false)
    setTimeout(() => setIsSaved(true), 1000)
  }

  const addRoom = (type: string = "room", name: string = "") => {
    // Count existing rooms of this type for auto-naming
    const existingCount = rooms.filter(r => r.type === type).length + 1
    let roomName = name
    if (!roomName) {
      switch (type) {
        case "bathroom":
          roomName = `Bathroom ${existingCount}`
          break
        case "kitchen":
          roomName = `Kitchen ${existingCount}`
          break
        default:
          roomName = `Room ${rooms.filter(r => r.type === "room").length + 1}`
      }
    }
    const newRoom: Room = {
      id: Date.now(),
      name: roomName,
      ...defaultRoom,
      type,
      ...(type === "bathroom" ? defaultBathroomExtras : {}),
      ...(type === "kitchen" ? defaultKitchenExtras : {}),
    }
    setRooms([...rooms, newRoom])
    handleSave()
  }

  const copyRoom = (roomId: number) => {
    const roomToCopy = rooms.find(r => r.id === roomId)
    if (roomToCopy) {
      const newRoom = {
        ...roomToCopy,
        id: Date.now(),
        name: `${roomToCopy.name} (Copy)`,
      }
      setRooms([...rooms, newRoom])
      handleSave()
    }
  }

  const removeRoom = (roomId: number) => {
    setRooms(rooms.filter(r => r.id !== roomId))
    handleSave()
  }

  const updateRoom = (roomId: number, updates: Partial<Room>) => {
    console.log("[v0] updateRoom called for room:", roomId, "with updates:", updates)
    setRooms(rooms.map(r => r.id === roomId ? { ...r, ...updates } : r))
    handleSave()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">New Express Estimate</h1>
          <p className="mt-1 text-muted-foreground">Enter site inspection details to generate an estimate-ready ESX</p>
        </div>
        <div className="flex items-center gap-3">
          {isSaved ? (
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Auto-saved
            </Badge>
          ) : (
            <Badge variant="outline">Saving...</Badge>
          )}
          <Button variant="outline" className="border-border/60">Save Draft</Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-3">
          {/* Project Details Card */}
          <Card className="border-border/60 bg-card/80 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Home className="h-5 w-5 text-primary" />
                Project Details
              </CardTitle>
              <CardDescription>Enter the claim and property information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="projectName" className="text-foreground">
                    Project Name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., Johnson Residence"
                    value={projectDetails.projectName}
                    onChange={(e) => { setProjectDetails({ ...projectDetails, projectName: e.target.value }); handleSave() }}
                    className="border-border/60 bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claimNumber" className="text-foreground">
                    Claim Number<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="claimNumber"
                    placeholder="e.g., CLM-2024-0892"
                    value={projectDetails.claimNumber}
                    onChange={(e) => { setProjectDetails({ ...projectDetails, claimNumber: e.target.value }); handleSave() }}
                    className="border-border/60 bg-secondary/50"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="inspectionDate" className="text-foreground">Date of Inspection</Label>
                  <Input
                    id="inspectionDate"
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={projectDetails.inspectionDate}
                    onChange={(e) => { setProjectDetails({ ...projectDetails, inspectionDate: e.target.value }); handleSave() }}
                    className="border-border/60 bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType" className="text-foreground">Property Type</Label>
                  <Select value={projectDetails.propertyType} onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setProjectDetails({ ...projectDetails, propertyType: value }); handleSave() }}>
                    <SelectTrigger className="border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="dwelling">Dwelling</SelectItem>
                      <SelectItem value="general-property">General Property</SelectItem>
                      <SelectItem value="rcbap">RCBAP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyAddress" className="text-foreground">Property Address</Label>
                <Input
                  id="propertyAddress"
                  placeholder="123 Main St, City, State ZIP"
                  value={projectDetails.propertyAddress}
                  onChange={(e) => { setProjectDetails({ ...projectDetails, propertyAddress: e.target.value }); handleSave() }}
                  className="border-border/60 bg-secondary/50"
                />
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 p-4">
                <Switch
                  checked={projectDetails.preFirm}
                  onCheckedChange={(checked) => { setProjectDetails({ ...projectDetails, preFirm: checked }); handleSave() }}
                />
                <div>
                  <Label className="text-foreground">Pre-FIRM Property</Label>
                  <p className="text-sm text-muted-foreground">Property built before flood insurance rate maps</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Damage Details Tabs */}
          <Card className="border-border/60 bg-card/80 shadow-md">
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="exterior" className="gap-2">
                    <Home className="h-4 w-4" />
                    Exterior
                  </TabsTrigger>
                  <TabsTrigger value="foundation" className="gap-2">
                    <Droplets className="h-4 w-4" />
                    Foundation
                  </TabsTrigger>
                  <TabsTrigger value="interior" className="gap-2">
                    <Zap className="h-4 w-4" />
                    Interior
                  </TabsTrigger>
                </TabsList>

                {/* EXTERIOR TAB */}
                <TabsContent value="exterior" className="mt-6 space-y-4">
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
                            onCheckedChange={(checked) => { setExterior({ ...exterior, pressureWash: { ...exterior.pressureWash, enabled: checked } }); handleSave() }}
                          />
                          <Label>Enable Pressure Wash</Label>
                        </div>
                        {exterior.pressureWash.enabled && (
                          <div className="flex flex-wrap items-end gap-6">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Perimeter Feet</Label>
                              <Input
                                type="number"
                                min="0"
                                placeholder="Enter PF"
                                value={exterior.pressureWash.perimeterFeet}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/^0+/, '') || ""
                                  setExterior({ ...exterior, pressureWash: { ...exterior.pressureWash, perimeterFeet: val } }); handleSave()
                                }}
                                className="border-border/60 bg-secondary/50 w-32"
                              />
                            </div>
                            <div className="flex items-center gap-2 pb-2">
                              <Switch
                                checked={exterior.pressureWash.regularPwash}
                                onCheckedChange={(checked) => { setExterior({ ...exterior, pressureWash: { ...exterior.pressureWash, regularPwash: checked, cleanWithSteam: checked ? false : exterior.pressureWash.cleanWithSteam } }); handleSave() }}
                              />
                              <Label className="text-sm">Regular PWash</Label>
                            </div>
                            <div className="flex items-center gap-2 pb-2">
                              <Switch
                                checked={exterior.pressureWash.cleanWithSteam}
                                onCheckedChange={(checked) => { setExterior({ ...exterior, pressureWash: { ...exterior.pressureWash, cleanWithSteam: checked, regularPwash: checked ? false : exterior.pressureWash.regularPwash } }); handleSave() }}
                              />
                              <Label className="text-sm">Clean with Steam</Label>
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
                            onCheckedChange={(checked) => { setExterior({ ...exterior, dumpster: { ...exterior.dumpster, enabled: checked } }); handleSave() }}
                          />
                          <Label>Add Dumpster</Label>
                        </div>
                        {exterior.dumpster.enabled && (
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="space-y-2 w-[100px]">
                              <Label># of Dumpsters</Label>
                              <Input
                                type="number"
                                min="1"
                                max="20"
                                value={exterior.dumpster.count}
                                onChange={(e) => { setExterior({ ...exterior, dumpster: { ...exterior.dumpster, count: e.target.value.replace(/^0+/, '') || "" } }); handleSave() }}
                                className="border-border/60 bg-secondary/50"
                              />
                            </div>
                            <div className="space-y-2 w-[180px]">
                              <Label>Dumpster Size</Label>
                              <Select value={exterior.dumpster.size} onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setExterior({ ...exterior, dumpster: { ...exterior.dumpster, size: value } }); handleSave() }}>
                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
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
                                setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnits: [...exterior.hvac.condenserUnits, newUnit] } })
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
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.filter(u => u.id !== unit.id) } })
                                    handleSave()
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                <Select value={unit.tonnage} onValueChange={(__v) => {
                                  const value = __v === "__none__" ? "" : __v;
                                  setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, tonnage: value } : u) } })
                                  handleSave()
                                }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50 w-[100px]">
                                    <SelectValue placeholder="Tonnage" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                    {["2", "2.5", "3", "4", "5"].map(t => (
                                      <SelectItem key={t} value={t}>{t} Ton</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Select value={unit.seer} onValueChange={(__v) => {
                                  const value = __v === "__none__" ? "" : __v;
                                  setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, seer: value } : u) } })
                                  handleSave()
                                }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50 w-[100px]">
                                    <SelectValue placeholder="SEER" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                    <SelectItem value="13">13</SelectItem>
                                    <SelectItem value="14-16">14-16</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={unit.replace}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, replace: checked, serviceCall: checked ? false : u.serviceCall } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">Replace</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={unit.serviceCall}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, serviceCall: checked, replace: checked ? false : u.replace } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">Service Call</Label>
                                </div>
                                <Input
                                  placeholder="Enter Model and Serial Number"
                                  value={unit.f9Note}
                                  onChange={(e) => {
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, f9Note: e.target.value } : u) } })
                                    handleSave()
                                  }}
                                  className="border-border/60 bg-secondary/50 flex-1 min-w-[180px]"
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
                                setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: [...exterior.hvac.packageUnits, newUnit] } })
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
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.filter(u => u.id !== unit.id) } })
                                    handleSave()
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                <Select value={unit.unitType} onValueChange={(__v) => {
                                  const value = __v === "__none__" ? "" : __v;
                                  setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, unitType: value } : u) } })
                                  handleSave()
                                }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50 w-[160px]">
                                    <SelectValue placeholder="Unit Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                    <SelectItem value="ac">AC Unit</SelectItem>
                                    <SelectItem value="gas-furnace-ac">Gas Furnace & AC Unit</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select value={unit.tonnage} onValueChange={(__v) => {
                                  const value = __v === "__none__" ? "" : __v;
                                  setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, tonnage: value } : u) } })
                                  handleSave()
                                }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50 w-[100px]">
                                    <SelectValue placeholder="Tonnage" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                    {["2", "2.5", "3", "4", "5"].map(t => (
                                      <SelectItem key={t} value={t}>{t} Ton</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Select value={unit.seer} onValueChange={(__v) => {
                                  const value = __v === "__none__" ? "" : __v;
                                  setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, seer: value } : u) } })
                                  handleSave()
                                }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50 w-[100px]">
                                    <SelectValue placeholder="SEER" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                    <SelectItem value="13">13</SelectItem>
                                    <SelectItem value="14-16">14-16</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={unit.replace}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, replace: checked, serviceCall: checked ? false : u.serviceCall } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">Replace</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={unit.serviceCall}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, serviceCall: checked, replace: checked ? false : u.replace } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">Service Call</Label>
                                </div>
                                <Input
                                  placeholder="Enter Model and Serial Number"
                                  value={unit.f9Note}
                                  onChange={(e) => {
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, f9Note: e.target.value } : u) } })
                                    handleSave()
                                  }}
                                  className="border-border/60 bg-secondary/50 flex-1 min-w-[180px]"
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
                                setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplits: [...exterior.hvac.miniSplits, newUnit] } })
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
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.filter(u => u.id !== unit.id) } })
                                    handleSave()
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                <Select value={unit.zones} onValueChange={(__v) => {
                                  const value = __v === "__none__" ? "" : __v;
                                  setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, zones: value } : u) } })
                                  handleSave()
                                }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50 w-[100px]">
                                    <SelectValue placeholder="Zones" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                    {["1", "2", "3", "4"].map(z => (
                                      <SelectItem key={z} value={z}>{z} Zone</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={unit.highEfficiency}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, highEfficiency: checked } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">High Efficiency</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={unit.replace}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, replace: checked, serviceCall: checked ? false : u.serviceCall } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">Replace</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={unit.serviceCall}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, serviceCall: checked, replace: checked ? false : u.replace } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">Service Call</Label>
                                </div>
                                <Input
                                  placeholder="Enter Model and Serial Number"
                                  value={unit.f9Note}
                                  onChange={(e) => {
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, f9Note: e.target.value } : u) } })
                                    handleSave()
                                  }}
                                  className="border-border/60 bg-secondary/50 flex-1 min-w-[180px]"
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
                        {(exterior.electrical.exteriorOutlets > 0 || exterior.electrical.breakerPanel.enabled) &&
                          <Badge variant="secondary" className="text-xs">Saved</Badge>
                        }
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
                      <div className="flex flex-wrap items-end gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Exterior Outlets</Label>
                          <Input
                            type="number"
                            min="0"
                            value={exterior.electrical.exteriorOutlets}
                            onChange={(e) => {
                              const val = e.target.value.replace(/^0+/, '') || ""
                              setExterior({ ...exterior, electrical: { ...exterior.electrical, exteriorOutlets: val } }); handleSave()
                            }}
                            className="border-border/60 bg-secondary/50 w-24"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">30 Amp Disconnect</Label>
                          <Input
                            type="number"
                            min="0"
                            value={exterior.electrical.disconnect30Amp}
                            onChange={(e) => {
                              const val = e.target.value.replace(/^0+/, '') || ""
                              setExterior({ ...exterior, electrical: { ...exterior.electrical, disconnect30Amp: val } }); handleSave()
                            }}
                            className="border-border/60 bg-secondary/50 w-24"
                          />
                        </div>
                        <div className="flex items-center gap-2 pb-2">
                          <Switch
                            checked={exterior.electrical.breakerPanel.enabled}
                            onCheckedChange={(checked) => { setExterior({ ...exterior, electrical: { ...exterior.electrical, breakerPanel: { ...exterior.electrical.breakerPanel, enabled: checked } } }); handleSave() }}
                          />
                          <Label className="text-sm">Breaker Panel</Label>
                        </div>
                        {exterior.electrical.breakerPanel.enabled && (
                          <>
                            <div className="space-y-2 min-w-[120px]">
                              <Label className="text-xs text-muted-foreground">Amperage</Label>
                              <Select value={exterior.electrical.breakerPanel.amps} onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setExterior({ ...exterior, electrical: { ...exterior.electrical, breakerPanel: { ...exterior.electrical.breakerPanel, amps: value } } }); handleSave() }}>
                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                  {["70", "100", "125", "150", "200", "300"].map(a => (
                                    <SelectItem key={a} value={a}>{a} Amp</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-2 pb-2">
                              <Switch
                                checked={exterior.electrical.breakerPanel.arcFaults}
                                onCheckedChange={(checked) => { setExterior({ ...exterior, electrical: { ...exterior.electrical, breakerPanel: { ...exterior.electrical.breakerPanel, arcFaults: checked } } }); handleSave() }}
                              />
                              <Label className="text-sm">With Arc Faults</Label>
                            </div>
                          </>
                        )}
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
                      <div className="flex flex-wrap items-end gap-4">
                        <div className="flex items-center gap-2 pb-2">
                          <Switch
                            checked={exterior.finishes.some(f => f.type === "exterior-paint")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setExterior({ ...exterior, finishes: [...exterior.finishes, { id: Date.now(), type: "exterior-paint", measureType: "pf", value: "" }] })
                              } else {
                                setExterior({ ...exterior, finishes: exterior.finishes.filter(f => f.type !== "exterior-paint") })
                              }
                              handleSave()
                            }}
                          />
                          <Label className="text-sm">Exterior Paint</Label>
                        </div>
                        {exterior.finishes.some(f => f.type === "exterior-paint") && (
                          <>
                            <div className="flex items-center gap-2">
                              {(["pf", "sf"] as const).map((mt) => (
                                <Button
                                  key={mt}
                                  type="button"
                                  variant={exterior.finishes.find(f => f.type === "exterior-paint")?.measureType === mt ? "default" : "outline"}
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => {
                                    setExterior({ ...exterior, finishes: exterior.finishes.map(f => f.type === "exterior-paint" ? { ...f, measureType: mt } : f) })
                                    handleSave()
                                  }}
                                >
                                  {mt.toUpperCase()}
                                </Button>
                              ))}
                            </div>
                            <div className="space-y-2 min-w-[100px]">
                              <Select
                                value={exterior.finishes.find(f => f.type === "exterior-paint")?.value || ""}
                                onValueChange={(__v) => {
                                  const value = __v === "__none__" ? "" : __v;
                                  setExterior({ ...exterior, finishes: exterior.finishes.map(f => f.type === "exterior-paint" ? { ...f, value } : f) })
                                  handleSave()
                                }}
                              >
                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                  <SelectItem value="0.25">0.25</SelectItem>
                                  <SelectItem value="0.5">0.5</SelectItem>
                                  <SelectItem value="W">W</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                        <div className="flex items-center gap-2 pb-2">
                          <Switch
                            checked={exterior.finishes.some(f => f.type === "exterior-siding")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setExterior({ ...exterior, finishes: [...exterior.finishes, { id: Date.now(), type: "exterior-siding", measureType: "sf", value: "" }] })
                              } else {
                                setExterior({ ...exterior, finishes: exterior.finishes.filter(f => f.type !== "exterior-siding") })
                              }
                              handleSave()
                            }}
                          />
                          <Label className="text-sm">Exterior Siding</Label>
                        </div>
                        {exterior.finishes.some(f => f.type === "exterior-siding") && (
                          <>
                            <div className="flex items-center gap-2">
                              {(["pf", "sf"] as const).map((mt) => (
                                <Button
                                  key={mt}
                                  type="button"
                                  variant={exterior.finishes.find(f => f.type === "exterior-siding")?.measureType === mt ? "default" : "outline"}
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => {
                                    setExterior({ ...exterior, finishes: exterior.finishes.map(f => f.type === "exterior-siding" ? { ...f, measureType: mt } : f) })
                                    handleSave()
                                  }}
                                >
                                  {mt.toUpperCase()}
                                </Button>
                              ))}
                            </div>
                            <div className="space-y-2 min-w-[100px]">
                              <Select
                                value={exterior.finishes.find(f => f.type === "exterior-siding")?.value || ""}
                                onValueChange={(__v) => {
                                  const value = __v === "__none__" ? "" : __v;
                                  setExterior({ ...exterior, finishes: exterior.finishes.map(f => f.type === "exterior-siding" ? { ...f, value } : f) })
                                  handleSave()
                                }}
                              >
                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                  <SelectItem value="0.25">0.25</SelectItem>
                                  <SelectItem value="0.5">0.5</SelectItem>
                                  <SelectItem value="W">W</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </TabsContent>

                {/* FOUNDATION TAB */}
                <TabsContent value="foundation" className="mt-6 space-y-4">
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
                              onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, enabled: checked } }); handleSave() }}
                            />
                            <Label>Enable Crawlspace/Enclosure Area</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={foundation.crawlspace.acControlledSpace}
                              onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, acControlledSpace: checked } }); handleSave() }}
                            />
                            <Label className="text-sm">AC Controlled Space</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={foundation.crawlspace.heavyCleanArea}
                              onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, heavyCleanArea: checked } }); handleSave() }}
                            />
                            <Label className="text-sm">Heavy Clean Area</Label>
                          </div>
                        </div>
                        {foundation.crawlspace.enabled && (
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-end gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Foundation Wall Clean (PF)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="1"
                                  placeholder="PF"
                                  value={foundation.crawlspace.perimeterFeet}
                                  onChange={(e) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, perimeterFeet: e.target.value } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50 w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-auto [&::-webkit-inner-spin-button]:appearance-auto"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground"># of Piers</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={foundation.crawlspace.piersCount}
                                  onChange={(e) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, piersCount: e.target.value.replace(/^0+/, '') || "" } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50 w-24"
                                />
                              </div>
                              <div className="flex items-center gap-4 pb-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    checked={foundation.crawlspace.piersType === "short"}
                                    onChange={() => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, piersType: "short" } }); handleSave() }}
                                    className="h-4 w-4"
                                  />
                                  <Label className="text-sm">Short Piers</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    checked={foundation.crawlspace.piersType === "tall"}
                                    onChange={() => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, piersType: "tall" } }); handleSave() }}
                                    className="h-4 w-4"
                                  />
                                  <Label className="text-sm">Tall Piers</Label>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={foundation.crawlspace.cleanJoist}
                                  onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, cleanJoist: checked } }); handleSave() }}
                                />
                                <Label className="text-sm">Clean Joist</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={foundation.crawlspace.houseRewire !== ""}
                                  onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, houseRewire: checked ? " " : "" } }); handleSave() }}
                                />
                                <Label className="text-sm">House Rewire</Label>
                              </div>
                              {foundation.crawlspace.houseRewire !== "" && (
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="Enter Home SF"
                                  value={foundation.crawlspace.houseRewire.trim()}
                                  onChange={(e) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, houseRewire: e.target.value } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50 w-36"
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={foundation.crawlspace.preFirm}
                                onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, preFirm: checked } }); handleSave() }}
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
                                      onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, bellyPaper: checked } }); handleSave() }}
                                    />
                                    <Label className="text-sm">Belly Paper</Label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={foundation.crawlspace.floorInsulation}
                                      onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, floorInsulation: checked } }); handleSave() }}
                                    />
                                    <Label className="text-sm">Floor Insulation</Label>
                                  </div>
                                  {foundation.crawlspace.floorInsulation && (
                                    <Select value={foundation.crawlspace.floorInsulationType} onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, floorInsulationType: value } }); handleSave() }}>
                                      <SelectTrigger className="w-48 border-border/60 bg-secondary/50">
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                        <SelectItem value="r13">{"4' - R-13 Unfaced Batt"}</SelectItem>
                                        <SelectItem value="r19">{"6' - R-19 Unfaced Batt"}</SelectItem>
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
                                  onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, muck: checked, muckHeavy: checked ? false : foundation.crawlspace.muckHeavy } }); handleSave() }}
                                />
                                <Label className="text-sm">Water Muck</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={foundation.crawlspace.muckHeavy}
                                  onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, muckHeavy: checked, muck: checked ? false : foundation.crawlspace.muck } }); handleSave() }}
                                />
                                <Label className="text-sm">Water Muck Heavy</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={foundation.crawlspace.standingWater}
                                  onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, standingWater: checked } }); handleSave() }}
                                />
                                <Label className="text-sm">Standing Water</Label>
                              </div>
                            </div>
                            {foundation.crawlspace.muckHeavy && (
                              <p className="text-xs text-amber-500">Note: NFIP requires photos of standing mud to endorse for heavy Muck</p>
                            )}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Enclosure/Basement Removal Items */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
                      <div className="flex items-center gap-3">
                        <Trash2 className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Enclosure/Basement Removal Items</span>
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
                              onCheckedChange={(checked) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, sandRemoval: { ...foundation.enclosureRemoval.sandRemoval, enabled: checked } } }); handleSave() }}
                            />
                            <Label>Sand/Mud Removal</Label>
                            <span className="text-xs text-muted-foreground">(cubic feet)</span>
                          </div>
                          {foundation.enclosureRemoval.sandRemoval.enabled && (
                            <div className="ml-8 flex flex-wrap items-end gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Length (FT)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="Length"
                                  value={foundation.enclosureRemoval.sandRemoval.length}
                                  onChange={(e) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, sandRemoval: { ...foundation.enclosureRemoval.sandRemoval, length: e.target.value } } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50 w-24"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Width (FT)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="Width"
                                  value={foundation.enclosureRemoval.sandRemoval.width}
                                  onChange={(e) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, sandRemoval: { ...foundation.enclosureRemoval.sandRemoval, width: e.target.value } } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50 w-24"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Depth (FT)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="Depth"
                                  value={foundation.enclosureRemoval.sandRemoval.depth}
                                  onChange={(e) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, sandRemoval: { ...foundation.enclosureRemoval.sandRemoval, depth: e.target.value } } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50 w-24"
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
                              onCheckedChange={(checked) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, backfill: { ...foundation.enclosureRemoval.backfill, enabled: checked } } }); handleSave() }}
                            />
                            <Label>Backfill Around/In Foundation</Label>
                            <span className="text-xs text-muted-foreground">(cubic feet)</span>
                          </div>
                          {foundation.enclosureRemoval.backfill.enabled && (
                            <div className="ml-8 flex flex-wrap items-end gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Length (FT)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={foundation.enclosureRemoval.backfill.length}
                                  onChange={(e) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, backfill: { ...foundation.enclosureRemoval.backfill, length: e.target.value } } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50 w-24"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Width (FT)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={foundation.enclosureRemoval.backfill.width}
                                  onChange={(e) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, backfill: { ...foundation.enclosureRemoval.backfill, width: e.target.value } } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50 w-24"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Depth (FT)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={foundation.enclosureRemoval.backfill.depth}
                                  onChange={(e) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, backfill: { ...foundation.enclosureRemoval.backfill, depth: e.target.value } } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50 w-24"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <Switch
                            checked={foundation.enclosureRemoval.confinedSpace}
                            onCheckedChange={(checked) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, confinedSpace: checked } }); handleSave() }}
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
                        <span className="font-medium text-foreground">Plumbing - Water Heater / Sump Pump / Water Softener</span>
                        {foundation.sumpPump.enabled && <Badge variant="secondary" className="text-xs">Saved</Badge>}
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
                      <div className="flex flex-wrap items-end gap-4">
                        <div className="flex items-center gap-2 pb-2">
                          <Switch
                            checked={foundation.sumpPump.enabled}
                            onCheckedChange={(checked) => { setFoundation({ ...foundation, sumpPump: { ...foundation.sumpPump, enabled: checked } }); handleSave() }}
                          />
                          <Label>Enable Sump Pump</Label>
                        </div>
                        {foundation.sumpPump.enabled && (
                          <>
                            <div className="space-y-2 min-w-[140px]">
                              <Label className="text-xs text-muted-foreground">Action</Label>
                              <Select value={foundation.sumpPump.action} onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setFoundation({ ...foundation, sumpPump: { ...foundation.sumpPump, action: value } }); handleSave() }}>
                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                  <SelectItem value="replace">Replace</SelectItem>
                                  <SelectItem value="detach-reset">Detach and Reset</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 min-w-[200px]">
                              <Label className="text-xs text-muted-foreground">Horsepower</Label>
                              <Select value={foundation.sumpPump.hp} onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setFoundation({ ...foundation, sumpPump: { ...foundation.sumpPump, hp: value } }); handleSave() }}>
                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                  <SelectItem value="1/3">1/3 HP - up to 1 1/2 discharge</SelectItem>
                                  <SelectItem value="1/2">1/2 HP - up to 1 1/2 discharge</SelectItem>
                                  <SelectItem value="3/4">3/4 HP - up to 1 1/2 discharge</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 flex-1 min-w-[150px]">
                              <Label className="text-xs text-muted-foreground">F9 Model/Serial...</Label>
                              <Input
                                type="text"
                                placeholder="Enter model and serial..."
                                value={foundation.sumpPump.f9Note}
                                onChange={(e) => { setFoundation({ ...foundation, sumpPump: { ...foundation.sumpPump, f9Note: e.target.value } }); handleSave() }}
                                className="border-border/60 bg-secondary/50"
                              />
                            </div>
                          </>
                        )}
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
                                  setFoundation({ ...foundation, hvac: { ...foundation.hvac, airHandlers: [{ id: Date.now(), type: "", tonnage: "", heatElementCount: "", action: "", f9Note: "" }] } })
                                } else if (!checked) {
                                  setFoundation({ ...foundation, hvac: { ...foundation.hvac, airHandlers: [] } })
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
                                setFoundation({ ...foundation, hvac: { ...foundation.hvac, airHandlers: [...foundation.hvac.airHandlers, { id: Date.now(), type: "", tonnage: "", heatElementCount: "", action: "", f9Note: "" }] } })
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
                                  setFoundation({ ...foundation, hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.filter(h => h.id !== handler.id) } })
                                  handleSave()
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap items-end gap-4">
                              <div className="space-y-2 min-w-[160px]">
                                <Label className="text-sm">Type</Label>
                                <Select value={handler.type} onValueChange={(__v) => {
                                  const value = __v === "__none__" ? "" : __v;
                                  setFoundation({ ...foundation, hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.map(h => h.id === handler.id ? { ...h, type: value } : h) } })
                                  handleSave()
                                }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                    <SelectItem value="air-handler">Air Handler</SelectItem>
                                    <SelectItem value="with-heat-element">With Heat Element</SelectItem>
                                    <SelectItem value="with-heat-element-a-coil">With Heat Element & A-coil</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2 min-w-[100px]">
                                <Label className="text-sm">Tonnage</Label>
                                <Select value={handler.tonnage} onValueChange={(__v) => {
                                  const value = __v === "__none__" ? "" : __v;
                                  setFoundation({ ...foundation, hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.map(h => h.id === handler.id ? { ...h, tonnage: value } : h) } })
                                  handleSave()
                                }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                    {["2", "2.5", "3", "4", "5"].map(t => (
                                      <SelectItem key={t} value={t}>{t} Ton</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2 min-w-[140px]">
                                <Label className="text-sm">Action</Label>
                                <Select value={handler.action} onValueChange={(__v) => {
                                  const value = __v === "__none__" ? "" : __v;
                                  setFoundation({ ...foundation, hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.map(h => h.id === handler.id ? { ...h, action: value } : h) } })
                                  handleSave()
                                }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                    <SelectItem value="replace">Replace</SelectItem>
                                    <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2 flex-1 min-w-[150px]">
                                <Label className="text-sm">F9 Model/Serial...</Label>
                                <Input
                                  type="text"
                                  placeholder="Enter model and serial..."
                                  value={handler.f9Note}
                                  onChange={(e) => {
                                    setFoundation({ ...foundation, hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.map(h => h.id === handler.id ? { ...h, f9Note: e.target.value } : h) } })
                                    handleSave()
                                  }}
                                  className="border-border/60 bg-secondary/50"
                                />
                              </div>
                              {(handler.type === "with-heat-element" || handler.type === "with-heat-element-a-coil") && (
                                <div className="space-y-2 min-w-[100px]">
                                  <Label className="text-sm">With Heat Element</Label>
                                  <Select value={handler.heatElementCount} onValueChange={(__v) => {
                                    const value = __v === "__none__" ? "" : __v;
                                    setFoundation({ ...foundation, hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.map(h => h.id === handler.id ? { ...h, heatElementCount: value } : h) } })
                                    handleSave()
                                  }}>
                                    <SelectTrigger className="border-border/60 bg-secondary/50">
                                      <SelectValue placeholder="QTY" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                      {[1, 2, 3, 4, 5].map(n => (
                                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
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
                            onCheckedChange={(checked) => { setFoundation({ ...foundation, basement: { ...foundation.basement, enabled: checked } }); handleSave() }}
                          />
                          <Label>Enable Basement</Label>
                        </div>
                        {foundation.basement.enabled && (
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-end gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Foundation Wall Clean (PF)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="1"
                                  placeholder="PF"
                                  value={foundation.basement.wallCleanPf}
                                  onChange={(e) => { setFoundation({ ...foundation, basement: { ...foundation.basement, wallCleanPf: e.target.value } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50 w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-auto [&::-webkit-inner-spin-button]:appearance-auto"
                                />
                              </div>
                              <div className="flex items-center gap-2 pb-2">
                                <Switch
                                  checked={foundation.basement.muck}
                                  onCheckedChange={(checked) => { setFoundation({ ...foundation, basement: { ...foundation.basement, muck: checked, muckHeavy: checked ? false : foundation.basement.muckHeavy } }); handleSave() }}
                                />
                                <Label className="text-sm">Water Muck</Label>
                              </div>
                              <div className="flex flex-col gap-1 pb-2">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={foundation.basement.muckHeavy}
                                    onCheckedChange={(checked) => { setFoundation({ ...foundation, basement: { ...foundation.basement, muckHeavy: checked, muck: checked ? false : foundation.basement.muck } }); handleSave() }}
                                  />
                                  <Label className="text-sm">Water Muck Heavy</Label>
                                </div>
                                {foundation.basement.muckHeavy && (
                                  <p className="text-xs text-amber-500 ml-9">Note: NFIP requires photos of standing mud to endorse for heavy Muck</p>
                                )}
                              </div>
                            </div>
                            {/* Drywall */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Switch
                                  checked={foundation.basement.drywallEnabled}
                                  onCheckedChange={(checked) => { setFoundation({ ...foundation, basement: { ...foundation.basement, drywallEnabled: checked } }); handleSave() }}
                                />
                                <Label>Drywall Replacement Height</Label>
                              </div>
                              {foundation.basement.drywallEnabled && (
                                <div className="ml-8 flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant={foundation.basement.drywallMeasureType === "sf" ? "default" : "outline"}
                                      size="sm"
                                      className="h-7 px-2 text-xs"
                                      onClick={() => { setFoundation({ ...foundation, basement: { ...foundation.basement, drywallMeasureType: "sf", drywallValue: "" } }); handleSave() }}
                                    >
                                      Square Feet
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={foundation.basement.drywallMeasureType === "lf" ? "default" : "outline"}
                                      size="sm"
                                      className="h-7 px-2 text-xs"
                                      onClick={() => { setFoundation({ ...foundation, basement: { ...foundation.basement, drywallMeasureType: "lf", drywallValue: "" } }); handleSave() }}
                                    >
                                      Linear Feet
                                    </Button>
                                  </div>
                                  {foundation.basement.drywallMeasureType === "sf" ? (
                                    <Select
                                      value={foundation.basement.drywallValue}
                                      onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setFoundation({ ...foundation, basement: { ...foundation.basement, drywallValue: value } }); handleSave() }}
                                    >
                                      <SelectTrigger className="w-24 border-border/60 bg-secondary/50">
                                        <SelectValue placeholder="SF" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                        <SelectItem value="0.5">0.5</SelectItem>
                                        <SelectItem value="W">W</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <Input
                                      type="number"
                                      min="0"
                                      placeholder="LF"
                                      value={foundation.basement.drywallValue}
                                      onChange={(e) => { setFoundation({ ...foundation, basement: { ...foundation.basement, drywallValue: e.target.value.replace(/^0+/, '') } }); handleSave() }}
                                      className="w-24 border-border/60 bg-secondary/50"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                            {/* Stair Cleaning */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Switch
                                  checked={foundation.basement.stairCleaning}
                                  onCheckedChange={(checked) => { setFoundation({ ...foundation, basement: { ...foundation.basement, stairCleaning: checked } }); handleSave() }}
                                />
                                <Label>Enable Stair Cleaning</Label>
                              </div>
                              {foundation.basement.stairCleaning && (
                                <div className="ml-8 flex flex-wrap items-end gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground"># of stairs submerged</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={foundation.basement.stairCount}
                                      onChange={(e) => { setFoundation({ ...foundation, basement: { ...foundation.basement, stairCount: e.target.value.replace(/^0+/, '') || "" } }); handleSave() }}
                                      className="border-border/60 bg-secondary/50 w-24"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Width of Treads (ft)</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.1"
                                      value={foundation.basement.treadWidth}
                                      onChange={(e) => { setFoundation({ ...foundation, basement: { ...foundation.basement, treadWidth: e.target.value } }); handleSave() }}
                                      className="border-border/60 bg-secondary/50 w-24"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Total Length of Stringers Submerged (ft)</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.1"
                                      value={foundation.basement.stringersLength}
                                      onChange={(e) => { setFoundation({ ...foundation, basement: { ...foundation.basement, stringersLength: e.target.value } }); handleSave() }}
                                      className="border-border/60 bg-secondary/50 w-24"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* Foundation Windows */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={foundation.basement.foundationWindows.length > 0}
                                    onCheckedChange={(checked) => {
                                      if (checked && foundation.basement.foundationWindows.length === 0) {
                                        setFoundation({ ...foundation, basement: { ...foundation.basement, foundationWindows: [{ id: Date.now(), type: "", size: "", quantity: "", material: "" }] } })
                                      } else if (!checked) {
                                        setFoundation({ ...foundation, basement: { ...foundation.basement, foundationWindows: [] } })
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
                                      setFoundation({ ...foundation, basement: { ...foundation.basement, foundationWindows: [...foundation.basement.foundationWindows, { id: Date.now(), type: "", size: "", quantity: "", material: "" }] } })
                                      handleSave()
                                    }}
                                  >
                                    <Plus className="h-3 w-3" /> Add Window
                                  </Button>
                                )}
                              </div>
                              {foundation.basement.foundationWindows.map((win, index) => (
                                <div key={win.id} className="ml-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/40 bg-secondary/30 p-3">
                                  <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-sm font-medium">Window {index + 1}</span>
                                  <Select value={win.type} onValueChange={(__v) => {
                                    const value = __v === "__none__" ? "" : __v;
                                    setFoundation({ ...foundation, basement: { ...foundation.basement, foundationWindows: foundation.basement.foundationWindows.map(w => w.id === win.id ? { ...w, type: value } : w) } })
                                    handleSave()
                                  }}>
                                    <SelectTrigger className="w-28 border-border/60 bg-secondary/50">
                                      <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                      <SelectItem value="casement">Casement</SelectItem>
                                      <SelectItem value="single-hung">Single Hung</SelectItem>
                                      <SelectItem value="double-hung">Double Hung</SelectItem>
                                      <SelectItem value="slider">Slider</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Select value={win.size} onValueChange={(__v) => {
                                    const value = __v === "__none__" ? "" : __v;
                                    setFoundation({ ...foundation, basement: { ...foundation.basement, foundationWindows: foundation.basement.foundationWindows.map(w => w.id === win.id ? { ...w, size: value } : w) } })
                                    handleSave()
                                  }}>
                                    <SelectTrigger className="w-24 border-border/60 bg-secondary/50">
                                      <SelectValue placeholder="Size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                      <SelectItem value="4-8">4-8 SF</SelectItem>
                                      <SelectItem value="9-12">9-12 SF</SelectItem>
                                      <SelectItem value="13-18">13-18 SF</SelectItem>
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
                                        setFoundation({ ...foundation, basement: { ...foundation.basement, foundationWindows: foundation.basement.foundationWindows.map(w => w.id === win.id ? { ...w, quantity: e.target.value.replace(/^0+/, '') || "" } : w) } })
                                        handleSave()
                                      }}
                                      className="w-14 border-border/60 bg-secondary/50"
                                    />
                                  </div>
                                  <Select value={win.material} onValueChange={(__v) => {
                                    const value = __v === "__none__" ? "" : __v;
                                    setFoundation({ ...foundation, basement: { ...foundation.basement, foundationWindows: foundation.basement.foundationWindows.map(w => w.id === win.id ? { ...w, material: value } : w) } })
                                    handleSave()
                                  }}>
                                    <SelectTrigger className="w-24 border-border/60 bg-secondary/50">
                                      <SelectValue placeholder="Material" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                      <SelectItem value="vinyl">Vinyl</SelectItem>
                                      <SelectItem value="aluminum">Aluminum</SelectItem>
                                      <SelectItem value="wood">Wood</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive ml-auto"
                                    onClick={() => {
                                      setFoundation({ ...foundation, basement: { ...foundation.basement, foundationWindows: foundation.basement.foundationWindows.filter(w => w.id !== win.id) } })
                                      handleSave()
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            {/* Foundation Door */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <Switch
                                  checked={foundation.basement.foundationDoor}
                                  onCheckedChange={(checked) => { setFoundation({ ...foundation, basement: { ...foundation.basement, foundationDoor: checked } }); handleSave() }}
                                />
                                <Label>Enable Foundation Door</Label>
                                {foundation.basement.foundationDoor && (
                                  <Select value={foundation.basement.foundationDoorAction} onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setFoundation({ ...foundation, basement: { ...foundation.basement, foundationDoorAction: value } }); handleSave() }}>
                                    <SelectTrigger className="w-48 border-border/60 bg-secondary/50">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                      <SelectItem value="detach-reset-handle">Detach & Reset Handle</SelectItem>
                                      <SelectItem value="replace-handle">Replace Handle</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                              {foundation.basement.foundationDoor && (
                                <p className="ml-9 text-xs text-amber-500">Note: The inclusion of the interior slab only</p>
                              )}
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
                        {(foundation.electrical.outlets110 > 0 || foundation.electrical.breakerPanel.enabled || foundation.electrical.meterBox) && <Badge variant="secondary" className="text-xs">Saved</Badge>}
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-end gap-4">
                          <div className="space-y-2">
                            <Label>110 outlet</Label>
                            <Select value={foundation.electrical.outlets110} onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setFoundation({ ...foundation, electrical: { ...foundation.electrical, outlets110: value } }); handleSave() }}>
                              <SelectTrigger className="w-20 border-border/60 bg-secondary/50">
                                <SelectValue placeholder="QTY" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>220 outlet</Label>
                            <Select value={foundation.electrical.outlets220} onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setFoundation({ ...foundation, electrical: { ...foundation.electrical, outlets220: value } }); handleSave() }}>
                              <SelectTrigger className="w-20 border-border/60 bg-secondary/50">
                                <SelectValue placeholder="QTY" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                {[0, 1, 2, 3, 4, 5].map(n => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>GFI outlet</Label>
                            <Select value={foundation.electrical.gfiOutlets} onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setFoundation({ ...foundation, electrical: { ...foundation.electrical, gfiOutlets: value } }); handleSave() }}>
                              <SelectTrigger className="w-20 border-border/60 bg-secondary/50">
                                <SelectValue placeholder="QTY" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                {[0, 1, 2, 3, 4, 5].map(n => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Light Switch</Label>
                            <Select value={foundation.electrical.lightSwitch} onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setFoundation({ ...foundation, electrical: { ...foundation.electrical, lightSwitch: value } }); handleSave() }}>
                              <SelectTrigger className="w-20 border-border/60 bg-secondary/50">
                                <SelectValue placeholder="QTY" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Junction Box</Label>
                            <Select value={foundation.electrical.junctionBox} onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setFoundation({ ...foundation, electrical: { ...foundation.electrical, junctionBox: value } }); handleSave() }}>
                              <SelectTrigger className="w-20 border-border/60 bg-secondary/50">
                                <SelectValue placeholder="QTY" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                {[0, 1, 2, 3, 4, 5].map(n => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {/* Breaker Panel */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={foundation.electrical.breakerPanel.enabled}
                              onCheckedChange={(checked) => { setFoundation({ ...foundation, electrical: { ...foundation.electrical, breakerPanel: { ...foundation.electrical.breakerPanel, enabled: checked } } }); handleSave() }}
                            />
                            <Label>Enable Breaker Panel</Label>
                          </div>
                          {foundation.electrical.breakerPanel.enabled && (
                            <div className="ml-8 flex items-center gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm">Amperage</Label>
                                <Select value={foundation.electrical.breakerPanel.amps} onValueChange={(__v) => { const value = __v === "__none__" ? "" : __v; setFoundation({ ...foundation, electrical: { ...foundation.electrical, breakerPanel: { ...foundation.electrical.breakerPanel, amps: value } } }); handleSave() }}>
                                  <SelectTrigger className="w-32 border-border/60 bg-secondary/50">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                    {["100", "150", "200", "300"].map(a => (
                                      <SelectItem key={a} value={a}>{a} Amp</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center gap-2 pt-6">
                                <Switch
                                  checked={foundation.electrical.breakerPanel.arcFaults}
                                  onCheckedChange={(checked) => { setFoundation({ ...foundation, electrical: { ...foundation.electrical, breakerPanel: { ...foundation.electrical.breakerPanel, arcFaults: checked } } }); handleSave() }}
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
                            onCheckedChange={(checked) => { setFoundation({ ...foundation, electrical: { ...foundation.electrical, meterBox: checked } }); handleSave() }}
                          />
                          <Label>Enable Meter Box</Label>
                          {foundation.electrical.meterBox && (
                            <Select defaultValue="qty">
                              <SelectTrigger className="w-20 border-border/60 bg-secondary/50">
                                <SelectValue placeholder="QTY" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
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
                </TabsContent>

                {/* INTERIOR TAB */}
                <TabsContent value="interior" className="mt-6 space-y-4">
                  {rooms.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/60 bg-secondary/20 p-8 text-center">
                      <Home className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium text-foreground">No Rooms Added</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Add rooms to enter interior damage details</p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2">
                        <Button variant="outline" className="gap-2 border-border/60" onClick={() => addRoom("room", "")}>
                          <Plus className="h-4 w-4" />
                          Room
                        </Button>
                        <Button variant="outline" className="gap-2 border-border/60" onClick={() => addRoom("bathroom", "")}>
                          <Plus className="h-4 w-4" />
                          Bathroom
                        </Button>
                        <Button variant="outline" className="gap-2 border-border/60" onClick={() => addRoom("kitchen", "")}>
                          <Plus className="h-4 w-4" />
                          Kitchen
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Room List */}
                      {rooms.map((room) => (
                        <RoomCard
                          key={room.id}
                          room={room}
                          onUpdate={(updates) => updateRoom(room.id, updates)}
                          onCopy={() => copyRoom(room.id)}
                          onRemove={() => removeRoom(room.id)}
                        />
                      ))}

                      {/* Add Room Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" className="gap-2 border-border/60" onClick={() => addRoom("room", "")}>
                          <Plus className="h-4 w-4" />
                          Room
                        </Button>
                        <Button variant="outline" className="gap-2 border-border/60" onClick={() => addRoom("bathroom", "")}>
                          <Plus className="h-4 w-4" />
                          Bathroom
                        </Button>
                        <Button variant="outline" className="gap-2 border-border/60" onClick={() => addRoom("kitchen", "")}>
                          <Plus className="h-4 w-4" />
                          Kitchen
                        </Button>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submission Summary */}
          <Card className="border-border/60 bg-card/80 shadow-md sticky top-6">
            <CardHeader>
              <CardTitle className="text-foreground">Estimate Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rooms</span>
                <span className="font-medium text-foreground">{rooms.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Token cost</span>
                <span className="font-medium text-foreground">1 EE</span>
              </div>
              <div className="border-t border-border/60 pt-4">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Your balance</span>
                    <Badge variant="secondary">12 EE</Badge>
                  </div>
                </div>
              </div>
              <Button className="w-full shadow-md shadow-primary/20">
                Review & Generate ESX
              </Button>
              <Link href="/express-estimate">
                <Button variant="ghost" className="w-full">Cancel</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="border-border/60 bg-card/80 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                  <HelpCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Need Help?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fill in site inspection details and we&apos;ll generate an estimate-ready ESX file.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
