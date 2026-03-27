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
interface NFIPCleaningOptions {
  enabled: boolean
  wall: {
    height: string
    wallType: string
    ceilingAffected: boolean
  }
  floor: {
    type: string
    areaOnCrawlspace: boolean
  }
}

interface Room {
  id: number
  name: string
  type: string
  sqft: string
  nfipCleaning: NFIPCleaningOptions
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
  plumbing?: PlumbingOptions
  appliances?: ApplianceOptions
}

interface FloorLayer {
  id: number
  type: string
  grade: string
  application: string
  action: string
  }
  
  interface FlooringOptions {
  enabled: boolean
  multipleLayers: boolean
  layers: FloorLayer[]
  vaporBarrier: boolean
  subfloorReplacement: boolean
  f9Note: string
  }

interface TrimOptions {
  enabled: boolean
  baseboardHeight: string
  material: string
  finish: string
  cap: boolean
  shoe: boolean
  shoeFinish: string
}

interface WallCoveringOptions {
  enabled: boolean
  type: string
  replacementCalc: string
  replacementHeight: string
  texture: boolean
  textureType: string
}

interface ElectricalOptions {
  enabled: boolean
  outlets110: number
  outlets220: number
  gfiOutlets: number
  lightSwitches: number
  ceilingLights: number
  ceilingFans: number
  bathroomLightBar: string
  bathroomLightBarQty: number
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
  peepHole: boolean
  mailSlot: boolean
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
  size: string
  grade: string
  detachAndReset: boolean
  toeKick: {
    size: string
    backSplash: string
    grade: string
    glass: boolean
    diagonalInstallation: boolean
  }
}

interface CountertopOptions {
  enabled: boolean
  type: string
  grade: string
  size: string
  detachAndReset: boolean
}

interface PlumbingOptions {
  replaceFaucetSink: boolean
  drFaucetSink: boolean
  waterSupplyLine: { enabled: boolean; qty: string }
  reverseOsmosis: { enabled: boolean; action: string; f9Note: string }
  garbageDisposal: { enabled: boolean; action: string; f9Note: string }
}

interface ApplianceOptions {
  enabled: boolean
  refrigerator: { enabled: boolean; type: string; size: string; grade: string; action: string; f9Note: string }
  dishwasher: { enabled: boolean; grade: string; action: string; f9Note: string }
  range: { enabled: boolean; type: string; options: string; grade: string; action: string; f9Note: string }
  cooktop: { enabled: boolean; type: string; grade: string; action: string; f9Note: string }
  waterHeater: { enabled: boolean; type: string; size: string; rating: string; action: string; f9Note: string }
  wallOven: { enabled: boolean; type: string; grade: string; action: string; f9Note: string }
  airHandler: { enabled: boolean; type: string; options: string; action: string; f9Note: string }
  boiler: { enabled: boolean; type: string; action: string; f9Note: string; expansionTank: boolean; circulatorPump: boolean }
}

// Default values
const defaultRoom: Omit<Room, "id" | "name"> = {
  type: "room",
  sqft: "",
  nfipCleaning: { enabled: false, wall: { height: "", wallType: "", ceilingAffected: false }, floor: { type: "", areaOnCrawlspace: false } },
  flooring: { enabled: false, multipleLayers: false, layers: [{ id: Date.now(), type: "", grade: "", application: "", action: "" }], vaporBarrier: false, subfloorReplacement: false, f9Note: "" },
  trim: { enabled: false, baseboardHeight: "", material: "", finish: "", cap: false, shoe: false, shoeFinish: "" },
  wallCovering: { enabled: false, type: "", replacementCalc: "", replacementHeight: "", texture: false, textureType: "" },
  electrical: { enabled: false, outlets110: 0, outlets220: 0, gfiOutlets: 0, lightSwitches: 0, ceilingLights: 0, ceilingFans: 0, bathroomLightBar: "", bathroomLightBarQty: 0 },
  windows: [],
  doors: [],
}

const defaultBathroomExtras = {
  vanity: { enabled: false, linearFeet: 0, countertop: "", backsplash: false },
  toilet: { enabled: false, action: "", seatReplacement: false },
  shower: { enabled: false, type: "", size: "", glassDoor: false, tileNiche: false },
}

const defaultKitchenExtras = {
  cabinets: { enabled: false, size: "", grade: "", detachAndReset: false, toeKick: { size: "", backSplash: "", grade: "", glass: false, diagonalInstallation: false } },
  countertop: { enabled: false, type: "", grade: "", size: "", detachAndReset: false },
  plumbing: { replaceFaucetSink: false, drFaucetSink: false, waterSupplyLine: { enabled: false, qty: "" }, reverseOsmosis: { enabled: false, action: "", f9Note: "" }, garbageDisposal: { enabled: false, action: "", f9Note: "" } },
  appliances: {
    enabled: false,
    refrigerator: { enabled: false, type: "", size: "", grade: "", action: "", f9Note: "" },
    dishwasher: { enabled: false, grade: "", action: "", f9Note: "" },
    range: { enabled: false, type: "", options: "", grade: "", action: "", f9Note: "" },
    cooktop: { enabled: false, type: "", grade: "", action: "", f9Note: "" },
    waterHeater: { enabled: false, type: "", size: "", rating: "", action: "", f9Note: "" },
    wallOven: { enabled: false, type: "", grade: "", action: "", f9Note: "" },
    airHandler: { enabled: false, type: "", options: "", action: "", f9Note: "" },
    boiler: { enabled: false, type: "", action: "", f9Note: "", expansionTank: false, circulatorPump: false },
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
    setRooms(rooms.map(r => r.id === roomId ? { ...r, ...updates } : r))
    handleSave()
  }

  const addWindow = (roomId: number) => {
    const room = rooms.find(r => r.id === roomId)
    if (room) {
      const newWindow: WindowItem = {
        id: Date.now(),
        type: "",
        size: "",
        grade: "",
        casing: "",
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
      type: "",
      grade: "",
      finish: "",
      handleAction: "",
      peepHole: false,
      mailSlot: false,
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
                    max={new Date().toISOString().split('T')[0]}
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
                          <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
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
                            <div className="space-y-2">
                              <Label>Dumpster Size</Label>
                              <Select value={exterior.dumpster.size} onValueChange={(value) => { setExterior({ ...exterior, dumpster: { ...exterior.dumpster, size: value } }); handleSave() }}>
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
                              <div className="flex flex-wrap items-end gap-4">
                                <div className="space-y-2 min-w-[120px]">
                                  <Label className="text-sm">Tonnage</Label>
                                  <Select value={unit.tonnage} onValueChange={(value) => {
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, tonnage: value } : u) } })
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
                                <div className="space-y-2 min-w-[120px]">
                                  <Label className="text-sm">SEER Rating</Label>
                                  <Select value={unit.seer} onValueChange={(value) => {
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, seer: value } : u) } })
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
                                <div className="flex items-center gap-2 pb-2">
                                  <Switch
                                    checked={unit.replace}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, replace: checked, serviceCall: checked ? false : u.serviceCall } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">Replace</Label>
                                </div>
                                <div className="flex items-center gap-2 pb-2">
                                  <Switch
                                    checked={unit.serviceCall}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, serviceCall: checked, replace: checked ? false : u.replace } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">Service Call</Label>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm">F9 Note</Label>
                                <Input
                                  placeholder="Enter model and serial number..."
                                  value={unit.f9Note}
                                  onChange={(e) => {
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, condenserUnits: exterior.hvac.condenserUnits.map(u => u.id === unit.id ? { ...u, f9Note: e.target.value } : u) } })
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
                              <div className="flex flex-wrap items-end gap-4">
                                <div className="space-y-2 min-w-[140px]">
                                  <Label className="text-sm">Unit Type</Label>
                                  <Select value={unit.unitType} onValueChange={(value) => {
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, unitType: value } : u) } })
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
                                <div className="space-y-2 min-w-[120px]">
                                  <Label className="text-sm">Tonnage</Label>
                                  <Select value={unit.tonnage} onValueChange={(value) => {
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, tonnage: value } : u) } })
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
                                <div className="space-y-2 min-w-[120px]">
                                  <Label className="text-sm">SEER Rating</Label>
                                  <Select value={unit.seer} onValueChange={(value) => {
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, seer: value } : u) } })
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
                                <div className="flex items-center gap-2 pb-2">
                                  <Switch
                                    checked={unit.replace}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, replace: checked, serviceCall: checked ? false : u.serviceCall } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">Replace</Label>
                                </div>
                                <div className="flex items-center gap-2 pb-2">
                                  <Switch
                                    checked={unit.serviceCall}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, serviceCall: checked, replace: checked ? false : u.replace } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">Service Call</Label>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm">F9 Note</Label>
                                <Input
                                  placeholder="Enter model and serial number..."
                                  value={unit.f9Note}
                                  onChange={(e) => {
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, packageUnits: exterior.hvac.packageUnits.map(u => u.id === unit.id ? { ...u, f9Note: e.target.value } : u) } })
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
                              <div className="flex flex-wrap items-end gap-4">
                                <div className="space-y-2 min-w-[120px]">
                                  <Label className="text-sm">Number of Zones</Label>
                                  <Select value={unit.zones} onValueChange={(value) => {
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, zones: value } : u) } })
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
                                <div className="flex items-center gap-2 pb-2">
                                  <Switch
                                    checked={unit.highEfficiency}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, highEfficiency: checked } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">High Efficiency</Label>
                                </div>
                                <div className="flex items-center gap-2 pb-2">
                                  <Switch
                                    checked={unit.replace}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, replace: checked, serviceCall: checked ? false : u.serviceCall } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">Replace</Label>
                                </div>
                                <div className="flex items-center gap-2 pb-2">
                                  <Switch
                                    checked={unit.serviceCall}
                                    onCheckedChange={(checked) => {
                                      setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, serviceCall: checked, replace: checked ? false : u.replace } : u) } })
                                      handleSave()
                                    }}
                                  />
                                  <Label className="text-sm">Service Call</Label>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm">F9 Note</Label>
                                <Input
                                  placeholder="Enter model and serial number..."
                                  value={unit.f9Note}
                                  onChange={(e) => {
                                    setExterior({ ...exterior, hvac: { ...exterior.hvac, miniSplits: exterior.hvac.miniSplits.map(u => u.id === unit.id ? { ...u, f9Note: e.target.value } : u) } })
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
                              <Select value={exterior.electrical.breakerPanel.amps} onValueChange={(value) => { setExterior({ ...exterior, electrical: { ...exterior.electrical, breakerPanel: { ...exterior.electrical.breakerPanel, amps: value } } }); handleSave() }}>
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
                                onValueChange={(value) => {
                                  setExterior({ ...exterior, finishes: exterior.finishes.map(f => f.type === "exterior-paint" ? { ...f, value } : f) })
                                  handleSave()
                                }}
                              >
                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
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
                                onValueChange={(value) => {
                                  setExterior({ ...exterior, finishes: exterior.finishes.map(f => f.type === "exterior-siding" ? { ...f, value } : f) })
                                  handleSave()
                                }}
                              >
                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <Label>Enable Crawlspace/Enclosure area</Label>
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
                                  placeholder="PF"
                                  value={foundation.crawlspace.perimeterFeet}
                                  onChange={(e) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, perimeterFeet: e.target.value.replace(/^0+/, '') } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50 w-24"
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
                                  placeholder="Enter home SF"
                                  value={foundation.crawlspace.houseRewire.trim()}
                                  onChange={(e) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, houseRewire: e.target.value } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50 w-32"
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
                                    <Select value={foundation.crawlspace.floorInsulationType} onValueChange={(value) => { setFoundation({ ...foundation, crawlspace: { ...foundation.crawlspace, floorInsulationType: value } }); handleSave() }}>
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
                        <span className="font-medium text-foreground">Sump Pump</span>
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
                              <Select value={foundation.sumpPump.action} onValueChange={(value) => { setFoundation({ ...foundation, sumpPump: { ...foundation.sumpPump, action: value } }); handleSave() }}>
                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="replace">Replace</SelectItem>
                                  <SelectItem value="detach-reset">Detach and Reset</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 min-w-[200px]">
                              <Label className="text-xs text-muted-foreground">Horsepower</Label>
                              <Select value={foundation.sumpPump.hp} onValueChange={(value) => { setFoundation({ ...foundation, sumpPump: { ...foundation.sumpPump, hp: value } }); handleSave() }}>
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
                          </>
                        )}
                      </div>
                      {foundation.sumpPump.enabled && (
                        <div className="mt-4 space-y-2">
                          <Label className="text-sm">F9 Note</Label>
                          <Input
                            type="text"
                            placeholder="Enter model and serial number..."
                            value={foundation.sumpPump.f9Note}
                            onChange={(e) => { setFoundation({ ...foundation, sumpPump: { ...foundation.sumpPump, f9Note: e.target.value } }); handleSave() }}
                            className="border-border/60 bg-secondary/50"
                          />
                        </div>
                      )}
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
                                <Select value={handler.type} onValueChange={(value) => {
                                  setFoundation({ ...foundation, hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.map(h => h.id === handler.id ? { ...h, type: value } : h) } })
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
                              <div className="space-y-2 min-w-[100px]">
                                <Label className="text-sm">Tonnage</Label>
                                <Select value={handler.tonnage} onValueChange={(value) => {
                                  setFoundation({ ...foundation, hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.map(h => h.id === handler.id ? { ...h, tonnage: value } : h) } })
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
                              <div className="space-y-2 min-w-[140px]">
                                <Label className="text-sm">Action</Label>
                                <Select value={handler.action} onValueChange={(value) => {
                                  setFoundation({ ...foundation, hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.map(h => h.id === handler.id ? { ...h, action: value } : h) } })
                                  handleSave()
                                }}>
                                  <SelectTrigger className="border-border/60 bg-secondary/50">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="replace">Replace</SelectItem>
                                    <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              {(handler.type === "with-heat-element" || handler.type === "with-heat-element-a-coil") && (
                                <div className="space-y-2 min-w-[100px]">
                                  <Label className="text-sm">With Heat Element</Label>
                                  <Select value={handler.heatElementCount} onValueChange={(value) => {
                                    setFoundation({ ...foundation, hvac: { ...foundation.hvac, airHandlers: foundation.hvac.airHandlers.map(h => h.id === handler.id ? { ...h, heatElementCount: value } : h) } })
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
                                  placeholder="PF"
                                  value={foundation.basement.wallCleanPf}
                                  onChange={(e) => { setFoundation({ ...foundation, basement: { ...foundation.basement, wallCleanPf: e.target.value.replace(/^0+/, '') } }); handleSave() }}
                                  className="border-border/60 bg-secondary/50 w-24"
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
                                      onValueChange={(value) => { setFoundation({ ...foundation, basement: { ...foundation.basement, drywallValue: value } }); handleSave() }}
                                    >
                                      <SelectTrigger className="w-24 border-border/60 bg-secondary/50">
                                        <SelectValue placeholder="SF" />
                                      </SelectTrigger>
                                      <SelectContent>
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
                                <div key={win.id} className="ml-8 flex flex-wrap items-center gap-3 rounded-lg border border-border/40 bg-secondary/30 p-3">
                                  <span className="text-sm font-medium">Window {index + 1}</span>
                                  <Select value={win.type} onValueChange={(value) => {
                                    setFoundation({ ...foundation, basement: { ...foundation.basement, foundationWindows: foundation.basement.foundationWindows.map(w => w.id === win.id ? { ...w, type: value } : w) } })
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
                                    setFoundation({ ...foundation, basement: { ...foundation.basement, foundationWindows: foundation.basement.foundationWindows.map(w => w.id === win.id ? { ...w, size: value } : w) } })
                                    handleSave()
                                  }}>
                                    <SelectTrigger className="w-24 border-border/60 bg-secondary/50">
                                      <SelectValue placeholder="Size" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                                  <Select value={win.material} onValueChange={(value) => {
                                    setFoundation({ ...foundation, basement: { ...foundation.basement, foundationWindows: foundation.basement.foundationWindows.map(w => w.id === win.id ? { ...w, material: value } : w) } })
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
                                  <Select value={foundation.basement.foundationDoorAction} onValueChange={(value) => { setFoundation({ ...foundation, basement: { ...foundation.basement, foundationDoorAction: value } }); handleSave() }}>
                                    <SelectTrigger className="w-48 border-border/60 bg-secondary/50">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                            <Select value={foundation.electrical.outlets110} onValueChange={(value) => { setFoundation({ ...foundation, electrical: { ...foundation.electrical, outlets110: value } }); handleSave() }}>
                              <SelectTrigger className="w-20 border-border/60 bg-secondary/50">
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
                            <Select value={foundation.electrical.outlets220} onValueChange={(value) => { setFoundation({ ...foundation, electrical: { ...foundation.electrical, outlets220: value } }); handleSave() }}>
                              <SelectTrigger className="w-20 border-border/60 bg-secondary/50">
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
                            <Select value={foundation.electrical.gfiOutlets} onValueChange={(value) => { setFoundation({ ...foundation, electrical: { ...foundation.electrical, gfiOutlets: value } }); handleSave() }}>
                              <SelectTrigger className="w-20 border-border/60 bg-secondary/50">
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
                            <Select value={foundation.electrical.lightSwitch} onValueChange={(value) => { setFoundation({ ...foundation, electrical: { ...foundation.electrical, lightSwitch: value } }); handleSave() }}>
                              <SelectTrigger className="w-20 border-border/60 bg-secondary/50">
                                <SelectValue placeholder="QTY" />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Junction Box</Label>
                            <Select value={foundation.electrical.junctionBox} onValueChange={(value) => { setFoundation({ ...foundation, electrical: { ...foundation.electrical, junctionBox: value } }); handleSave() }}>
                              <SelectTrigger className="w-20 border-border/60 bg-secondary/50">
                                <SelectValue placeholder="QTY" />
                              </SelectTrigger>
                              <SelectContent>
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
                                <Select value={foundation.electrical.breakerPanel.amps} onValueChange={(value) => { setFoundation({ ...foundation, electrical: { ...foundation.electrical, breakerPanel: { ...foundation.electrical.breakerPanel, amps: value } } }); handleSave() }}>
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
                        <Collapsible key={room.id} defaultOpen>
                          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-primary/30 bg-primary/10 p-4 transition-colors hover:bg-primary/15 [&[data-state=open]>svg]:rotate-180">
                            <div className="flex items-center gap-3">
                              <Home className="h-5 w-5 text-primary" />
                              <Badge variant="secondary" className="text-xs capitalize">{room.type.replace("-", " ")}</Badge>
                              <span className="font-medium text-foreground">{room.name || "Unnamed Room"}</span>
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
                              <div className="flex flex-wrap items-end gap-4">
                                <div className="space-y-2 min-w-[160px]">
                                  <Label>Room Name</Label>
                                  <Input
                                    value={room.name}
                                    onChange={(e) => updateRoom(room.id, { name: e.target.value })}
                                    className="border-border/60 bg-secondary/50"
                                  />
                                </div>
                                <div className="space-y-2 min-w-[120px]">
                                  <Label>Room Type</Label>
                                  <Select value={room.type} onValueChange={(value) => updateRoom(room.id, { type: value })}>
                                    <SelectTrigger className="border-border/60 bg-secondary/50">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="room">Room</SelectItem>
                                      <SelectItem value="bathroom">Bathroom</SelectItem>
                                      <SelectItem value="kitchen">Kitchen</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* NFIP Cleaning */}
                              <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={room.nfipCleaning.enabled}
                                    onCheckedChange={(checked) => updateRoom(room.id, { nfipCleaning: { ...room.nfipCleaning, enabled: checked } })}
                                  />
                                  <Label className="font-medium">NFIP Cleaning</Label>
                                </div>
                                {room.nfipCleaning.enabled && (
                                  <div className="space-y-4">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                      {/* Wall */}
                                      <div className="space-y-3">
                                        <Label className="text-sm font-medium">Wall (PF)</Label>
                                        <div className="flex flex-wrap items-center gap-4">
                                          <Input
                                            type="number"
                                            min="0"
                                            placeholder="PF"
                                            value={room.nfipCleaning.wall.height}
                                            onChange={(e) => updateRoom(room.id, { nfipCleaning: { ...room.nfipCleaning, wall: { ...room.nfipCleaning.wall, height: e.target.value } } })}
                                            className="border-border/60 bg-secondary/50 w-24"
                                          />
                                          <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                              <input
                                                type="radio"
                                                name={`wall-type-${room.id}`}
                                                checked={room.nfipCleaning.wall.wallType === "block"}
                                                onChange={() => updateRoom(room.id, { nfipCleaning: { ...room.nfipCleaning, wall: { ...room.nfipCleaning.wall, wallType: "block" } } })}
                                                className="accent-primary"
                                              />
                                              <span className="text-sm">Block wall</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                              <input
                                                type="radio"
                                                name={`wall-type-${room.id}`}
                                                checked={room.nfipCleaning.wall.wallType === "stud"}
                                                onChange={() => updateRoom(room.id, { nfipCleaning: { ...room.nfipCleaning, wall: { ...room.nfipCleaning.wall, wallType: "stud" } } })}
                                                className="accent-primary"
                                              />
                                              <span className="text-sm">Stud Wall</span>
                                            </label>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Switch
                                            checked={room.nfipCleaning.wall.ceilingAffected}
                                            onCheckedChange={(checked) => updateRoom(room.id, { nfipCleaning: { ...room.nfipCleaning, wall: { ...room.nfipCleaning.wall, ceilingAffected: checked } } })}
                                          />
                                          <Label className="text-sm">Ceiling affected</Label>
                                        </div>
                                      </div>

                                      {/* Floor */}
                                      <div className="space-y-3">
                                        <Label className="text-sm font-medium">Floor</Label>
                                        <div className="flex items-center gap-4">
                                          <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                              type="radio"
                                              name={`floor-type-${room.id}`}
                                              checked={room.nfipCleaning.floor.type === "muck-out"}
                                              onChange={() => updateRoom(room.id, { nfipCleaning: { ...room.nfipCleaning, floor: { ...room.nfipCleaning.floor, type: "muck-out" } } })}
                                              className="accent-primary"
                                            />
                                            <span className="text-sm">Muck out</span>
                                          </label>
                                          <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                              type="radio"
                                              name={`floor-type-${room.id}`}
                                              checked={room.nfipCleaning.floor.type === "muck-heavy"}
                                              onChange={() => updateRoom(room.id, { nfipCleaning: { ...room.nfipCleaning, floor: { ...room.nfipCleaning.floor, type: "muck-heavy" } } })}
                                              className="accent-primary"
                                            />
                                            <span className="text-sm">Muck Heavy</span>
                                          </label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Switch
                                            checked={room.nfipCleaning.floor.areaOnCrawlspace}
                                            onCheckedChange={(checked) => updateRoom(room.id, { nfipCleaning: { ...room.nfipCleaning, floor: { ...room.nfipCleaning.floor, areaOnCrawlspace: checked } } })}
                                          />
                                          <Label className="text-sm">Area on crawlspace</Label>
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-xs text-amber-500">Note: Section includes standard method 1 SF drycut.</p>
                                  </div>
                                )}
                              </div>

                              {/* Flooring */}
                              <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                      <Switch
                                        checked={room.flooring.enabled}
                                        onCheckedChange={(checked) => {
                                          const newFlooring = { ...room.flooring, enabled: checked }
                                          if (checked && (!newFlooring.layers || newFlooring.layers.length === 0)) {
                                            newFlooring.layers = [{ id: Date.now(), type: "", grade: "", application: "", action: "" }]
                                          }
                                          updateRoom(room.id, { flooring: newFlooring })
                                        }}
                                      />
                                      <Label className="font-medium">Flooring</Label>
                                    </div>
                                    {room.flooring.enabled && (
                                      <div className="flex items-center gap-3">
                                        <Switch
                                          checked={room.flooring.multipleLayers}
                                          onCheckedChange={(checked) => {
                                            updateRoom(room.id, { flooring: { ...room.flooring, multipleLayers: checked } })
                                          }}
                                        />
                                        <Label className="text-sm">Multiple Layers of Flooring</Label>
                                      </div>
                                    )}
                                  </div>
                                  {room.flooring.enabled && room.flooring.multipleLayers && (room.flooring.layers?.length || 0) < 6 && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="gap-1 border-border/60"
                                      onClick={() => {
                                        const currentLayers = room.flooring.layers || []
                                        const newLayers = [...currentLayers, { id: Date.now(), type: "", grade: "", application: "", action: "" }]
                                        updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers } })
                                      }}
                                    >
                                      <Plus className="h-3 w-3" /> Add Flooring
                                    </Button>
                                  )}
                                </div>
                                {room.flooring.enabled && (
                                  <>
                                    <p className="text-xs text-amber-500">Note: Please note carpet installed over flooring is a content item</p>
                                    <div className="space-y-4">
                                      {(room.flooring.layers || []).map((layer, layerIndex) => (
                                        <div key={layer.id} className="space-y-2">
                                          <Label className="text-sm font-medium">{layerIndex === 0 ? "1st Layer" : `${layerIndex + 1}${layerIndex === 1 ? "nd" : layerIndex === 2 ? "rd" : "th"} Layer`}</Label>
                                          <div className="flex flex-wrap items-end gap-3">
                                            <div className="space-y-1 min-w-[140px]">
                                              <Label className="text-xs text-muted-foreground">Type</Label>
                                              <Select 
                                                value={layer.type} 
                                                onValueChange={(value) => {
                                                  const newLayers = [...(room.flooring.layers || [])]
                                                  newLayers[layerIndex] = { ...layer, type: value }
                                                  updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers } })
                                                }}
                                              >
                                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                                  <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="vinyl-plank">Vinyl Plank</SelectItem>
                                                  <SelectItem value="sheet-vinyl">Sheet Vinyl</SelectItem>
                                                  <SelectItem value="laminate">Laminate</SelectItem>
                                                  <SelectItem value="carpet">Carpet</SelectItem>
                                                  <SelectItem value="hardwood">Hardwood</SelectItem>
                                                  <SelectItem value="tile">Tile</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div className="space-y-1 min-w-[140px]">
                                              <Label className="text-xs text-muted-foreground">Grade</Label>
                                              <Select 
                                                value={layer.grade} 
                                                onValueChange={(value) => {
                                                  const newLayers = [...(room.flooring.layers || [])]
                                                  newLayers[layerIndex] = { ...layer, grade: value }
                                                  updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers } })
                                                }}
                                              >
                                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                                  <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="standard">Standard Grade</SelectItem>
                                                  <SelectItem value="vinyl-plank-base">Vinyl Plank base</SelectItem>
                                                  <SelectItem value="high">High Grade</SelectItem>
                                                  <SelectItem value="premium">Premium Grade</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div className="space-y-1 min-w-[160px]">
                                              <Label className="text-xs text-muted-foreground">Application</Label>
                                              <Select 
                                                value={layer.application} 
                                                onValueChange={(value) => {
                                                  const newLayers = [...(room.flooring.layers || [])]
                                                  newLayers[layerIndex] = { ...layer, application: value }
                                                  updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers } })
                                                }}
                                              >
                                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                                  <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="glue-down-concrete">Glue down on Concrete</SelectItem>
                                                  <SelectItem value="glue-down-wood">Glue down on Wood</SelectItem>
                                                  <SelectItem value="floating">Floating</SelectItem>
                                                  <SelectItem value="nail-down">Nail down</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            {layerIndex === 0 && (
                                              <>
                                                <div className="flex items-center gap-2 pb-1">
                                                  <Switch
                                                    checked={room.flooring.vaporBarrier}
                                                    onCheckedChange={(checked) => updateRoom(room.id, { flooring: { ...room.flooring, vaporBarrier: checked } })}
                                                  />
                                                  <Label className="text-sm">Vapor Barrier</Label>
                                                </div>
                                                <div className="flex items-center gap-2 pb-1">
                                                  <Switch
                                                    checked={room.flooring.subfloorReplacement}
                                                    onCheckedChange={(checked) => updateRoom(room.id, { flooring: { ...room.flooring, subfloorReplacement: checked } })}
                                                  />
                                                  <Label className="text-sm">Subfloor Replacement</Label>
                                                </div>
                                              </>
                                            )}
                                            <div className="space-y-1 min-w-[160px]">
                                              <Label className="text-xs text-muted-foreground">Action</Label>
                                              <Select 
                                                value={layer.action} 
                                                onValueChange={(value) => {
                                                  const newLayers = [...(room.flooring.layers || [])]
                                                  newLayers[layerIndex] = { ...layer, action: value }
                                                  updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers } })
                                                }}
                                              >
                                                <SelectTrigger className="border-border/60 bg-secondary/50">
                                                  <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="remove">Remove</SelectItem>
                                                  <SelectItem value="remove-replace">Remove & Replace</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            {layerIndex > 0 && (
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive/80"
                                                onClick={() => {
                                                  const newLayers = (room.flooring.layers || []).filter(l => l.id !== layer.id)
                                                  updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers, multipleLayers: newLayers.length > 1 } })
                                                }}
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                      <div className="space-y-2 pt-2">
                                        <Textarea
                                          placeholder="F9 Description of the layers of floor removed..."
                                          value={room.flooring.f9Note}
                                          onChange={(e) => updateRoom(room.id, { flooring: { ...room.flooring, f9Note: e.target.value } })}
                                          className="border-border/60 bg-secondary/50 min-h-[60px]"
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* Trim / Baseboard */}
                              <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={room.trim.enabled}
                                    onCheckedChange={(checked) => updateRoom(room.id, { trim: { ...room.trim, enabled: checked } })}
                                  />
                                  <Label className="font-medium">Trim / Baseboard</Label>
                                </div>
                                {room.trim.enabled && (
                                  <div className="flex flex-wrap items-end gap-4">
                                    <div className="space-y-1 min-w-[120px]">
                                      <Label className="text-xs text-muted-foreground">Height</Label>
                                      <Select value={room.trim.baseboardHeight} onValueChange={(value) => updateRoom(room.id, { trim: { ...room.trim, baseboardHeight: value } })}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {["2", "3", "4", "5", "6"].map(h => (
                                            <SelectItem key={h} value={h}>{h}&quot; Baseboard</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-1 min-w-[100px]">
                                      <Label className="text-xs text-muted-foreground">Material</Label>
                                      <Select value={room.trim.material} onValueChange={(value) => updateRoom(room.id, { trim: { ...room.trim, material: value } })}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="mdf">MDF</SelectItem>
                                          <SelectItem value="hardwood">Hardwood</SelectItem>
                                          <SelectItem value="builder">Builder Grade</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-1 min-w-[100px]">
                                      <Label className="text-xs text-muted-foreground">Finish</Label>
                                      <Select value={room.trim.finish} onValueChange={(value) => updateRoom(room.id, { trim: { ...room.trim, finish: value } })}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="paint">Paint</SelectItem>
                                          <SelectItem value="stain">Stain</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex items-center gap-2 pb-1">
                                      <Switch
                                        checked={room.trim.cap}
                                        onCheckedChange={(checked) => updateRoom(room.id, { trim: { ...room.trim, cap: checked } })}
                                      />
                                      <Label className="text-sm">Cap</Label>
                                    </div>
                                    <div className="flex items-center gap-2 pb-1">
                                      <Switch
                                        checked={room.trim.shoe}
                                        onCheckedChange={(checked) => updateRoom(room.id, { trim: { ...room.trim, shoe: checked } })}
                                      />
                                      <Label className="text-sm">Shoe</Label>
                                    </div>
                                    {room.trim.shoe && (
                                      <div className="space-y-1 min-w-[100px]">
                                        <Select value={room.trim.shoeFinish} onValueChange={(value) => updateRoom(room.id, { trim: { ...room.trim, shoeFinish: value } })}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Finish" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="paint">Paint</SelectItem>
                                            <SelectItem value="stain">Stain</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Wall Coverings */}
                              <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={room.wallCovering.enabled}
                                    onCheckedChange={(checked) => updateRoom(room.id, { wallCovering: { ...room.wallCovering, enabled: checked } })}
                                  />
                                  <Label className="font-medium">Wall Coverings</Label>
                                </div>
                                {room.wallCovering.enabled && (
                                  <div className="space-y-3">
                                    <div className="flex flex-wrap items-end gap-4">
                                      <div className="space-y-1 min-w-[140px]">
                                        <Label className="text-xs text-muted-foreground">Type</Label>
                                        <Select value={room.wallCovering.type} onValueChange={(value) => updateRoom(room.id, { wallCovering: { ...room.wallCovering, type: value } })}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="drywall">Drywall</SelectItem>
                                            <SelectItem value="plaster">Plaster</SelectItem>
                                            <SelectItem value="wainscoting">Wainscoting</SelectItem>
                                            <SelectItem value="paneling">Paneling</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-1 min-w-[100px]">
                                        <Label className="text-xs text-muted-foreground">Replacement calc</Label>
                                        <Select value={room.wallCovering.replacementCalc} onValueChange={(value) => updateRoom(room.id, { wallCovering: { ...room.wallCovering, replacementCalc: value, replacementHeight: "" } })}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="lf">LF</SelectItem>
                                            <SelectItem value="sf">SF</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-1 min-w-[100px]">
                                        <Label className="text-xs text-muted-foreground">Replacement Height</Label>
                                        <Select value={room.wallCovering.replacementHeight} onValueChange={(value) => updateRoom(room.id, { wallCovering: { ...room.wallCovering, replacementHeight: value } })}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {room.wallCovering.replacementCalc === "sf" ? (
                                              <>
                                                <SelectItem value=".5w">.5w</SelectItem>
                                                <SelectItem value="w">w</SelectItem>
                                              </>
                                            ) : (
                                              <>
                                                <SelectItem value="4">4 ft</SelectItem>
                                                <SelectItem value="8">8 ft</SelectItem>
                                                <SelectItem value="12">12 ft</SelectItem>
                                                <SelectItem value="16">16 ft</SelectItem>
                                              </>
                                            )}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex items-center gap-2 pb-1">
                                        <Switch
                                          checked={room.wallCovering.texture}
                                          onCheckedChange={(checked) => updateRoom(room.id, { wallCovering: { ...room.wallCovering, texture: checked } })}
                                        />
                                        <Label className="text-sm">Texture</Label>
                                      </div>
                                      {room.wallCovering.texture && (
                                        <div className="space-y-1 min-w-[140px]">
                                          <Select value={room.wallCovering.textureType} onValueChange={(value) => updateRoom(room.id, { wallCovering: { ...room.wallCovering, textureType: value } })}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="smooth">Smooth</SelectItem>
                                              <SelectItem value="no-texture">No texture</SelectItem>
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

                              {/* Electrical */}
                              <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={room.electrical.enabled}
                                    onCheckedChange={(checked) => updateRoom(room.id, { electrical: { ...room.electrical, enabled: checked } })}
                                  />
                                  <Label className="font-medium">Electrical</Label>
                                </div>
                                {room.electrical.enabled && (
                                  <div className="flex flex-wrap items-end gap-4">
                                    <div className="space-y-1 w-[80px]">
                                      <Label className="text-xs text-muted-foreground">110 Outlets</Label>
                                      <Input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="0"
                                        value={room.electrical.outlets110 || ""}
                                        onChange={(e) => {
                                          const val = e.target.value.replace(/^0+/, '') || "0"
                                          updateRoom(room.id, { electrical: { ...room.electrical, outlets110: parseInt(val) || 0 } })
                                        }}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                    <div className="space-y-1 w-[80px]">
                                      <Label className="text-xs text-muted-foreground">220 Outlets</Label>
                                      <Input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="0"
                                        value={room.electrical.outlets220 || ""}
                                        onChange={(e) => {
                                          const val = e.target.value.replace(/^0+/, '') || "0"
                                          updateRoom(room.id, { electrical: { ...room.electrical, outlets220: parseInt(val) || 0 } })
                                        }}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                    <div className="space-y-1 w-[80px]">
                                      <Label className="text-xs text-muted-foreground">GFI Outlets</Label>
                                      <Input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="0"
                                        value={room.electrical.gfiOutlets || ""}
                                        onChange={(e) => {
                                          const val = e.target.value.replace(/^0+/, '') || "0"
                                          updateRoom(room.id, { electrical: { ...room.electrical, gfiOutlets: parseInt(val) || 0 } })
                                        }}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                    <div className="space-y-1 w-[80px]">
                                      <Label className="text-xs text-muted-foreground">Light Switches</Label>
                                      <Input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="0"
                                        value={room.electrical.lightSwitches || ""}
                                        onChange={(e) => {
                                          const val = e.target.value.replace(/^0+/, '') || "0"
                                          updateRoom(room.id, { electrical: { ...room.electrical, lightSwitches: parseInt(val) || 0 } })
                                        }}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                    <div className="space-y-1 w-[80px]">
                                      <Label className="text-xs text-muted-foreground">Ceiling Lights</Label>
                                      <Input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="0"
                                        value={room.electrical.ceilingLights || ""}
                                        onChange={(e) => {
                                          const val = e.target.value.replace(/^0+/, '') || "0"
                                          updateRoom(room.id, { electrical: { ...room.electrical, ceilingLights: parseInt(val) || 0 } })
                                        }}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                    <div className="space-y-1 w-[80px]">
                                      <Label className="text-xs text-muted-foreground">Ceiling Fans</Label>
                                      <Input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="0"
                                        value={room.electrical.ceilingFans || ""}
                                        onChange={(e) => {
                                          const val = e.target.value.replace(/^0+/, '') || "0"
                                          updateRoom(room.id, { electrical: { ...room.electrical, ceilingFans: parseInt(val) || 0 } })
                                        }}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                    <div className="space-y-1 min-w-[130px]">
                                      <Label className="text-xs text-muted-foreground">Bathroom Light Bar</Label>
                                      <Select value={room.electrical.bathroomLightBar} onValueChange={(value) => updateRoom(room.id, { electrical: { ...room.electrical, bathroomLightBar: value } })}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="1">1 light</SelectItem>
                                          <SelectItem value="2">2 light</SelectItem>
                                          <SelectItem value="3">3 light</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-1 w-[80px]">
                                      <Input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="0"
                                        value={room.electrical.bathroomLightBarQty || ""}
                                        onChange={(e) => {
                                          const val = e.target.value.replace(/^0+/, '') || "0"
                                          updateRoom(room.id, { electrical: { ...room.electrical, bathroomLightBarQty: parseInt(val) || 0 } })
                                        }}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                  </div>
                                )}
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
                                          <SelectValue placeholder="Select" />
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
                                          <SelectValue placeholder="Select" />
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
                                          <SelectValue placeholder="Select" />
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
                                  <div key={door.id} className="space-y-3 rounded-lg bg-secondary/30 p-3">
                                    <div className="flex flex-wrap items-end gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-xs">Category</Label>
                                        <Badge variant="secondary" className="capitalize">{door.category}</Badge>
                                      </div>
                                      <div className="space-y-2 min-w-[120px]">
                                        <Label className="text-xs">Type</Label>
                                        <Select value={door.type} onValueChange={(value) => {
                                          const newDoors = [...room.doors]
                                          newDoors[idx] = { ...door, type: value }
                                          updateRoom(room.id, { doors: newDoors })
                                        }}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                            <SelectValue placeholder="Select" />
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
                                      <div className="space-y-2 min-w-[100px]">
                                        <Label className="text-xs">Grade</Label>
                                        <Select value={door.grade} onValueChange={(value) => {
                                          const newDoors = [...room.doors]
                                          newDoors[idx] = { ...door, grade: value }
                                          updateRoom(room.id, { doors: newDoors })
                                        }}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="standard">Standard</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="premium">Premium</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2 min-w-[120px]">
                                        <Label className="text-xs">Handle</Label>
                                        <Select value={door.handleAction} onValueChange={(value) => {
                                          const newDoors = [...room.doors]
                                          newDoors[idx] = { ...door, handleAction: value }
                                          updateRoom(room.id, { doors: newDoors })
                                        }}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="replace">Replace</SelectItem>
                                            <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex items-end gap-2 pb-1">
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
                                    {/* Misc options for Exterior doors */}
                                    {door.category === "exterior" && (
                                      <div className="flex items-center gap-4 pt-2 border-t border-border/20">
                                        <Label className="text-sm font-medium">Misc</Label>
                                        <div className="flex items-center gap-2">
                                          <Switch
                                            checked={door.peepHole}
                                            onCheckedChange={(checked) => {
                                              const newDoors = [...room.doors]
                                              newDoors[idx] = { ...door, peepHole: checked }
                                              updateRoom(room.id, { doors: newDoors })
                                            }}
                                          />
                                          <Label className="text-sm">Peep Hole</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Switch
                                            checked={door.mailSlot}
                                            onCheckedChange={(checked) => {
                                              const newDoors = [...room.doors]
                                              newDoors[idx] = { ...door, mailSlot: checked }
                                              updateRoom(room.id, { doors: newDoors })
                                            }}
                                          />
                                          <Label className="text-sm">Mail Slot</Label>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* BATHROOM SPECIFIC SECTIONS */}
                              {room.type === "bathroom" && room.vanity && room.toilet && room.shower && (
                                <>
                                  {/* Vanity */}
                                  <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                    <div className="flex items-center gap-3">
                                      <Switch
                                        checked={room.vanity.enabled}
                                        onCheckedChange={(checked) => updateRoom(room.id, { vanity: { ...room.vanity!, enabled: checked } })}
                                      />
                                      <Label className="font-medium">Vanity</Label>
                                    </div>
                                    {room.vanity.enabled && (
                                      <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="space-y-2">
                                          <Label className="text-sm">Linear Feet</Label>
                                          <Input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="LF"
                                            value={room.vanity.linearFeet || ""}
                                            onChange={(e) => updateRoom(room.id, { vanity: { ...room.vanity!, linearFeet: parseInt(e.target.value) || 0 } })}
                                            className="border-border/60 bg-secondary/50"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="text-sm">Countertop</Label>
                                          <Select value={room.vanity.countertop} onValueChange={(value) => updateRoom(room.id, { vanity: { ...room.vanity!, countertop: value } })}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="cultured-marble">Cultured Marble</SelectItem>
                                              <SelectItem value="granite">Granite</SelectItem>
                                              <SelectItem value="quartz">Quartz</SelectItem>
                                              <SelectItem value="laminate">Laminate</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex items-end">
                                          <div className="flex items-center gap-2">
                                            <Switch
                                              checked={room.vanity.backsplash}
                                              onCheckedChange={(checked) => updateRoom(room.id, { vanity: { ...room.vanity!, backsplash: checked } })}
                                            />
                                            <Label className="text-sm">Backsplash</Label>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Toilet */}
                                  <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                    <div className="flex items-center gap-3">
                                      <Switch
                                        checked={room.toilet.enabled}
                                        onCheckedChange={(checked) => updateRoom(room.id, { toilet: { ...room.toilet!, enabled: checked } })}
                                      />
                                      <Label className="font-medium">Toilet</Label>
                                    </div>
                                    {room.toilet.enabled && (
                                      <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="space-y-2">
                                          <Label className="text-sm">Action</Label>
                                          <Select value={room.toilet.action} onValueChange={(value) => updateRoom(room.id, { toilet: { ...room.toilet!, action: value } })}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="replace">Replace</SelectItem>
                                              <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex items-end">
                                          <div className="flex items-center gap-2">
                                            <Switch
                                              checked={room.toilet.seatReplacement}
                                              onCheckedChange={(checked) => updateRoom(room.id, { toilet: { ...room.toilet!, seatReplacement: checked } })}
                                            />
                                            <Label className="text-sm">Seat Replacement</Label>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Shower / Tub */}
                                  <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                    <div className="flex items-center gap-3">
                                      <Switch
                                        checked={room.shower.enabled}
                                        onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, enabled: checked } })}
                                      />
                                      <Label className="font-medium">Shower / Tub</Label>
                                    </div>
                                    {room.shower.enabled && (
                                      <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="space-y-2">
                                          <Label className="text-sm">Type</Label>
                                          <Select value={room.shower.type} onValueChange={(value) => updateRoom(room.id, { shower: { ...room.shower!, type: value } })}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="fiberglass-tub-shower">Fiberglass Tub/Shower</SelectItem>
                                              <SelectItem value="fiberglass-shower">Fiberglass Shower</SelectItem>
                                              <SelectItem value="tile-shower">Tile Shower</SelectItem>
                                              <SelectItem value="tub-only">Tub Only</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="text-sm">Size</Label>
                                          <Select value={room.shower.size} onValueChange={(value) => updateRoom(room.id, { shower: { ...room.shower!, size: value } })}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="up-to-60">Up to 60&quot;</SelectItem>
                                              <SelectItem value="61-72">61-72&quot;</SelectItem>
                                              <SelectItem value="over-72">Over 72&quot;</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-3">
                                          <div className="flex items-center gap-2">
                                            <Switch
                                              checked={room.shower.glassDoor}
                                              onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, glassDoor: checked } })}
                                            />
                                            <Label className="text-sm">Glass Door</Label>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Switch
                                              checked={room.shower.tileNiche}
                                              onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, tileNiche: checked } })}
                                            />
                                            <Label className="text-sm">Tile Niche</Label>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}

                              {/* KITCHEN SPECIFIC SECTIONS */}
                              {room.type === "kitchen" && room.cabinets && room.countertop && room.plumbing && room.appliances && (
                                <>
                                  {/* Kitchen Toggle */}
                                  <div className="flex items-center gap-3 mb-2">
                                    <Switch checked={true} />
                                    <Label className="font-medium">Kitchen</Label>
                                  </div>

                                  {/* Cabinetry */}
                                  <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                    <Label className="font-medium">Cabinetry</Label>
                                    <div className="flex flex-wrap items-end gap-4">
                                      <div className="space-y-1 min-w-[100px]">
                                        <Label className="text-xs text-muted-foreground">Size</Label>
                                        <Select value={room.cabinets.size} onValueChange={(value) => updateRoom(room.id, { cabinets: { ...room.cabinets!, size: value } })}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="1-100">1-100 LF</SelectItem>
                                            <SelectItem value="101-200">101-200 LF</SelectItem>
                                            <SelectItem value="201-300">201-300 LF</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-1 min-w-[120px]">
                                        <Label className="text-xs text-muted-foreground">Grade</Label>
                                        <Select value={room.cabinets.grade} onValueChange={(value) => updateRoom(room.id, { cabinets: { ...room.cabinets!, grade: value } })}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="base">Base</SelectItem>
                                            <SelectItem value="standard">Standard</SelectItem>
                                            <SelectItem value="high">High Grade</SelectItem>
                                            <SelectItem value="premium">Premium</SelectItem>
                                            <SelectItem value="custom">Custom</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex items-center gap-2 pb-1">
                                        <Switch
                                          checked={room.cabinets.detachAndReset}
                                          onCheckedChange={(checked) => updateRoom(room.id, { cabinets: { ...room.cabinets!, detachAndReset: checked } })}
                                        />
                                        <Label className="text-sm">Detach and reset</Label>
                                      </div>
                                    </div>
                                    
                                    {/* Toe Kick row */}
                                    <div className="flex flex-wrap items-end gap-4 pt-2 border-t border-border/20">
                                      <Label className="text-sm font-medium pb-1">Toe Kick</Label>
                                      <div className="space-y-1 min-w-[100px]">
                                        <Select value={room.cabinets.toeKick.size} onValueChange={(value) => updateRoom(room.id, { cabinets: { ...room.cabinets!, toeKick: { ...room.cabinets!.toeKick, size: value } } })}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Size" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="1-100">1-100 LF</SelectItem>
                                            <SelectItem value="101-200">101-200 LF</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-1 min-w-[120px]">
                                        <Label className="text-xs text-muted-foreground">Back Splash</Label>
                                        <Select value={room.cabinets.toeKick.backSplash} onValueChange={(value) => updateRoom(room.id, { cabinets: { ...room.cabinets!, toeKick: { ...room.cabinets!.toeKick, backSplash: value } } })}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="tile">Tile</SelectItem>
                                            <SelectItem value="solid-surface">Solid surface</SelectItem>
                                            <SelectItem value="unstained">Unstained</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-1 min-w-[100px]">
                                        <Label className="text-xs text-muted-foreground">Grade</Label>
                                        <Select value={room.cabinets.toeKick.grade} onValueChange={(value) => updateRoom(room.id, { cabinets: { ...room.cabinets!, toeKick: { ...room.cabinets!.toeKick, grade: value } } })}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="standard">Standard</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="premium">Premium</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex items-center gap-2 pb-1">
                                        <Switch
                                          checked={room.cabinets.toeKick.glass}
                                          onCheckedChange={(checked) => updateRoom(room.id, { cabinets: { ...room.cabinets!, toeKick: { ...room.cabinets!.toeKick, glass: checked } } })}
                                        />
                                        <Label className="text-sm">Glass</Label>
                                      </div>
                                      <div className="flex items-center gap-2 pb-1">
                                        <Switch
                                          checked={room.cabinets.toeKick.diagonalInstallation}
                                          onCheckedChange={(checked) => updateRoom(room.id, { cabinets: { ...room.cabinets!, toeKick: { ...room.cabinets!.toeKick, diagonalInstallation: checked } } })}
                                        />
                                        <Label className="text-sm">Diagonal installation</Label>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Countertop */}
                                  <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                    <Label className="font-medium">Countertop</Label>
                                    <div className="flex flex-wrap items-end gap-4">
                                      <div className="space-y-1 min-w-[140px]">
                                        <Label className="text-xs text-muted-foreground">Type</Label>
                                        <Select value={room.countertop.type} onValueChange={(value) => updateRoom(room.id, { countertop: { ...room.countertop!, type: value } })}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="cultured-marble">Cultured Marble</SelectItem>
                                            <SelectItem value="laminate">Laminate</SelectItem>
                                            <SelectItem value="tile">Tile</SelectItem>
                                            <SelectItem value="granite">Granite</SelectItem>
                                            <SelectItem value="marble">Marble</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-1 min-w-[120px]">
                                        <Label className="text-xs text-muted-foreground">Grade</Label>
                                        <Select value={room.countertop.grade} onValueChange={(value) => updateRoom(room.id, { countertop: { ...room.countertop!, grade: value } })}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="base">Base</SelectItem>
                                            <SelectItem value="standard">Standard</SelectItem>
                                            <SelectItem value="premium">Premium</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-1 min-w-[100px]">
                                        <Select value={room.countertop.size} onValueChange={(value) => updateRoom(room.id, { countertop: { ...room.countertop!, size: value } })}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Size" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="1-100">1-100 {room.countertop.type === "cultured-marble" || room.countertop.type === "laminate" ? "LF" : "SF"}</SelectItem>
                                            <SelectItem value="101-200">101-200 {room.countertop.type === "cultured-marble" || room.countertop.type === "laminate" ? "LF" : "SF"}</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex items-center gap-2 pb-1">
                                        <Switch
                                          checked={room.countertop.detachAndReset}
                                          onCheckedChange={(checked) => updateRoom(room.id, { countertop: { ...room.countertop!, detachAndReset: checked } })}
                                        />
                                        <Label className="text-sm">Detach and reset</Label>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Plumbing */}
                                  <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                    <Label className="font-medium">Plumbing</Label>
                                    <div className="flex flex-wrap items-center gap-6">
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={room.plumbing.replaceFaucetSink}
                                          onCheckedChange={(checked) => updateRoom(room.id, { plumbing: { ...room.plumbing!, replaceFaucetSink: checked } })}
                                        />
                                        <Label className="text-sm">Replace faucet/sink</Label>
                                      </div>
                                      <span className="text-muted-foreground text-sm">or</span>
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={room.plumbing.drFaucetSink}
                                          onCheckedChange={(checked) => updateRoom(room.id, { plumbing: { ...room.plumbing!, drFaucetSink: checked } })}
                                        />
                                        <Label className="text-sm">D/R faucet/sink</Label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={room.plumbing.waterSupplyLine.enabled}
                                          onCheckedChange={(checked) => updateRoom(room.id, { plumbing: { ...room.plumbing!, waterSupplyLine: { ...room.plumbing!.waterSupplyLine, enabled: checked } } })}
                                        />
                                        <Label className="text-sm">Water supply line</Label>
                                        {room.plumbing.waterSupplyLine.enabled && (
                                          <Select value={room.plumbing.waterSupplyLine.qty} onValueChange={(value) => updateRoom(room.id, { plumbing: { ...room.plumbing!, waterSupplyLine: { ...room.plumbing!.waterSupplyLine, qty: value } } })}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50 w-[80px]">
                                              <SelectValue placeholder="QTY" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="1">1</SelectItem>
                                              <SelectItem value="2">2</SelectItem>
                                              <SelectItem value="3">3</SelectItem>
                                              <SelectItem value="4">4</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Back Splash / Reverse Osmosis row */}
                                    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/20">
                                      <Label className="text-xs text-muted-foreground">Back Splash</Label>
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={room.plumbing.reverseOsmosis.enabled}
                                          onCheckedChange={(checked) => updateRoom(room.id, { plumbing: { ...room.plumbing!, reverseOsmosis: { ...room.plumbing!.reverseOsmosis, enabled: checked } } })}
                                        />
                                        <Label className="text-sm">Reverse osmosis</Label>
                                      </div>
                                      {room.plumbing.reverseOsmosis.enabled && (
                                        <>
                                          <Select value={room.plumbing.reverseOsmosis.action} onValueChange={(value) => updateRoom(room.id, { plumbing: { ...room.plumbing!, reverseOsmosis: { ...room.plumbing!.reverseOsmosis, action: value } } })}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50 w-[150px]">
                                              <SelectValue placeholder="Action" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                              <SelectItem value="replace">Replace</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <Input
                                            placeholder="F9 Model/serial..."
                                            value={room.plumbing.reverseOsmosis.f9Note}
                                            onChange={(e) => updateRoom(room.id, { plumbing: { ...room.plumbing!, reverseOsmosis: { ...room.plumbing!.reverseOsmosis, f9Note: e.target.value } } })}
                                            className="border-border/60 bg-secondary/50 flex-1 min-w-[200px]"
                                          />
                                        </>
                                      )}
                                    </div>

                                    {/* Garbage Disposal row */}
                                    <div className="flex flex-wrap items-center gap-4">
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={room.plumbing.garbageDisposal.enabled}
                                          onCheckedChange={(checked) => updateRoom(room.id, { plumbing: { ...room.plumbing!, garbageDisposal: { ...room.plumbing!.garbageDisposal, enabled: checked } } })}
                                        />
                                        <Label className="text-sm">Garbage Disposal</Label>
                                      </div>
                                      {room.plumbing.garbageDisposal.enabled && (
                                        <>
                                          <Select value={room.plumbing.garbageDisposal.action} onValueChange={(value) => updateRoom(room.id, { plumbing: { ...room.plumbing!, garbageDisposal: { ...room.plumbing!.garbageDisposal, action: value } } })}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50 w-[150px]">
                                              <SelectValue placeholder="Action" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                              <SelectItem value="replace">Replace</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <Input
                                            placeholder="F9 Model/serial..."
                                            value={room.plumbing.garbageDisposal.f9Note}
                                            onChange={(e) => updateRoom(room.id, { plumbing: { ...room.plumbing!, garbageDisposal: { ...room.plumbing!.garbageDisposal, f9Note: e.target.value } } })}
                                            className="border-border/60 bg-secondary/50 flex-1 min-w-[200px]"
                                          />
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Appliance / Misc Equipment */}
                                  <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                    <div className="flex items-center gap-3">
                                      <Switch
                                        checked={room.appliances.enabled}
                                        onCheckedChange={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, enabled: checked } })}
                                      />
                                      <Label className="font-medium">Appliance / Misc Equipment</Label>
                                    </div>
                                    
                                    {room.appliances.enabled && (
                                      <div className="space-y-3">
                                        {/* Refrigerator */}
                                        <div className="space-y-3 rounded-lg bg-secondary/30 p-3">
                                          <div className="flex items-center gap-3">
                                            <Switch
                                              checked={room.appliances.refrigerator.enabled}
                                              onCheckedChange={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, enabled: checked } } })}
                                            />
                                            <Label className="text-sm font-medium">Refrigerator</Label>
                                          </div>
                                          {room.appliances.refrigerator.enabled && (
                                            <div className="space-y-3">
                                              <div className="grid gap-4 sm:grid-cols-4">
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Type</Label>
                                                  <Select value={room.appliances.refrigerator.type} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, type: value, size: "" } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="top-freezer">Top Freezer</SelectItem>
                                                      <SelectItem value="bottom-freezer">Bottom Freezer</SelectItem>
                                                      <SelectItem value="built-in">Built In</SelectItem>
                                                      <SelectItem value="compact">Compact (under counter)</SelectItem>
                                                      <SelectItem value="side-by-side">Side by side</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                {room.appliances.refrigerator.type !== "compact" && (
                                                  <div className="space-y-2">
                                                    <Label className="text-xs">Size</Label>
                                                    <Select value={room.appliances.refrigerator.size} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, size: value } } })}>
                                                      <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                        <SelectValue placeholder="Select" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        {room.appliances.refrigerator.type === "top-freezer" && (
                                                          <>
                                                            <SelectItem value="14-18">14-18 CF</SelectItem>
                                                            <SelectItem value="18-22">18-22 CF</SelectItem>
                                                            <SelectItem value="23-26">23-26 CF</SelectItem>
                                                            <SelectItem value="14-26">14-26 CF</SelectItem>
                                                          </>
                                                        )}
                                                        {room.appliances.refrigerator.type === "bottom-freezer" && (
                                                          <>
                                                            <SelectItem value="18-22">18-22 CF</SelectItem>
                                                            <SelectItem value="22-25">22-25 CF</SelectItem>
                                                            <SelectItem value="25-30">25-30 CF</SelectItem>
                                                            <SelectItem value="25-36">25-36 CF</SelectItem>
                                                          </>
                                                        )}
                                                        {room.appliances.refrigerator.type === "built-in" && (
                                                          <>
                                                            <SelectItem value="36">36&quot;</SelectItem>
                                                            <SelectItem value="42">42&quot;</SelectItem>
                                                            <SelectItem value="48">48&quot;</SelectItem>
                                                          </>
                                                        )}
                                                        {room.appliances.refrigerator.type === "side-by-side" && (
                                                          <>
                                                            <SelectItem value="12-22">12-22 CF</SelectItem>
                                                            <SelectItem value="22-25">22-25 CF</SelectItem>
                                                            <SelectItem value="25-30">25-30 CF</SelectItem>
                                                          </>
                                                        )}
                                                        {!room.appliances.refrigerator.type && (
                                                          <>
                                                            <SelectItem value="14-18">14-18 CF</SelectItem>
                                                            <SelectItem value="18-22">18-22 CF</SelectItem>
                                                            <SelectItem value="22-25">22-25 CF</SelectItem>
                                                          </>
                                                        )}
                                                      </SelectContent>
                                                    </Select>
                                                  </div>
                                                )}
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Grade</Label>
                                                  <Select value={room.appliances.refrigerator.grade} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, grade: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="base">Base</SelectItem>
                                                      <SelectItem value="standard">Standard</SelectItem>
                                                      <SelectItem value="high">High grade</SelectItem>
                                                      <SelectItem value="premium">Premium</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Action</Label>
                                                  <Select value={room.appliances.refrigerator.action} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, action: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                      <SelectItem value="service-call">Service call</SelectItem>
                                                      <SelectItem value="replace">Replace</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                              <Input
                                                placeholder="F9 Model/serial..."
                                                value={room.appliances.refrigerator.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50"
                                              />
                                            </div>
                                          )}
                                        </div>

                                        {/* Dishwasher */}
                                        <div className="space-y-3 rounded-lg bg-secondary/30 p-3">
                                          <div className="flex items-center gap-3">
                                            <Switch
                                              checked={room.appliances.dishwasher.enabled}
                                              onCheckedChange={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, dishwasher: { ...room.appliances!.dishwasher, enabled: checked } } })}
                                            />
                                            <Label className="text-sm font-medium">Dishwasher</Label>
                                          </div>
                                          {room.appliances.dishwasher.enabled && (
                                            <div className="space-y-3">
                                              <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Grade</Label>
                                                  <Select value={room.appliances.dishwasher.grade} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, dishwasher: { ...room.appliances!.dishwasher, grade: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="standard">Standard</SelectItem>
                                                      <SelectItem value="high">High</SelectItem>
                                                      <SelectItem value="premium">Premium</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Action</Label>
                                                  <Select value={room.appliances.dishwasher.action} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, dishwasher: { ...room.appliances!.dishwasher, action: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                      <SelectItem value="replace">Replace</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                              <Input
                                                placeholder="F9 Model/serial..."
                                                value={room.appliances.dishwasher.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, dishwasher: { ...room.appliances!.dishwasher, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50"
                                              />
                                            </div>
                                          )}
                                        </div>

                                        {/* Range */}
                                        <div className="space-y-3 rounded-lg bg-secondary/30 p-3">
                                          <div className="flex items-center gap-3">
                                            <Switch
                                              checked={room.appliances.range.enabled}
                                              onCheckedChange={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, enabled: checked } } })}
                                            />
                                            <Label className="text-sm font-medium">Range</Label>
                                          </div>
                                          {room.appliances.range.enabled && (
                                            <div className="space-y-3">
                                              <div className="grid gap-4 sm:grid-cols-4">
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Type</Label>
                                                  <Select value={room.appliances.range.type} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, type: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="gas">Gas</SelectItem>
                                                      <SelectItem value="electric">Electric</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Options</Label>
                                                  <Select value={room.appliances.range.options} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, options: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="free-standing">Free Standing</SelectItem>
                                                      <SelectItem value="slide-in">Slide In</SelectItem>
                                                      <SelectItem value="drop-in">Drop In</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Grade</Label>
                                                  <Select value={room.appliances.range.grade} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, grade: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="standard">Standard</SelectItem>
                                                      <SelectItem value="high">High</SelectItem>
                                                      <SelectItem value="premium">Premium</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Action</Label>
                                                  <Select value={room.appliances.range.action} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, action: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                      <SelectItem value="replace">Replace</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                              <Input
                                                placeholder="F9 Model/serial..."
                                                value={room.appliances.range.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50"
                                              />
                                            </div>
                                          )}
                                        </div>

                                        {/* Cooktop */}
                                        <div className="space-y-3 rounded-lg bg-secondary/30 p-3">
                                          <div className="flex items-center gap-3">
                                            <Switch
                                              checked={room.appliances.cooktop.enabled}
                                              onCheckedChange={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, cooktop: { ...room.appliances!.cooktop, enabled: checked } } })}
                                            />
                                            <Label className="text-sm font-medium">Cooktop</Label>
                                          </div>
                                          {room.appliances.cooktop.enabled && (
                                            <div className="space-y-3">
                                              <div className="grid gap-4 sm:grid-cols-3">
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Type</Label>
                                                  <Select value={room.appliances.cooktop.type} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, cooktop: { ...room.appliances!.cooktop, type: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="gas">Gas</SelectItem>
                                                      <SelectItem value="electric">Electric</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Grade</Label>
                                                  <Select value={room.appliances.cooktop.grade} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, cooktop: { ...room.appliances!.cooktop, grade: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="standard">Standard</SelectItem>
                                                      <SelectItem value="high">High</SelectItem>
                                                      <SelectItem value="premium">Premium</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Action</Label>
                                                  <Select value={room.appliances.cooktop.action} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, cooktop: { ...room.appliances!.cooktop, action: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                      <SelectItem value="replace">Replace</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                              <Input
                                                placeholder="F9 Model/serial..."
                                                value={room.appliances.cooktop.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, cooktop: { ...room.appliances!.cooktop, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50"
                                              />
                                            </div>
                                          )}
                                        </div>

                                        {/* Water Heater */}
                                        <div className="space-y-3 rounded-lg bg-secondary/30 p-3">
                                          <div className="flex items-center gap-3">
                                            <Switch
                                              checked={room.appliances.waterHeater.enabled}
                                              onCheckedChange={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, enabled: checked } } })}
                                            />
                                            <Label className="text-sm font-medium">Water Heater</Label>
                                          </div>
                                          {room.appliances.waterHeater.enabled && (
                                            <div className="space-y-3">
                                              <div className="grid gap-4 sm:grid-cols-4">
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Type</Label>
                                                  <Select value={room.appliances.waterHeater.type} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, type: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="gas">Gas</SelectItem>
                                                      <SelectItem value="electric">Electric</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Size</Label>
                                                  <Select value={room.appliances.waterHeater.size} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, size: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="20">20 gal</SelectItem>
                                                      <SelectItem value="30">30 gal</SelectItem>
                                                      <SelectItem value="40">40 gal</SelectItem>
                                                      <SelectItem value="50">50 gal</SelectItem>
                                                      <SelectItem value="60">60 gal</SelectItem>
                                                      <SelectItem value="75">75 gal</SelectItem>
                                                      <SelectItem value="80">80 gal</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Rating</Label>
                                                  <Select value={room.appliances.waterHeater.rating} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, rating: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="6">6 yr</SelectItem>
                                                      <SelectItem value="9">9 yr</SelectItem>
                                                      <SelectItem value="12">12 yr</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Action</Label>
                                                  <Select value={room.appliances.waterHeater.action} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, action: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                      <SelectItem value="replace">Replace</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                              <Input
                                                placeholder="F9 Model/serial..."
                                                value={room.appliances.waterHeater.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50"
                                              />
                                            </div>
                                          )}
                                        </div>

                                        {/* Wall Oven */}
                                        <div className="space-y-3 rounded-lg bg-secondary/30 p-3">
                                          <div className="flex items-center gap-3">
                                            <Switch
                                              checked={room.appliances.wallOven.enabled}
                                              onCheckedChange={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, wallOven: { ...room.appliances!.wallOven, enabled: checked } } })}
                                            />
                                            <Label className="text-sm font-medium">Wall oven</Label>
                                          </div>
                                          {room.appliances.wallOven.enabled && (
                                            <div className="space-y-3">
                                              <div className="grid gap-4 sm:grid-cols-3">
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Type</Label>
                                                  <Select value={room.appliances.wallOven.type} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, wallOven: { ...room.appliances!.wallOven, type: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="freestanding">Freestanding</SelectItem>
                                                      <SelectItem value="slide-in">Slide in</SelectItem>
                                                      <SelectItem value="drop-in">Drop in</SelectItem>
                                                      <SelectItem value="freestanding-double">Freestanding - double oven</SelectItem>
                                                      <SelectItem value="built-in">Built in</SelectItem>
                                                      <SelectItem value="built-in-double">Built in double oven</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Grade</Label>
                                                  <Select value={room.appliances.wallOven.grade} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, wallOven: { ...room.appliances!.wallOven, grade: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="standard">Standard</SelectItem>
                                                      <SelectItem value="high">High</SelectItem>
                                                      <SelectItem value="premium">Premium</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Action</Label>
                                                  <Select value={room.appliances.wallOven.action} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, wallOven: { ...room.appliances!.wallOven, action: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                      <SelectItem value="replace">Replace</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                              <Input
                                                placeholder="F9 Model/serial..."
                                                value={room.appliances.wallOven.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, wallOven: { ...room.appliances!.wallOven, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50"
                                              />
                                            </div>
                                          )}
                                        </div>

                                        {/* Air Handler */}
                                        <div className="space-y-3 rounded-lg bg-secondary/30 p-3">
                                          <div className="flex items-center gap-3">
                                            <Switch
                                              checked={room.appliances.airHandler.enabled}
                                              onCheckedChange={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, airHandler: { ...room.appliances!.airHandler, enabled: checked } } })}
                                            />
                                            <Label className="text-sm font-medium">Air handler</Label>
                                          </div>
                                          {room.appliances.airHandler.enabled && (
                                            <div className="space-y-3">
                                              <div className="grid gap-4 sm:grid-cols-3">
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Type</Label>
                                                  <Select value={room.appliances.airHandler.type} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, airHandler: { ...room.appliances!.airHandler, type: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="2-ton">2 ton</SelectItem>
                                                      <SelectItem value="3-ton">3 ton</SelectItem>
                                                      <SelectItem value="4-ton">4 ton</SelectItem>
                                                      <SelectItem value="5-ton">5 ton</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Options</Label>
                                                  <Select value={room.appliances.airHandler.options} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, airHandler: { ...room.appliances!.airHandler, options: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="with-heating-element">With heating element</SelectItem>
                                                      <SelectItem value="with-a-coil">With A coil</SelectItem>
                                                      <SelectItem value="with-heating-and-coil">With heating element and a Coil</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Action</Label>
                                                  <Select value={room.appliances.airHandler.action} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, airHandler: { ...room.appliances!.airHandler, action: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                      <SelectItem value="replace">Replace</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                              <Input
                                                placeholder="F9 Model/serial..."
                                                value={room.appliances.airHandler.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, airHandler: { ...room.appliances!.airHandler, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50"
                                              />
                                            </div>
                                          )}
                                        </div>

                                        {/* Boiler */}
                                        <div className="space-y-3 rounded-lg bg-secondary/30 p-3">
                                          <div className="flex items-center gap-3">
                                            <Switch
                                              checked={room.appliances.boiler.enabled}
                                              onCheckedChange={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, enabled: checked } } })}
                                            />
                                            <Label className="text-sm font-medium">Boiler</Label>
                                          </div>
                                          {room.appliances.boiler.enabled && (
                                            <div className="space-y-3">
                                              <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Type</Label>
                                                  <Select value={room.appliances.boiler.type} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, type: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="natural-gas">Natural Gas</SelectItem>
                                                      <SelectItem value="electric">Electric</SelectItem>
                                                      <SelectItem value="oil-fired">Oil fired</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-xs">Action</Label>
                                                  <Select value={room.appliances.boiler.action} onValueChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, action: value } } })}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
                                                      <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                      <SelectItem value="replace">Replace</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                              <Input
                                                placeholder="F9 Model/serial..."
                                                value={room.appliances.boiler.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50"
                                              />
                                              <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2">
                                                  <Switch
                                                    checked={room.appliances.boiler.expansionTank}
                                                    onCheckedChange={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, expansionTank: checked } } })}
                                                  />
                                                  <Label className="text-sm">Expansion Tank</Label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <Switch
                                                    checked={room.appliances.boiler.circulatorPump}
                                                    onCheckedChange={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, circulatorPump: checked } } })}
                                                  />
                                                  <Label className="text-sm">Circulator pump</Label>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
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
