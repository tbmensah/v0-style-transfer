"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Copy,
  Home,
  Droplets,
  Zap,
  Wind,
  HelpCircle
} from "lucide-react"

// Types
interface Room {
  id: number
  name: string
  type: string
  sqft: string
  flooring: FlooringOptions
  trim: TrimOptions
  wallCovering: WallCoveringOptions
  electrical: ElectricalOptions
  windows: WindowItem[]
  doors: DoorItem[]
  // Bathroom specific
  vanity?: VanityOptions
  toilet?: ToiletOptions
  shower?: ShowerOptions
  // Kitchen specific
  cabinets?: CabinetOptions
  countertop?: CountertopOptions
  appliances?: ApplianceOptions
}

interface FlooringOptions {
  enabled: boolean
  type: string
  grade: string
  subfloorReplacement: boolean
  vaporBarrier: boolean
}

interface TrimOptions {
  enabled: boolean
  baseboardHeight: string
  material: string
  shoe: boolean
  baseCap: boolean
  finish: string
}

interface WallCoveringOptions {
  enabled: boolean
  type: string
  replacementHeight: string
  texture: string
  ceilingDamaged: boolean
}

interface ElectricalOptions {
  outlets110: number
  outlets220: number
  gfiOutlets: number
  lightSwitches: number
  ceilingLights: number
  ceilingFans: number
}

interface WindowItem {
  id: number
  type: string
  size: string
  grade: string
  casing: string
  marbleSill: boolean
}

interface DoorItem {
  id: number
  category: "interior" | "exterior"
  type: string
  grade: string
  finish: string
  handleAction: string
}

interface VanityOptions {
  enabled: boolean
  linearFeet: number
  countertop: string
  backsplash: boolean
}

interface ToiletOptions {
  enabled: boolean
  action: string
  seatReplacement: boolean
}

interface ShowerOptions {
  enabled: boolean
  type: string
  size: string
  glassDoor: boolean
  tileNiche: boolean
}

interface CabinetOptions {
  enabled: boolean
  linearFeet: number
  grade: string
  action: string
  toeKick: boolean
}

interface CountertopOptions {
  enabled: boolean
  type: string
  sqft: number
  backsplash: boolean
  sinkAction: string
  faucetAction: string
}

interface ApplianceOptions {
  refrigerator: { enabled: boolean; type: string; size: string; grade: string; action: string }
  dishwasher: { enabled: boolean; grade: string; action: string }
  range: { enabled: boolean; type: string; fuel: string; grade: string; action: string }
  waterHeater: { enabled: boolean; size: string; warranty: string; action: string }
}

// Default values
const defaultRoom: Omit<Room, "id" | "name"> = {
  type: "living-room",
  sqft: "",
  flooring: { enabled: false, type: "vinyl-plank", grade: "standard", subfloorReplacement: false, vaporBarrier: false },
  trim: { enabled: false, baseboardHeight: "4", material: "mdf", shoe: false, baseCap: false, finish: "paint" },
  wallCovering: { enabled: false, type: "drywall", replacementHeight: "4", texture: "smooth", ceilingDamaged: false },
  electrical: { outlets110: 0, outlets220: 0, gfiOutlets: 0, lightSwitches: 0, ceilingLights: 0, ceilingFans: 0 },
  windows: [],
  doors: [],
}

const defaultBathroomExtras = {
  vanity: { enabled: false, linearFeet: 0, countertop: "cultured-marble", backsplash: false },
  toilet: { enabled: false, action: "replace", seatReplacement: false },
  shower: { enabled: false, type: "fiberglass-tub-shower", size: "up-to-60", glassDoor: false, tileNiche: false },
}

const defaultKitchenExtras = {
  cabinets: { enabled: false, linearFeet: 0, grade: "standard", action: "replace", toeKick: false },
  countertop: { enabled: false, type: "laminate", sqft: 0, backsplash: false, sinkAction: "replace", faucetAction: "replace" },
  appliances: {
    refrigerator: { enabled: false, type: "top-freezer", size: "18-22", grade: "standard", action: "replace" },
    dishwasher: { enabled: false, grade: "standard", action: "replace" },
    range: { enabled: false, type: "free-standing", fuel: "electric", grade: "standard", action: "replace" },
    waterHeater: { enabled: false, size: "40", warranty: "6", action: "replace" },
  },
}

export default function NewExpressEstimatePage() {
  const [activeTab, setActiveTab] = useState("exterior")
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
    pressureWash: { enabled: false, sqft: "", cleanWithSteam: false },
    dumpster: { enabled: false, count: 1, size: "20", pickupTruck: false, dumpTruck: false },
    insulation: { enabled: false, type: "r13", sqft: "" },
    hvac: {
      condenserUnit: { enabled: false, tonnage: "2", seer: "14" },
      packageUnit: { enabled: false, tonnage: "2", seer: "14" },
      gasAC: { enabled: false, tonnage: "2", seer: "14" },
      miniSplit: { enabled: false, zones: "1", highEfficiency: false },
    },
    electrical: {
      exteriorOutlets: 0,
      disconnect30Amp: 0,
      breakerPanel: { enabled: false, amps: "200", arcFaults: false },
    },
    exteriorPaint: { enabled: false, sqft: "" },
    exteriorSiding: { enabled: false, sqft: "" },
    f9Note: "",
  })

  // Foundation State
  const [foundation, setFoundation] = useState({
    crawlspace: {
      enabled: false,
      foundationWallClean: "",
      standingWater: false,
      piers: 0,
      preFirm: true,
      bellyPaper: false,
      floorInsulation: false,
      floorInsulationType: "r13",
      muck: false,
      muckHeavy: false,
    },
    basement: {
      enabled: false,
      foundationWallClean: "",
      backerBoardBehindBrick: "",
    },
    enclosureRemoval: {
      sandRemoval: { enabled: false, length: "", width: "", depth: "" },
      backfill: { enabled: false, length: "", width: "", depth: "" },
      confinedSpace: false,
    },
    electrical: {
      outlet110: 0,
      outlet220: 0,
      homeRewire: "",
    },
    hvac: {
      airHandler: { enabled: false, tonnage: "2", heatElement: false, aCoil: false },
    },
    sumpPump: { enabled: false, action: "replace", hp: "1/3" },
    f9Note: "",
  })

  // Interior Rooms
  const [rooms, setRooms] = useState<Room[]>([])

  // Handlers
  const handleSave = () => {
    setIsSaved(false)
    setTimeout(() => setIsSaved(true), 1000)
  }

  const addRoom = (type: string = "living-room", name: string = "") => {
    const roomName = name || `Room ${rooms.length + 1}`
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
    setRooms(rooms.map(r => r.id === roomId ? { ...r, ...updates } : r))
    handleSave()
  }

  const addWindow = (roomId: number) => {
    const room = rooms.find(r => r.id === roomId)
    if (room) {
      const newWindow: WindowItem = {
        id: Date.now(),
        type: "vinyl-double-hung",
        size: "4-8",
        grade: "standard",
        casing: "paint",
        marbleSill: false,
      }
      updateRoom(roomId, { windows: [...room.windows, newWindow] })
    }
  }

  const addDoor = (roomId: number, category: "interior" | "exterior") => {
    const room = rooms.find(r => r.id === roomId)
    if (room) {
      const newDoor: DoorItem = {
        id: Date.now(),
        category,
        type: category === "interior" ? "6-panel" : "wood-door",
        grade: "standard",
        finish: "paint",
        handleAction: "replace",
      }
      updateRoom(roomId, { doors: [...room.doors, newDoor] })
    }
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
                    value={projectDetails.inspectionDate}
                    onChange={(e) => { setProjectDetails({ ...projectDetails, inspectionDate: e.target.value }); handleSave() }}
                    className="border-border/60 bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType" className="text-foreground">Property Type</Label>
                  <Select value={projectDetails.propertyType} onValueChange={(value) => { setProjectDetails({ ...projectDetails, propertyType: value }); handleSave() }}>
                    <SelectTrigger className="border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-family">Single Family Home</SelectItem>
                      <SelectItem value="multi-family">Multi-Family</SelectItem>
                      <SelectItem value="condo">Condominium</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="mobile">Mobile Home</SelectItem>
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
                  {/* Pressure Wash */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
                      <div className="flex items-center gap-3">
                        <Droplets className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Pressure Wash / Cleaning</span>
                        {exterior.pressureWash.enabled && <Badge variant="secondary" className="text-xs">Active</Badge>}
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
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Square Footage</Label>
                              <Input
                                type="number"
                                placeholder="Enter SF"
                                value={exterior.pressureWash.sqft}
                                onChange={(e) => { setExterior({ ...exterior, pressureWash: { ...exterior.pressureWash, sqft: e.target.value } }); handleSave() }}
                                className="border-border/60 bg-secondary/50"
                              />
                            </div>
                            <div className="flex items-center gap-3 pt-6">
                              <Switch
                                checked={exterior.pressureWash.cleanWithSteam}
                                onCheckedChange={(checked) => { setExterior({ ...exterior, pressureWash: { ...exterior.pressureWash, cleanWithSteam: checked } }); handleSave() }}
                              />
                              <Label>Clean with Steam</Label>
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
                        {exterior.dumpster.enabled && <Badge variant="secondary" className="text-xs">Active</Badge>}
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
                          <Label>Enable Dumpster</Label>
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
                                onChange={(e) => { setExterior({ ...exterior, dumpster: { ...exterior.dumpster, count: parseInt(e.target.value) || 1 } }); handleSave() }}
                                className="border-border/60 bg-secondary/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Dumpster Size</Label>
                              <Select value={exterior.dumpster.size} onValueChange={(value) => { setExterior({ ...exterior, dumpster: { ...exterior.dumpster, size: value } }); handleSave() }}>
                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="12">12 Yards</SelectItem>
                                  <SelectItem value="20">20 Yards</SelectItem>
                                  <SelectItem value="30">30 Yards</SelectItem>
                                  <SelectItem value="40">40 Yards</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-3 pt-6">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={exterior.dumpster.pickupTruck}
                                  onCheckedChange={(checked) => { setExterior({ ...exterior, dumpster: { ...exterior.dumpster, pickupTruck: checked } }); handleSave() }}
                                />
                                <Label className="text-sm">Pickup Truck Load</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={exterior.dumpster.dumpTruck}
                                  onCheckedChange={(checked) => { setExterior({ ...exterior, dumpster: { ...exterior.dumpster, dumpTruck: checked } }); handleSave() }}
                                />
                                <Label className="text-sm">Single Axle Dump Truck</Label>
                              </div>
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
                        {(exterior.hvac.condenserUnit.enabled || exterior.hvac.packageUnit.enabled || exterior.hvac.gasAC.enabled || exterior.hvac.miniSplit.enabled) && 
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                        }
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
                      <div className="space-y-6">
                        {/* Condenser Unit */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={exterior.hvac.condenserUnit.enabled}
                              onCheckedChange={(checked) => { setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnit: { ...exterior.hvac.condenserUnit, enabled: checked } } }); handleSave() }}
                            />
                            <Label>Condenser Unit / AC Unit</Label>
                          </div>
                          {exterior.hvac.condenserUnit.enabled && (
                            <div className="ml-8 grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-sm">Tonnage</Label>
                                <Select value={exterior.hvac.condenserUnit.tonnage} onValueChange={(value) => { setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnit: { ...exterior.hvac.condenserUnit, tonnage: value } } }); handleSave() }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {["2", "2.5", "3", "3.5", "4", "5"].map(t => (
                                      <SelectItem key={t} value={t}>{t} Ton</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm">SEER Rating</Label>
                                <Select value={exterior.hvac.condenserUnit.seer} onValueChange={(value) => { setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnit: { ...exterior.hvac.condenserUnit, seer: value } } }); handleSave() }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {["13", "14-15", "16-21"].map(s => (
                                      <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Mini Split */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={exterior.hvac.miniSplit.enabled}
                              onCheckedChange={(checked) => { setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplit: { ...exterior.hvac.miniSplit, enabled: checked } } }); handleSave() }}
                            />
                            <Label>Mini Split / Duct-Free System</Label>
                          </div>
                          {exterior.hvac.miniSplit.enabled && (
                            <div className="ml-8 grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-sm">Number of Zones</Label>
                                <Select value={exterior.hvac.miniSplit.zones} onValueChange={(value) => { setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplit: { ...exterior.hvac.miniSplit, zones: value } } }); handleSave() }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50">
                                    <SelectValue />
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
                                  checked={exterior.hvac.miniSplit.highEfficiency}
                                  onCheckedChange={(checked) => { setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplit: { ...exterior.hvac.miniSplit, highEfficiency: checked } } }); handleSave() }}
                                />
                                <Label className="text-sm">High Efficiency</Label>
                              </div>
                            </div>
                          )}
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
                          <Badge variant="secondary" className="text-xs">Active</Badge>
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
                              type="number"
                              min="0"
                              max="20"
                              value={exterior.electrical.exteriorOutlets}
                              onChange={(e) => { setExterior({ ...exterior, electrical: { ...exterior.electrical, exteriorOutlets: parseInt(e.target.value) || 0 } }); handleSave() }}
                              className="border-border/60 bg-secondary/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>30 Amp Disconnect</Label>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              value={exterior.electrical.disconnect30Amp}
                              onChange={(e) => { setExterior({ ...exterior, electrical: { ...exterior.electrical, disconnect30Amp: parseInt(e.target.value) || 0 } }); handleSave() }}
                              className="border-border/60 bg-secondary/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={exterior.electrical.breakerPanel.enabled}
                              onCheckedChange={(checked) => { setExterior({ ...exterior, electrical: { ...exterior.electrical, breakerPanel: { ...exterior.electrical.breakerPanel, enabled: checked } } }); handleSave() }}
                            />
                            <Label>Breaker Panel</Label>
                          </div>
                          {exterior.electrical.breakerPanel.enabled && (
                            <div className="ml-8 grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-sm">Amperage</Label>
                                <Select value={exterior.electrical.breakerPanel.amps} onValueChange={(value) => { setExterior({ ...exterior, electrical: { ...exterior.electrical, breakerPanel: { ...exterior.electrical.breakerPanel, amps: value } } }); handleSave() }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50">
                                    <SelectValue />
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
                                  onCheckedChange={(checked) => { setExterior({ ...exterior, electrical: { ...exterior.electrical, breakerPanel: { ...exterior.electrical.breakerPanel, arcFaults: checked } } }); handleSave() }}
                                />
                                <Label className="text-sm">With Arc Faults</Label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* F9 Note */}
                  <div className="space-y-2">
                    <Label className="text-foreground">F9 Note (Usually M/S)</Label>
                    <Textarea
                      placeholder="Enter additional notes..."
                      value={exterior.f9Note}
                      onChange={(e) => { setExterior({ ...exterior, f9Note: e.target.value }); handleSave() }}
                      className="min-h-[80px] border-border/60 bg-secondary/50"
                    />
                  </div>
                </TabsContent>

                {/* FOUNDATION TAB */}
                <TabsContent value="foundation" className="mt-6 space-y-4">
                  {/* Crawlspace */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
                      <div className="flex items-center gap-3">
                        <Droplets className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Crawlspace / PFE Enclosure</span>
                        {foundation.crawlspace.enabled && <Badge variant="secondary" className="text-xs">Active</Badge>}
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={foundation.crawlspace.enabled}
                            onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, enabled: checked } }); handleSave() }}
                          />
                          <Label>Enable Crawlspace</Label>
                        </div>
                        {foundation.crawlspace.enabled && (
                          <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Foundation Wall Clean (LF)</Label>
                                <Input
                                  type="number"
                                  placeholder="Linear feet"
                                  value={foundation.crawlspace.foundationWallClean}
                                  onChange={(e) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, foundationWallClean: e.target.value } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label># of Piers</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="40"
                                  value={foundation.crawlspace.piers}
                                  onChange={(e) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, piers: parseInt(e.target.value) || 0 } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={foundation.crawlspace.preFirm}
                                  onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, preFirm: checked } }); handleSave() }}
                                />
                                <Label className="text-sm">Pre-FIRM</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={foundation.crawlspace.standingWater}
                                  onCheckedChange={(checked) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, standingWater: checked } }); handleSave() }}
                                />
                                <Label className="text-sm">Standing Water</Label>
                              </div>
                            </div>
                            {foundation.crawlspace.preFirm && (
                              <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 space-y-3">
                                <p className="text-sm font-medium text-foreground">Pre-FIRM Options</p>
                                <div className="grid gap-4 sm:grid-cols-2">
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
                                </div>
                                {foundation.crawlspace.floorInsulation && (
                                  <div className="space-y-2">
                                    <Label className="text-sm">Insulation Type</Label>
                                    <Select value={foundation.crawlspace.floorInsulationType} onValueChange={(value) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, floorInsulationType: value } }); handleSave() }}>
                                      <SelectTrigger className="border-border/60 bg-secondary/50">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="r13">R-13</SelectItem>
                                        <SelectItem value="r19">R-19</SelectItem>
                                        <SelectItem value="spray-foam">Spray Foam</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-6">
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
                            </div>
                            {foundation.crawlspace.muckHeavy && (
                              <p className="text-xs text-amber-500">Note: NFIP won&apos;t cover muck heavy without photos of standing mud</p>
                            )}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Enclosure Removal */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
                      <div className="flex items-center gap-3">
                        <Trash2 className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Enclosure Removal Items</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
                      <div className="space-y-4">
                        {/* Sand Removal */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={foundation.enclosureRemoval.sandRemoval.enabled}
                              onCheckedChange={(checked) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, sandRemoval: { ...foundation.enclosureRemoval.sandRemoval, enabled: checked } } }); handleSave() }}
                            />
                            <Label>Sand/Mud Removal</Label>
                          </div>
                          {foundation.enclosureRemoval.sandRemoval.enabled && (
                            <div className="ml-8 grid gap-4 sm:grid-cols-3">
                              <div className="space-y-2">
                                <Label className="text-sm">Length (FT)</Label>
                                <Input
                                  type="number"
                                  placeholder="Length"
                                  value={foundation.enclosureRemoval.sandRemoval.length}
                                  onChange={(e) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, sandRemoval: { ...foundation.enclosureRemoval.sandRemoval, length: e.target.value } } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm">Width (FT)</Label>
                                <Input
                                  type="number"
                                  placeholder="Width"
                                  value={foundation.enclosureRemoval.sandRemoval.width}
                                  onChange={(e) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, sandRemoval: { ...foundation.enclosureRemoval.sandRemoval, width: e.target.value } } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm">Depth (FT)</Label>
                                <Input
                                  type="number"
                                  placeholder="Depth"
                                  value={foundation.enclosureRemoval.sandRemoval.depth}
                                  onChange={(e) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, sandRemoval: { ...foundation.enclosureRemoval.sandRemoval, depth: e.target.value } } }); handleSave() }}
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
                              onCheckedChange={(checked) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, backfill: { ...foundation.enclosureRemoval.backfill, enabled: checked } } }); handleSave() }}
                            />
                            <Label>Backfill Around/In Foundation</Label>
                          </div>
                          {foundation.enclosureRemoval.backfill.enabled && (
                            <div className="ml-8 grid gap-4 sm:grid-cols-3">
                              <div className="space-y-2">
                                <Label className="text-sm">Length (FT)</Label>
                                <Input
                                  type="number"
                                  value={foundation.enclosureRemoval.backfill.length}
                                  onChange={(e) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, backfill: { ...foundation.enclosureRemoval.backfill, length: e.target.value } } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm">Width (FT)</Label>
                                <Input
                                  type="number"
                                  value={foundation.enclosureRemoval.backfill.width}
                                  onChange={(e) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, backfill: { ...foundation.enclosureRemoval.backfill, width: e.target.value } } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm">Depth (FT)</Label>
                                <Input
                                  type="number"
                                  value={foundation.enclosureRemoval.backfill.depth}
                                  onChange={(e) => { setFoundation({ ...foundation, enclosureRemoval: { ...foundation.enclosureRemoval, backfill: { ...foundation.enclosureRemoval.backfill, depth: e.target.value } } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50"
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
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Sump Pump */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
                      <div className="flex items-center gap-3">
                        <Droplets className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Sump Pump</span>
                        {foundation.sumpPump.enabled && <Badge variant="secondary" className="text-xs">Active</Badge>}
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={foundation.sumpPump.enabled}
                            onCheckedChange={(checked) => { setFoundation({ ...foundation, sumpPump: { ...foundation.sumpPump, enabled: checked } }); handleSave() }}
                          />
                          <Label>Enable Sump Pump</Label>
                        </div>
                        {foundation.sumpPump.enabled && (
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Action</Label>
                              <Select value={foundation.sumpPump.action} onValueChange={(value) => { setFoundation({ ...foundation, sumpPump: { ...foundation.sumpPump, action: value } }); handleSave() }}>
                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="detach-reset">Detach and Reset</SelectItem>
                                  <SelectItem value="replace">Replace</SelectItem>
                                  <SelectItem value="service-call">Service Call</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Horsepower</Label>
                              <Select value={foundation.sumpPump.hp} onValueChange={(value) => { setFoundation({ ...foundation, sumpPump: { ...foundation.sumpPump, hp: value } }); handleSave() }}>
                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                  <SelectValue />
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
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* F9 Note */}
                  <div className="space-y-2">
                    <Label className="text-foreground">F9 Note (Usually M/S)</Label>
                    <Textarea
                      placeholder="Enter additional notes..."
                      value={foundation.f9Note}
                      onChange={(e) => { setFoundation({ ...foundation, f9Note: e.target.value }); handleSave() }}
                      className="min-h-[80px] border-border/60 bg-secondary/50"
                    />
                  </div>
                </TabsContent>

                {/* INTERIOR TAB */}
                <TabsContent value="interior" className="mt-6 space-y-4">
                  {rooms.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/60 bg-secondary/20 p-8 text-center">
                      <Home className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium text-foreground">No Rooms Added</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Add rooms to enter interior damage details</p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2">
                        <Button variant="outline" className="gap-2 border-border/60" onClick={() => addRoom("living-room", "Living Room")}>
                          <Plus className="h-4 w-4" />
                          Living Room
                        </Button>
                        <Button variant="outline" className="gap-2 border-border/60" onClick={() => addRoom("bedroom", "Bedroom")}>
                          <Plus className="h-4 w-4" />
                          Bedroom
                        </Button>
                        <Button variant="outline" className="gap-2 border-border/60" onClick={() => addRoom("bathroom", "Bathroom")}>
                          <Plus className="h-4 w-4" />
                          Bathroom
                        </Button>
                        <Button variant="outline" className="gap-2 border-border/60" onClick={() => addRoom("kitchen", "Kitchen")}>
                          <Plus className="h-4 w-4" />
                          Kitchen
                        </Button>
                        <Button variant="outline" className="gap-2 border-border/60" onClick={() => addRoom("other", "")}>
                          <Plus className="h-4 w-4" />
                          Other
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Room List */}
                      {rooms.map((room) => (
                        <Collapsible key={room.id} defaultOpen>
                          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-primary/30 bg-primary/10 p-4 transition-colors hover:bg-primary/15 [&[data-state=open]>svg]:rotate-180">
                            <div className="flex items-center gap-3">
                              <Home className="h-5 w-5 text-primary" />
                              <span className="font-medium text-foreground">{room.name || "Unnamed Room"}</span>
                              <Badge variant="secondary" className="text-xs capitalize">{room.type.replace("-", " ")}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={(e) => { e.stopPropagation(); copyRoom(room.id) }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={(e) => { e.stopPropagation(); removeRoom(room.id) }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
                            <div className="space-y-6">
                              {/* Room Name & Type */}
                              <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                  <Label>Room Name</Label>
                                  <Input
                                    value={room.name}
                                    onChange={(e) => updateRoom(room.id, { name: e.target.value })}
                                    className="border-border/60 bg-secondary/50"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Room Type</Label>
                                  <Select value={room.type} onValueChange={(value) => updateRoom(room.id, { type: value })}>
                                    <SelectTrigger className="border-border/60 bg-secondary/50">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="living-room">Living Room</SelectItem>
                                      <SelectItem value="bedroom">Bedroom</SelectItem>
                                      <SelectItem value="bathroom">Bathroom</SelectItem>
                                      <SelectItem value="kitchen">Kitchen</SelectItem>
                                      <SelectItem value="dining-room">Dining Room</SelectItem>
                                      <SelectItem value="hallway">Hallway</SelectItem>
                                      <SelectItem value="laundry">Laundry</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Square Footage</Label>
                                  <Input
                                    type="number"
                                    value={room.sqft}
                                    onChange={(e) => updateRoom(room.id, { sqft: e.target.value })}
                                    className="border-border/60 bg-secondary/50"
                                  />
                                </div>
                              </div>

                              {/* Flooring */}
                              <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={room.flooring.enabled}
                                    onCheckedChange={(checked) => updateRoom(room.id, { flooring: { ...room.flooring, enabled: checked } })}
                                  />
                                  <Label className="font-medium">Flooring</Label>
                                </div>
                                {room.flooring.enabled && (
                                  <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                      <Label className="text-sm">Type</Label>
                                      <Select value={room.flooring.type} onValueChange={(value) => updateRoom(room.id, { flooring: { ...room.flooring, type: value } })}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="vinyl-plank">Vinyl Plank</SelectItem>
                                          <SelectItem value="laminate">Laminate</SelectItem>
                                          <SelectItem value="carpet">Carpet</SelectItem>
                                          <SelectItem value="hardwood">Hardwood</SelectItem>
                                          <SelectItem value="tile">Tile</SelectItem>
                                          <SelectItem value="vinyl-sheet">Vinyl Sheet</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm">Grade</Label>
                                      <Select value={room.flooring.grade} onValueChange={(value) => updateRoom(room.id, { flooring: { ...room.flooring, grade: value } })}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="standard">Standard Grade</SelectItem>
                                          <SelectItem value="high">High Grade</SelectItem>
                                          <SelectItem value="premium">Premium Grade</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-3 pt-6">
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={room.flooring.subfloorReplacement}
                                          onCheckedChange={(checked) => updateRoom(room.id, { flooring: { ...room.flooring, subfloorReplacement: checked } })}
                                        />
                                        <Label className="text-sm">Subfloor Replacement</Label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={room.flooring.vaporBarrier}
                                          onCheckedChange={(checked) => updateRoom(room.id, { flooring: { ...room.flooring, vaporBarrier: checked } })}
                                        />
                                        <Label className="text-sm">Vapor Barrier</Label>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Trim */}
                              <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={room.trim.enabled}
                                    onCheckedChange={(checked) => updateRoom(room.id, { trim: { ...room.trim, enabled: checked } })}
                                  />
                                  <Label className="font-medium">Trim / Baseboard</Label>
                                </div>
                                {room.trim.enabled && (
                                  <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                      <Label className="text-sm">Height</Label>
                                      <Select value={room.trim.baseboardHeight} onValueChange={(value) => updateRoom(room.id, { trim: { ...room.trim, baseboardHeight: value } })}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {["2", "3", "4", "5", "6"].map(h => (
                                            <SelectItem key={h} value={h}>{h}&quot; Baseboard</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm">Material</Label>
                                      <Select value={room.trim.material} onValueChange={(value) => updateRoom(room.id, { trim: { ...room.trim, material: value } })}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="mdf">MDF</SelectItem>
                                          <SelectItem value="hardwood">Hardwood</SelectItem>
                                          <SelectItem value="builder">Builder Grade</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm">Finish</Label>
                                      <Select value={room.trim.finish} onValueChange={(value) => updateRoom(room.id, { trim: { ...room.trim, finish: value } })}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="paint">Paint</SelectItem>
                                          <SelectItem value="stain">Stain</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Wall Covering */}
                              <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={room.wallCovering.enabled}
                                    onCheckedChange={(checked) => updateRoom(room.id, { wallCovering: { ...room.wallCovering, enabled: checked } })}
                                  />
                                  <Label className="font-medium">Wall Covering</Label>
                                </div>
                                {room.wallCovering.enabled && (
                                  <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                      <Label className="text-sm">Type</Label>
                                      <Select value={room.wallCovering.type} onValueChange={(value) => updateRoom(room.id, { wallCovering: { ...room.wallCovering, type: value } })}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="drywall">Drywall</SelectItem>
                                          <SelectItem value="plaster">Plaster</SelectItem>
                                          <SelectItem value="wainscoting">Wainscoting</SelectItem>
                                          <SelectItem value="paneling">Paneling</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm">Replacement Height</Label>
                                      <Select value={room.wallCovering.replacementHeight} onValueChange={(value) => updateRoom(room.id, { wallCovering: { ...room.wallCovering, replacementHeight: value } })}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="4">4 ft</SelectItem>
                                          <SelectItem value="8">8 ft</SelectItem>
                                          <SelectItem value="12">12 ft</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm">Texture</Label>
                                      <Select value={room.wallCovering.texture} onValueChange={(value) => updateRoom(room.id, { wallCovering: { ...room.wallCovering, texture: value } })}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="smooth">Smooth</SelectItem>
                                          <SelectItem value="textured">Textured</SelectItem>
                                          <SelectItem value="heavy-texture">Heavy Texture</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Electrical */}
                              <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                <Label className="font-medium">Electrical</Label>
                                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                                  <div className="space-y-2">
                                    <Label className="text-sm">110 Outlets</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={room.electrical.outlets110}
                                      onChange={(e) => updateRoom(room.id, { electrical: { ...room.electrical, outlets110: parseInt(e.target.value) || 0 } })}
                                      className="border-border/60 bg-secondary/50"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm">220 Outlets</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={room.electrical.outlets220}
                                      onChange={(e) => updateRoom(room.id, { electrical: { ...room.electrical, outlets220: parseInt(e.target.value) || 0 } })}
                                      className="border-border/60 bg-secondary/50"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm">GFI Outlets</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={room.electrical.gfiOutlets}
                                      onChange={(e) => updateRoom(room.id, { electrical: { ...room.electrical, gfiOutlets: parseInt(e.target.value) || 0 } })}
                                      className="border-border/60 bg-secondary/50"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm">Light Switches</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={room.electrical.lightSwitches}
                                      onChange={(e) => updateRoom(room.id, { electrical: { ...room.electrical, lightSwitches: parseInt(e.target.value) || 0 } })}
                                      className="border-border/60 bg-secondary/50"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm">Ceiling Lights</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={room.electrical.ceilingLights}
                                      onChange={(e) => updateRoom(room.id, { electrical: { ...room.electrical, ceilingLights: parseInt(e.target.value) || 0 } })}
                                      className="border-border/60 bg-secondary/50"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm">Ceiling Fans</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={room.electrical.ceilingFans}
                                      onChange={(e) => updateRoom(room.id, { electrical: { ...room.electrical, ceilingFans: parseInt(e.target.value) || 0 } })}
                                      className="border-border/60 bg-secondary/50"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Windows */}
                              <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                <div className="flex items-center justify-between">
                                  <Label className="font-medium">Windows ({room.windows.length})</Label>
                                  <Button variant="outline" size="sm" className="gap-2 border-border/60" onClick={() => addWindow(room.id)}>
                                    <Plus className="h-3 w-3" />
                                    Add Window
                                  </Button>
                                </div>
                                {room.windows.map((window, idx) => (
                                  <div key={window.id} className="grid gap-4 rounded-lg bg-secondary/30 p-3 sm:grid-cols-4">
                                    <div className="space-y-2">
                                      <Label className="text-xs">Type</Label>
                                      <Select value={window.type} onValueChange={(value) => {
                                        const newWindows = [...room.windows]
                                        newWindows[idx] = { ...window, type: value }
                                        updateRoom(room.id, { windows: newWindows })
                                      }}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="vinyl-double-hung">Vinyl Double Hung</SelectItem>
                                          <SelectItem value="vinyl-single-hung">Vinyl Single Hung</SelectItem>
                                          <SelectItem value="vinyl-casement">Vinyl Casement</SelectItem>
                                          <SelectItem value="wood-double-hung">Wood Double Hung</SelectItem>
                                          <SelectItem value="aluminum-double-hung">Aluminum Double Hung</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs">Size</Label>
                                      <Select value={window.size} onValueChange={(value) => {
                                        const newWindows = [...room.windows]
                                        newWindows[idx] = { ...window, size: value }
                                        updateRoom(room.id, { windows: newWindows })
                                      }}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="4-8">4-8 SF</SelectItem>
                                          <SelectItem value="9-12">9-12 SF</SelectItem>
                                          <SelectItem value="13-19">13-19 SF</SelectItem>
                                          <SelectItem value="20-28">20-28 SF</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs">Grade</Label>
                                      <Select value={window.grade} onValueChange={(value) => {
                                        const newWindows = [...room.windows]
                                        newWindows[idx] = { ...window, grade: value }
                                        updateRoom(room.id, { windows: newWindows })
                                      }}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="standard">Standard</SelectItem>
                                          <SelectItem value="premium">Premium</SelectItem>
                                          <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex items-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-destructive hover:bg-destructive/20"
                                        onClick={() => {
                                          const newWindows = room.windows.filter(w => w.id !== window.id)
                                          updateRoom(room.id, { windows: newWindows })
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Doors */}
                              <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                <div className="flex items-center justify-between">
                                  <Label className="font-medium">Doors ({room.doors.length})</Label>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="gap-2 border-border/60" onClick={() => addDoor(room.id, "interior")}>
                                      <Plus className="h-3 w-3" />
                                      Interior
                                    </Button>
                                    <Button variant="outline" size="sm" className="gap-2 border-border/60" onClick={() => addDoor(room.id, "exterior")}>
                                      <Plus className="h-3 w-3" />
                                      Exterior
                                    </Button>
                                  </div>
                                </div>
                                {room.doors.map((door, idx) => (
                                  <div key={door.id} className="grid gap-4 rounded-lg bg-secondary/30 p-3 sm:grid-cols-5">
                                    <div className="space-y-2">
                                      <Label className="text-xs">Category</Label>
                                      <Badge variant="secondary" className="capitalize">{door.category}</Badge>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs">Type</Label>
                                      <Select value={door.type} onValueChange={(value) => {
                                        const newDoors = [...room.doors]
                                        newDoors[idx] = { ...door, type: value }
                                        updateRoom(room.id, { doors: newDoors })
                                      }}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {door.category === "interior" ? (
                                            <>
                                              <SelectItem value="6-panel">6 Panel</SelectItem>
                                              <SelectItem value="8ft-paneled">8ft Paneled</SelectItem>
                                              <SelectItem value="french">French</SelectItem>
                                              <SelectItem value="bifold-single">Bifold Single</SelectItem>
                                              <SelectItem value="bifold-double">Bifold Double</SelectItem>
                                              <SelectItem value="pocket-single">Pocket Single</SelectItem>
                                            </>
                                          ) : (
                                            <>
                                              <SelectItem value="wood-door">Wood Door</SelectItem>
                                              <SelectItem value="metal-door">Metal Door</SelectItem>
                                              <SelectItem value="french-wood">French Wood</SelectItem>
                                              <SelectItem value="french-metal">French Metal</SelectItem>
                                            </>
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs">Grade</Label>
                                      <Select value={door.grade} onValueChange={(value) => {
                                        const newDoors = [...room.doors]
                                        newDoors[idx] = { ...door, grade: value }
                                        updateRoom(room.id, { doors: newDoors })
                                      }}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="standard">Standard</SelectItem>
                                          <SelectItem value="high">High</SelectItem>
                                          <SelectItem value="premium">Premium</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs">Handle</Label>
                                      <Select value={door.handleAction} onValueChange={(value) => {
                                        const newDoors = [...room.doors]
                                        newDoors[idx] = { ...door, handleAction: value }
                                        updateRoom(room.id, { doors: newDoors })
                                      }}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="replace">Replace</SelectItem>
                                          <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex items-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-destructive hover:bg-destructive/20"
                                        onClick={() => {
                                          const newDoors = room.doors.filter(d => d.id !== door.id)
                                          updateRoom(room.id, { doors: newDoors })
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}

                      {/* Add Room Button */}
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" className="gap-2 border-border/60" onClick={() => addRoom("living-room", `Room ${rooms.length + 1}`)}>
                          <Plus className="h-4 w-4" />
                          Add Room
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
