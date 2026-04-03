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
  HelpCircle,
  X
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
  windowsEnabled: boolean
  windows: WindowItem[]
  doorsEnabled: boolean
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
  vaporBarrier: boolean
  subfloorReplacement: boolean
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
  detail: string
  finish: string
  cap: boolean
  shoe: boolean
  shoeFinish: string
  subtractCabinetry: boolean
  }

interface WallCoveringOptions {
  enabled: boolean
  material: string
  type: string
  replacementHeight: string
  texture: boolean
  textureType: string
  panelingStyle: string
  panelingFinish: string
  panelingGrade: string
  chairRailAction: string
  chairRailFinish: string
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
  material: string
  size: string
  grade: string
  quantity: string
  finish: string
  blinds: string
  casingTrim: string
  marbleSillReplace: boolean
  marbleSillDetach: boolean
}

interface DoorItem {
  id: number
  category: "interior" | "exterior"
  type: string
  size: string
  grade: string
  finish: string
  handleAction: string
  misc: string
  peepHole: boolean
  mailSlot: boolean
  nonCased: boolean
  sidelites: boolean
  sidelitesQty: string
  panelSize: string
  panelGrade: string
  stormdoorAssembly: boolean
  retrofitInStucco: boolean
  }

interface VanityOptions {
  enabled: boolean
  size: string
  grade: string
  detachAndReset: boolean
  countertop: {
    type: string
    grade: string
    size: string
    pStop: string
    sink: string
    action: string
    faucet: string
    faucetAction: string
  }
  backsplashUnattached: boolean
  backsplashAction: string
}

interface ToiletOptions {
  enabled: boolean
  action: string
  seatReplacement: boolean
  supplyLine: boolean
}

interface ShowerOptions {
  enabled: boolean
  type: string
  // Fiberglass Tub/Shower Unit fields
  detachAndReset: boolean
  showerFaucet: string
  // Tub with Tile Surround fields
  actionForTub: string
  jetted: boolean
  jettedMotorReplace: boolean
  surround: string
  tubShowerFaucet: string
  // Tile Shower fields
  mortarBedReplace: boolean
  mortarBedSize: string
  walls: string
  // Misc fields
  tileBench: boolean
  tileNiche: boolean
  tileNicheQty: string
  towelBar: boolean
  tileSoapDish: boolean
  tileSoapDishQty: string
  grabBar: boolean
  grabBarQty: string
  tileFeatureStrip: boolean
  glassDoor: boolean
  glassDoorAction: string
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
  flooring: { enabled: false, multipleLayers: false, layers: [{ id: Date.now(), type: "", grade: "", application: "", action: "", vaporBarrier: false, subfloorReplacement: false }], vaporBarrier: false, subfloorReplacement: false, f9Note: "" },
  trim: { enabled: false, baseboardHeight: "", material: "", detail: "", finish: "", cap: false, shoe: false, shoeFinish: "", subtractCabinetry: false },
  wallCovering: { enabled: false, material: "", type: "", replacementHeight: "", texture: false, textureType: "", panelingStyle: "", panelingFinish: "", panelingGrade: "", chairRailAction: "", chairRailFinish: "" },
  electrical: { enabled: false, outlets110: 0, outlets220: 0, gfiOutlets: 0, lightSwitches: 0, ceilingLights: 0, ceilingFans: 0, bathroomLightBar: "", bathroomLightBarQty: 0 },
  windowsEnabled: false,
  windows: [],
  doorsEnabled: false,
  doors: [],
}

const defaultBathroomExtras = {
vanity: {
  enabled: false,
  size: "",
  grade: "",
  detachAndReset: false,
  countertop: { type: "", grade: "", size: "", pStop: "", sink: "", action: "", faucet: "", faucetAction: "" },
  backsplashUnattached: false,
  backsplashAction: ""
  },
  toilet: { enabled: false, action: "", seatReplacement: false, supplyLine: false },
shower: {
  enabled: false,
  type: "",
  detachAndReset: false,
  showerFaucet: "",
  actionForTub: "",
  jetted: false,
  jettedMotorReplace: false,
  surround: "",
  tubShowerFaucet: "",
  mortarBedReplace: false,
  mortarBedSize: "",
  walls: "",
  tileBench: false,
  tileNiche: false,
  tileNicheQty: "",
  towelBar: false,
  tileSoapDish: false,
  tileSoapDishQty: "",
  grabBar: false,
  grabBarQty: "",
  tileFeatureStrip: false,
  glassDoor: false,
  glassDoorAction: ""
  },
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
      circuits: [] as Array<{ id: number; type: string; qty: string }>,
    },
    finishes: {
      exteriorPaint: { enabled: false },
      siding: { enabled: false, perimeterFeet: "", squareFeetEnabled: false, squareFeet: "" },
      sheathing: { enabled: false, type: "", replacementHeight: "" },
      houseWrap: { enabled: false, replacementHeight: "" },
      backerBoard: { enabled: false, replacementHeight: "" },
      wallInsulation: { enabled: false, type: "", replacementHeight: "" },
    },
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
        material: "",
        size: "",
        grade: "",
        quantity: "",
        finish: "",
        blinds: "",
        casingTrim: "",
        marbleSillReplace: false,
        marbleSillDetach: false,
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
  size: "",
  grade: "",
  finish: "",
  handleAction: "",
  misc: "",
  peepHole: false,
  mailSlot: false,
  nonCased: false,
  sidelites: false,
  sidelitesQty: "",
  panelSize: "",
  panelGrade: "",
  stormdoorAssembly: false,
  retrofitInStucco: false,
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
                          <div className="flex items-center gap-3">
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
                          <div className="flex items-center gap-3">
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
                          <div className="flex items-center gap-3">
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
                        
                        {/* Breaker Circuit Replacement */}
                        <div className="w-full pt-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Label className="text-sm">Breaker Circuit Replacement</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 border-border/60 h-7 text-xs"
                              onClick={() => {
                                setExterior({
                                  ...exterior,
                                  electrical: {
                                    ...exterior.electrical,
                                    circuits: [...exterior.electrical.circuits, { id: Date.now(), type: "", qty: "" }]
                                  }
                                })
                                handleSave()
                              }}
                            >
                              Add Circuit +
                            </Button>
                          </div>
                          {exterior.electrical.circuits.map((circuit, idx) => (
                            <div key={circuit.id} className="flex items-center gap-3 mb-2">
                              <Select value={circuit.type} onValueChange={(v) => {
                                const value = v === "__none__" ? "" : v
                                const newCircuits = [...exterior.electrical.circuits]
                                newCircuits[idx] = { ...circuit, type: value }
                                setExterior({ ...exterior, electrical: { ...exterior.electrical, circuits: newCircuits } })
                                handleSave()
                              }}>
                                <SelectTrigger className="w-[180px] border-border/60 bg-secondary/50">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                  <SelectItem value="110v-single">110 V - Single Pole</SelectItem>
                                  <SelectItem value="220v-double">220 V - Double Pole</SelectItem>
                                  <SelectItem value="arc-fault-afci">Arc Fault - AFCI</SelectItem>
                                  <SelectItem value="ground-fault-gfi">Ground Fault - GFI</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="QTY"
                                value={circuit.qty}
                                onChange={(e) => {
                                  const newCircuits = [...exterior.electrical.circuits]
                                  newCircuits[idx] = { ...circuit, qty: e.target.value }
                                  setExterior({ ...exterior, electrical: { ...exterior.electrical, circuits: newCircuits } })
                                  handleSave()
                                }}
                                className="w-[80px] border-border/60 bg-secondary/50"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/20"
                                onClick={() => {
                                  const newCircuits = exterior.electrical.circuits.filter(c => c.id !== circuit.id)
                                  setExterior({ ...exterior, electrical: { ...exterior.electrical, circuits: newCircuits } })
                                  handleSave()
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Finishes and Insulation */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
                      <div className="flex items-center gap-3">
                        <Home className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Finishes and Insulation</span>
                        {(exterior.finishes.exteriorPaint.enabled || exterior.finishes.siding.enabled || exterior.finishes.sheathing.enabled || exterior.finishes.houseWrap.enabled || exterior.finishes.backerBoard.enabled || exterior.finishes.wallInsulation.enabled) && <Badge variant="secondary" className="text-xs">Saved</Badge>}
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
                      <div className="space-y-4">
                        {/* Exterior Paint */}
                        <div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={exterior.finishes.exteriorPaint.enabled}
                              onCheckedChange={(checked) => {
                                setExterior({ ...exterior, finishes: { ...exterior.finishes, exteriorPaint: { ...exterior.finishes.exteriorPaint, enabled: checked } } })
                                handleSave()
                              }}
                            />
                            <Label className="text-sm">Exterior Paint</Label>
                          </div>
                          <p className="text-[10px] text-amber-500 mt-1 ml-10">Note: This option is for full wall of for paint</p>
                        </div>

                        {/* Siding */}
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={exterior.finishes.siding.enabled}
                              onCheckedChange={(checked) => {
                                setExterior({ ...exterior, finishes: { ...exterior.finishes, siding: { ...exterior.finishes.siding, enabled: checked } } })
                                handleSave()
                              }}
                            />
                            <Label className="text-sm">Siding</Label>
                          </div>
                          {exterior.finishes.siding.enabled && (
                            <>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={!exterior.finishes.siding.squareFeetEnabled}
                                  onCheckedChange={(checked) => {
                                    setExterior({ ...exterior, finishes: { ...exterior.finishes, siding: { ...exterior.finishes.siding, squareFeetEnabled: !checked } } })
                                    handleSave()
                                  }}
                                />
                                <Label className="text-xs text-muted-foreground">Perimeter Feet</Label>
                              </div>
                              <span className="text-xs text-muted-foreground">Or</span>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={exterior.finishes.siding.squareFeetEnabled}
                                  onCheckedChange={(checked) => {
                                    setExterior({ ...exterior, finishes: { ...exterior.finishes, siding: { ...exterior.finishes.siding, squareFeetEnabled: checked } } })
                                    handleSave()
                                  }}
                                />
                                <Label className="text-xs text-muted-foreground">Square Feet</Label>
                              </div>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={exterior.finishes.siding.squareFeetEnabled ? exterior.finishes.siding.squareFeet : exterior.finishes.siding.perimeterFeet}
                                onChange={(e) => {
                                  if (exterior.finishes.siding.squareFeetEnabled) {
                                    setExterior({ ...exterior, finishes: { ...exterior.finishes, siding: { ...exterior.finishes.siding, squareFeet: e.target.value } } })
                                  } else {
                                    setExterior({ ...exterior, finishes: { ...exterior.finishes, siding: { ...exterior.finishes.siding, perimeterFeet: e.target.value } } })
                                  }
                                  handleSave()
                                }}
                                className="w-16 h-8 border-border/60 bg-secondary/50 text-sm"
                              />
                            </>
                          )}
                        </div>

                        {/* Sheathing */}
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={exterior.finishes.sheathing.enabled}
                              onCheckedChange={(checked) => {
                                setExterior({ ...exterior, finishes: { ...exterior.finishes, sheathing: { ...exterior.finishes.sheathing, enabled: checked } } })
                                handleSave()
                              }}
                            />
                            <Label className="text-sm">Sheathing</Label>
                          </div>
                          {exterior.finishes.sheathing.enabled && (
                            <>
                              <div className="flex items-center gap-2">
                                <Label className="text-xs text-muted-foreground">Type</Label>
                                <Select
                                  value={exterior.finishes.sheathing.type}
                                  onValueChange={(v) => {
                                    const value = v === "__none__" ? "" : v
                                    setExterior({ ...exterior, finishes: { ...exterior.finishes, sheathing: { ...exterior.finishes.sheathing, type: value } } })
                                    handleSave()
                                  }}
                                >
                                  <SelectTrigger className="w-[80px] h-8 border-border/60 bg-secondary/50 text-sm">
                                    <SelectValue placeholder="Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                    <SelectItem value="1/2">1/2</SelectItem>
                                    <SelectItem value="3/4">3/4</SelectItem>
                                    <SelectItem value="3/8">3/8</SelectItem>
                                    <SelectItem value="5/8">5/8</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center gap-2">
                                <Label className="text-xs text-muted-foreground">Replacement Height</Label>
                                <Select
                                  value={exterior.finishes.sheathing.replacementHeight}
                                  onValueChange={(v) => {
                                    const value = v === "__none__" ? "" : v
                                    setExterior({ ...exterior, finishes: { ...exterior.finishes, sheathing: { ...exterior.finishes.sheathing, replacementHeight: value } } })
                                    handleSave()
                                  }}
                                >
                                  <SelectTrigger className="w-[80px] h-8 border-border/60 bg-secondary/50 text-sm">
                                    <SelectValue placeholder="Height" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                    <SelectItem value="4">4 PF</SelectItem>
                                    <SelectItem value="8">8 PF</SelectItem>
                                    <SelectItem value="12">12 PF</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}
                        </div>

                        {/* House wrap */}
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={exterior.finishes.houseWrap.enabled}
                              onCheckedChange={(checked) => {
                                setExterior({ ...exterior, finishes: { ...exterior.finishes, houseWrap: { ...exterior.finishes.houseWrap, enabled: checked } } })
                                handleSave()
                              }}
                            />
                            <Label className="text-sm">House wrap</Label>
                          </div>
                          {exterior.finishes.houseWrap.enabled && (
                            <div className="flex items-center gap-2">
                              <Label className="text-xs text-muted-foreground">Replacement Height</Label>
                              <Select
                                value={exterior.finishes.houseWrap.replacementHeight}
                                onValueChange={(v) => {
                                  const value = v === "__none__" ? "" : v
                                  setExterior({ ...exterior, finishes: { ...exterior.finishes, houseWrap: { ...exterior.finishes.houseWrap, replacementHeight: value } } })
                                  handleSave()
                                }}
                              >
                                <SelectTrigger className="w-[80px] h-8 border-border/60 bg-secondary/50 text-sm">
                                  <SelectValue placeholder="Height" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                  <SelectItem value="4">4 PF</SelectItem>
                                  <SelectItem value="8">8 PF</SelectItem>
                                  <SelectItem value="12">12 PF</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        {/* Backer Board Behind Brick */}
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={exterior.finishes.backerBoard.enabled}
                              onCheckedChange={(checked) => {
                                setExterior({ ...exterior, finishes: { ...exterior.finishes, backerBoard: { ...exterior.finishes.backerBoard, enabled: checked } } })
                                handleSave()
                              }}
                            />
                            <Label className="text-sm">Backer Board Behind Brick</Label>
                          </div>
                          {exterior.finishes.backerBoard.enabled && (
                            <div className="flex items-center gap-2">
                              <Label className="text-xs text-muted-foreground">Replacement Height</Label>
                              <Select
                                value={exterior.finishes.backerBoard.replacementHeight}
                                onValueChange={(v) => {
                                  const value = v === "__none__" ? "" : v
                                  setExterior({ ...exterior, finishes: { ...exterior.finishes, backerBoard: { ...exterior.finishes.backerBoard, replacementHeight: value } } })
                                  handleSave()
                                }}
                              >
                                <SelectTrigger className="w-[80px] h-8 border-border/60 bg-secondary/50 text-sm">
                                  <SelectValue placeholder="Height" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                  <SelectItem value="4">4 PF</SelectItem>
                                  <SelectItem value="8">8 PF</SelectItem>
                                  <SelectItem value="12">12 PF</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        {/* Wall Insulation */}
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={exterior.finishes.wallInsulation.enabled}
                              onCheckedChange={(checked) => {
                                setExterior({ ...exterior, finishes: { ...exterior.finishes, wallInsulation: { ...exterior.finishes.wallInsulation, enabled: checked } } })
                                handleSave()
                              }}
                            />
                            <Label className="text-sm">Wall Insulation</Label>
                          </div>
                          {exterior.finishes.wallInsulation.enabled && (
                            <>
                              <Select
                                value={exterior.finishes.wallInsulation.type}
                                onValueChange={(v) => {
                                  const value = v === "__none__" ? "" : v
                                  setExterior({ ...exterior, finishes: { ...exterior.finishes, wallInsulation: { ...exterior.finishes.wallInsulation, type: value } } })
                                  handleSave()
                                }}
                              >
                                <SelectTrigger className="w-[120px] h-8 border-border/60 bg-secondary/50 text-sm">
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                  <SelectItem value="spray-foam">Spray foam</SelectItem>
                                  <SelectItem value="batt">Batt</SelectItem>
                                  <SelectItem value="blown-in">Blown-in</SelectItem>
                                  <SelectItem value="rigid-foam">Rigid foam</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex items-center gap-2">
                                <Label className="text-xs text-muted-foreground">Replacement Height</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={exterior.finishes.wallInsulation.replacementHeight}
                                  onChange={(e) => {
                                    setExterior({ ...exterior, finishes: { ...exterior.finishes, wallInsulation: { ...exterior.finishes.wallInsulation, replacementHeight: e.target.value } } })
                                    handleSave()
                                  }}
                                  className="w-16 h-8 border-border/60 bg-secondary/50 text-sm"
                                />
                                <span className="text-xs text-muted-foreground">PF</span>
                              </div>
                            </>
                          )}
                        </div>
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
                        <Collapsible key={room.id} defaultOpen>
                          <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg border border-primary/30 bg-primary/10 p-4 transition-colors hover:bg-primary/15">
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
                              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
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
                                  <Select value={room.type} onValueChange={(__v) => {
                                    const value = __v === "__none__" ? "" : __v;
                                    const updates: Partial<Room> = { type: value }
                                    // Add bathroom-specific fields when changing to bathroom
                                    if (value === "bathroom" && !room.vanity) {
                                      Object.assign(updates, defaultBathroomExtras)
                                    }
                                    // Add kitchen-specific fields when changing to kitchen
                                    if (value === "kitchen" && !room.cabinets) {
                                      Object.assign(updates, defaultKitchenExtras)
                                    }
                                    updateRoom(room.id, updates)
                                  }}>
                                    <SelectTrigger className="border-border/60 bg-secondary/50">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
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
                                            newFlooring.layers = [{ id: Date.now(), type: "", grade: "", application: "", action: "", vaporBarrier: false, subfloorReplacement: false }]
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
                                        const newLayer = { id: Date.now(), type: "", grade: "", application: "", action: "", vaporBarrier: false, subfloorReplacement: false }
                                        updateRoom(room.id, {
                                          flooring: {
                                            ...room.flooring,
                                            layers: [...currentLayers, newLayer]
                                          }
                                        })
                                      }}
                                    >
                                      <Plus className="h-3 w-3" /> Add Layer
                                    </Button>
                                  )}
                                </div>
                                {room.flooring.enabled && (
                                  <>
                                    <p className="text-xs text-amber-500">Note: Please note carpet installed over flooring is a content item</p>
                                    <div className="space-y-4">
                                      {(room.flooring.layers || []).map((layer, layerIndex) => (
                                        <div key={layer.id} className="rounded-lg bg-secondary/30 p-3">
                                          <div className="flex items-center gap-2 mb-2">
                                            <Label className="text-sm font-medium">{layerIndex === 0 ? "1st Layer" : `${layerIndex + 1}${layerIndex === 1 ? "nd" : layerIndex === 2 ? "rd" : "th"} Layer`}</Label>
                                          </div>
                                          <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                                            {/* All dropdowns first */}
                                            <div className="space-y-1">
                                              <Label className="text-xs text-muted-foreground">Type</Label>
                                              <Select
                                                value={layer.type}
                                                onValueChange={(__v) => {
                                                  const value = __v === "__none__" ? "" : __v;
                                                  const newLayers = [...(room.flooring.layers || [])]
                                                  newLayers[layerIndex] = { ...layer, type: value, grade: "", application: "" }
                                                  updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers } })
                                                }}
                                              >
                                                <SelectTrigger className="w-[120px] border-border/60 bg-secondary/50">
                                                  <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="vinyl-plank">Vinyl Plank</SelectItem>
                                                  <SelectItem value="sheet-vinyl">Sheet Vinyl</SelectItem>
                                                  <SelectItem value="laminate">Laminate</SelectItem>
                                                  <SelectItem value="carpet">Carpet</SelectItem>
                                                  <SelectItem value="carpet-glue-down">Carpet Glue Down</SelectItem>
                                                  <SelectItem value="hardwood">Hardwood</SelectItem>
                                                  <SelectItem value="tile">Tile</SelectItem>
                                                  <SelectItem value="terrazzo">Terrazzo Floor</SelectItem>
                                                  <SelectItem value="epoxy">Epoxy</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            {layer.type && layer.type !== "terrazzo" && (
                                              <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Grade</Label>
                                                <Select
                                                  value={layer.grade}
                                                  onValueChange={(__v) => {
                                                    const value = __v === "__none__" ? "" : __v;
                                                    const newLayers = [...(room.flooring.layers || [])]
                                                    newLayers[layerIndex] = { ...layer, grade: value }
                                                    updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers } })
                                                  }}
                                                >
                                                  <SelectTrigger className="w-[280px] border-border/60 bg-secondary/50">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                    {layer.type === "vinyl-plank" && (
                                                      <>
                                                        <SelectItem value="vinyl-plank">Vinyl Plank</SelectItem>
                                                        <SelectItem value="vinyl-plank-standard">Vinyl Plank - Standard</SelectItem>
                                                        <SelectItem value="vinyl-plank-high">Vinyl Plank - High Grade</SelectItem>
                                                        <SelectItem value="vinyl-plank-premium">Vinyl Plank - Premium Grade</SelectItem>
                                                      </>
                                                    )}
                                                    {layer.type === "sheet-vinyl" && (
                                                      <>
                                                        <SelectItem value="sheet-vinyl">Vinyl Floor Covering (sheet Goods)</SelectItem>
                                                        <SelectItem value="sheet-vinyl-standard">Vinyl Floor Covering - Standard</SelectItem>
                                                        <SelectItem value="sheet-vinyl-economy">Vinyl Floor Covering - Economy</SelectItem>
                                                        <SelectItem value="sheet-vinyl-high">Vinyl Floor Covering - High Grade</SelectItem>
                                                        <SelectItem value="sheet-vinyl-premium">Vinyl Floor Covering - Premium</SelectItem>
                                                      </>
                                                    )}
                                                    {layer.type === "laminate" && (
                                                      <>
                                                        <SelectItem value="laminate">Snaplock Laminate</SelectItem>
                                                        <SelectItem value="laminate-standard">Snaplock Laminate - Standard</SelectItem>
                                                        <SelectItem value="laminate-high">Snaplock Laminate - High Grade</SelectItem>
                                                      </>
                                                    )}
                                                    {layer.type === "carpet" && (
                                                      <>
                                                        <SelectItem value="carpet">Carpet</SelectItem>
                                                        <SelectItem value="carpet-standard">Carpet - Standard Grade</SelectItem>
                                                        <SelectItem value="carpet-economy">Carpet - Economy Grade</SelectItem>
                                                        <SelectItem value="carpet-high">Carpet - High Grade</SelectItem>
                                                        <SelectItem value="carpet-premium">Carpet - Premium Grade</SelectItem>
                                                      </>
                                                    )}
                                                    {layer.type === "carpet-glue-down" && (
                                                      <>
                                                        <SelectItem value="glue-down-carpet">Glue Down Carpet</SelectItem>
                                                        <SelectItem value="glue-down-carpet-standard">Glue Down Carpet - Standard</SelectItem>
                                                        <SelectItem value="glue-down-carpet-high">Glue Down Carpet - High Grade</SelectItem>
                                                        <SelectItem value="glue-down-carpet-premium">Glue Down Carpet - Premium</SelectItem>
                                                        <SelectItem value="glue-down-carpet-heavy">Glue Down Carpet - Heavy Traffic</SelectItem>
                                                      </>
                                                    )}
                                                    {layer.type === "hardwood" && (
                                                      <>
                                                        <SelectItem value="oak-1-common">Oak Flooring - #1 common</SelectItem>
                                                        <SelectItem value="oak-2-common">Oak Flooring - #2 common</SelectItem>
                                                        <SelectItem value="oak-select">Oak Flooring - select grade</SelectItem>
                                                        <SelectItem value="oak-clear">Oak Flooring - Clear Grade</SelectItem>
                                                      </>
                                                    )}
                                                    {layer.type === "tile" && (
                                                      <>
                                                        <SelectItem value="tile">Tile Floor Covering</SelectItem>
                                                        <SelectItem value="tile-standard">Tile Floor Covering - Standard</SelectItem>
                                                        <SelectItem value="tile-economy">Tile Floor Covering - Economy</SelectItem>
                                                        <SelectItem value="tile-high">Tile Floor Covering - High Grade</SelectItem>
                                                        <SelectItem value="tile-premium">Tile Floor Covering - Premium</SelectItem>
                                                        <SelectItem value="tile-clean-regrout">Clean and Regrout</SelectItem>
                                                      </>
                                                    )}
                                                    {layer.type === "epoxy" && (
                                                      <>
                                                        <SelectItem value="epoxy-one-coat">One Coat Over Concrete</SelectItem>
                                                        <SelectItem value="epoxy-two-coat">Two Coats Over Concrete</SelectItem>
                                                        <SelectItem value="epoxy-two-coat-nonslip">Two Coats Over Concrete - Non Slip</SelectItem>
                                                      </>
                                                    )}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            )}
                                            {(layer.type === "vinyl-plank" || layer.type === "hardwood" || layer.type === "terrazzo") && (
                                              <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Application</Label>
                                                <Select
                                                  value={layer.application}
                                                  onValueChange={(__v) => {
                                                    const value = __v === "__none__" ? "" : __v;
                                                    const newLayers = [...(room.flooring.layers || [])]
                                                    newLayers[layerIndex] = { ...layer, application: value }
                                                    updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers } })
                                                  }}
                                                >
                                                  <SelectTrigger className="w-[160px] border-border/60 bg-secondary/50">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                    {layer.type === "vinyl-plank" && (
                                                      <>
                                                        <SelectItem value="glue-down-concrete">Glue Down on Concrete</SelectItem>
                                                        <SelectItem value="installed-over-subfloor">Installed over Subfloor</SelectItem>
                                                        <SelectItem value="floating">Floating</SelectItem>
                                                      </>
                                                    )}
                                                    {layer.type === "hardwood" && (
                                                      <>
                                                        <SelectItem value="gluedown">Gluedown</SelectItem>
                                                        <SelectItem value="sleeper">Sleeper</SelectItem>
                                                        <SelectItem value="naildown-standard">Naildown - standard</SelectItem>
                                                      </>
                                                    )}
                                                    {layer.type === "terrazzo" && (
                                                      <>
                                                        <SelectItem value="clean-polish-seal">Clean, Polish and Seal</SelectItem>
                                                        <SelectItem value="grind-reseal">Grind and Reseal</SelectItem>
                                                      </>
                                                    )}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            )}
                                            {room.flooring.multipleLayers && (
                                              <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Action</Label>
                                                <Select
                                                  value={layer.action}
                                                  onValueChange={(__v) => {
                                                    const value = __v === "__none__" ? "" : __v;
                                                    const newLayers = [...(room.flooring.layers || [])]
                                                    newLayers[layerIndex] = { ...layer, action: value }
                                                    updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers } })
                                                  }}
                                                >
                                                  <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                    <SelectItem value="remove">Remove</SelectItem>
                                                    <SelectItem value="remove-replace">Remove & Replace</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            )}
                                            {/* Toggles after dropdowns */}
                                            <div className="flex items-center gap-2 pb-1">
                                              <Switch
                                                checked={layer.vaporBarrier}
                                                onCheckedChange={(checked) => {
                                                  const newLayers = [...(room.flooring.layers || [])]
                                                  newLayers[layerIndex] = { ...layer, vaporBarrier: checked, subfloorReplacement: checked ? false : layer.subfloorReplacement }
                                                  updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers } })
                                                }}
                                              />
                                              <Label className="text-sm whitespace-nowrap">Vapor Barrier</Label>
                                            </div>
                                            <div className="flex items-center gap-2 pb-1">
                                              <Switch
                                                checked={layer.subfloorReplacement}
                                                onCheckedChange={(checked) => {
                                                  const newLayers = [...(room.flooring.layers || [])]
                                                  newLayers[layerIndex] = { ...layer, subfloorReplacement: checked, vaporBarrier: checked ? false : layer.vaporBarrier }
                                                  updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers } })
                                                }}
                                              />
                                              <Label className="text-sm whitespace-nowrap">Subfloor Replacement</Label>
                                            </div>
                                            {/* Delete button at far right */}
                                            {layerIndex > 0 && (
                                              <>
                                                <div className="flex-1" />
                                                <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                  onClick={() => {
                                                    const newLayers = (room.flooring.layers || []).filter(l => l.id !== layer.id)
                                                    updateRoom(room.id, {
                                                      flooring: {
                                                        ...room.flooring,
                                                        layers: newLayers,
                                                        multipleLayers: newLayers.length > 1
                                                      }
                                                    })
                                                  }}
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                      {room.flooring.multipleLayers && (
                                        <div className="space-y-2 pt-2">
                                          <Textarea
                                            placeholder="F9 Description of the layers of floor removed..."
                                            value={room.flooring.f9Note}
                                            onChange={(e) => updateRoom(room.id, { flooring: { ...room.flooring, f9Note: e.target.value } })}
                                            className="border-border/60 bg-secondary/50 min-h-[60px]"
                                          />
                                        </div>
                                      )}
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
                                      <Label className="text-xs text-muted-foreground">Size</Label>
                                      <Select value={room.trim.baseboardHeight} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { trim: { ...room.trim, baseboardHeight: value } }) }}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                          {["2 1/4", "3 1/4", "4 1/4", "5 1/4", "6", "7 1/4", "8"].map(h => (
                                            <SelectItem key={h} value={h}>{h}&quot; Baseboard</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-1 min-w-[100px]">
                                      <Label className="text-xs text-muted-foreground">Material</Label>
                                      <Select value={room.trim.material} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { trim: { ...room.trim, material: value } }) }}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                          <SelectItem value="mdf">MDF</SelectItem>
                                          <SelectItem value="standard">Standard</SelectItem>
                                          <SelectItem value="wood">Wood</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    {room.trim.material === "wood" && (
                                      <div className="space-y-1 min-w-[220px]">
                                        <Label className="text-xs text-muted-foreground">Detail</Label>
                                        <Select value={room.trim.detail} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { trim: { ...room.trim, detail: value } }) }}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                            <SelectItem value="2-1/4-molded">2 1/4 Hardwood Molded w/Detail</SelectItem>
                                            <SelectItem value="3-1/4-molded">3 1/4 Hardwood - Molded w/ Detail</SelectItem>
                                            <SelectItem value="6-molded">6 Hardwood - Molded w/ Detail</SelectItem>
                                            <SelectItem value="7-1/4-molded">7 1/4 Hardwood - Molded w/ Detail</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                    <div className="space-y-1 min-w-[100px]">
                                      <Label className="text-xs text-muted-foreground">Finish</Label>
                                      <Select value={room.trim.finish} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { trim: { ...room.trim, finish: value } }) }}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
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
                                        <Select value={room.trim.shoeFinish} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { trim: { ...room.trim, shoeFinish: value } }) }}>
                                          <SelectTrigger className="border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Finish" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                            <SelectItem value="paint">Paint</SelectItem>
                                            <SelectItem value="stain">Stain</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                    {(room.type === "bathroom" || room.type === "kitchen") && (
                                      <div className="flex items-center gap-2 pb-1">
                                        <Switch
                                          checked={room.trim.subtractCabinetry}
                                          onCheckedChange={(checked) => updateRoom(room.id, { trim: { ...room.trim, subtractCabinetry: checked } })}
                                        />
                                        <Label className="text-sm">Subtract Cabinetry</Label>
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
                                      <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Material</Label>
                                        <Select value={room.wallCovering.material} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, material: value, type: "", replacementHeight: "" } }) }}>
                                          <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                            <SelectItem value="drywall-sf">Drywall (SF)</SelectItem>
                                            <SelectItem value="drywall-lf">Drywall (LF)</SelectItem>
                                            <SelectItem value="plaster">Plaster</SelectItem>
                                            <SelectItem value="paneling">Paneling</SelectItem>
                                            <SelectItem value="bead-board">Bead Board</SelectItem>
                                            <SelectItem value="tile-cement-board">Tile (Cement Board)</SelectItem>
                                            <SelectItem value="tile-wire-lath">Tile (Over Wire Lath)</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {room.wallCovering.material && room.wallCovering.material !== "bead-board" && (
                                        <div className="space-y-1">
                                          <Label className="text-xs text-muted-foreground">Type</Label>
                                          <Select value={room.wallCovering.type} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, type: value } }) }}>
                                            <SelectTrigger className="w-[280px] border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              {room.wallCovering.material === "drywall-sf" && (
                                                <>
                                                  <SelectItem value="1/2-in">1/2 in</SelectItem>
                                                  <SelectItem value="1/4-in">1/4 in</SelectItem>
                                                  <SelectItem value="3/8-in">3/8 in</SelectItem>
                                                  <SelectItem value="5/8-in">5/8 in</SelectItem>
                                                </>
                                              )}
                                              {room.wallCovering.material === "drywall-lf" && (
                                                <>
                                                  <SelectItem value="1/2-lf-4ft">1/2 - Drywall Per LF - up to 4&apos; tall</SelectItem>
                                                  <SelectItem value="5/8-lf-4ft">5/8 Drywall Per LF - up to 4&apos; tall</SelectItem>
                                                </>
                                              )}
                                              {room.wallCovering.material === "plaster" && (
                                                <>
                                                  <SelectItem value="two-coat-no-lath">Two Coat Plaster (No Lath)</SelectItem>
                                                  <SelectItem value="acoustic-1/2-blueboard">Acoustic Plaster Over 1/2 Gypsum Core Blueboard</SelectItem>
                                                  <SelectItem value="acoustic-5/8-blueboard">Acoustic Plaster Over 5/8 Gypsum Core Blueboard</SelectItem>
                                                  <SelectItem value="acoustic-1/2-metal-lath">Acoustic Plaster Over 1/2 Metal Lath</SelectItem>
                                                </>
                                              )}
                                              {room.wallCovering.material === "paneling" && (
                                                <>
                                                  <SelectItem value="paneling">Paneling</SelectItem>
                                                  <SelectItem value="paneling-standard">Paneling - Standard Grade</SelectItem>
                                                  <SelectItem value="paneling-high">Paneling High Grade</SelectItem>
                                                  <SelectItem value="paneling-premium">Paneling Premium Grade</SelectItem>
                                                  <SelectItem value="paneling-mobile-home">Paneling - Mobile Home</SelectItem>
                                                  <SelectItem value="paneling-unfinished">Paneling - Unfinished</SelectItem>
                                                  <SelectItem value="judges">Judges</SelectItem>
                                                </>
                                              )}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                      {/* Paneling - Unfinished fields */}
                                      {room.wallCovering.type === "paneling-unfinished" && (
                                        <>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Style</Label>
                                            <Select value={room.wallCovering.panelingStyle} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, panelingStyle: value } }) }}>
                                              <SelectTrigger className="w-[220px] border-border/60 bg-secondary/50">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="tg-bullnose">T&G Paneling - Bullnose</SelectItem>
                                                <SelectItem value="tg-double-beaded">T&G Paneling - Double Beaded Vee</SelectItem>
                                                <SelectItem value="tg-cedar">T&G Paneling - Cedar Paneling</SelectItem>
                                                <SelectItem value="tg-knotty-pine">T&G Paneling - Knotty Pine</SelectItem>
                                                <SelectItem value="tg-redwood">T&G Paneling - Redwood</SelectItem>
                                                <SelectItem value="tg-v-joint">T&G Paneling - V Joint</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Finish</Label>
                                            <Select value={room.wallCovering.panelingFinish} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, panelingFinish: value } }) }}>
                                              <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="paint">Paint</SelectItem>
                                                <SelectItem value="stain">Stain</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </>
                                      )}
                                      {/* Judges fields */}
                                      {room.wallCovering.type === "judges" && (
                                        <>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Style</Label>
                                            <Select value={room.wallCovering.panelingStyle} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, panelingStyle: value } }) }}>
                                              <SelectTrigger className="w-[180px] border-border/60 bg-secondary/50">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="flat-panel">Flat panel w/moldings</SelectItem>
                                                <SelectItem value="raised-panel">Raised panel</SelectItem>
                                                <SelectItem value="shaker-style">Shaker style</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Grade</Label>
                                            <Select value={room.wallCovering.panelingGrade} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, panelingGrade: value } }) }}>
                                              <SelectTrigger className="w-[120px] border-border/60 bg-secondary/50">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="paint-grade">Paint Grade</SelectItem>
                                                <SelectItem value="hardwood">Hardwood</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Finish</Label>
                                            <Select value={room.wallCovering.panelingFinish} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, panelingFinish: value } }) }}>
                                              <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="paint">Paint</SelectItem>
                                                <SelectItem value="stain">Stain</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </>
                                      )}
                                      {/* Bead Board fields */}
                                      {room.wallCovering.material === "bead-board" && (
                                        <>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Style</Label>
                                            <Select value={room.wallCovering.panelingStyle} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, panelingStyle: value } }) }}>
                                              <SelectTrigger className="w-[180px] border-border/60 bg-secondary/50">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="1/4-3/8-hardwood">1/4 to 3/8 Hardwood</SelectItem>
                                                <SelectItem value="1/2-mdf">1/2 MDF</SelectItem>
                                                <SelectItem value="1/4-mdf">1/4 MDF</SelectItem>
                                                <SelectItem value="3/8-softwood-veneer">3/8 Softwood Veneer</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Finish</Label>
                                            <Select value={room.wallCovering.panelingFinish} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, panelingFinish: value } }) }}>
                                              <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="paint">Paint</SelectItem>
                                                <SelectItem value="stain">Stain</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Replacement Height (PF)</Label>
                                            <Input
                                              type="number"
                                              min="0"
                                              placeholder="0"
                                              value={room.wallCovering.replacementHeight}
                                              onChange={(e) => updateRoom(room.id, { wallCovering: { ...room.wallCovering, replacementHeight: e.target.value } })}
                                              className="w-[80px] border-border/60 bg-secondary/50"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Chair Rail Action</Label>
                                            <Select value={room.wallCovering.chairRailAction} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, chairRailAction: value } }) }}>
                                              <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="replace">Replace</SelectItem>
                                                <SelectItem value="detach-reset">Detach & reset</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Chair Rail Finish</Label>
                                            <Select value={room.wallCovering.chairRailFinish} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, chairRailFinish: value } }) }}>
                                              <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="paint">Paint</SelectItem>
                                                <SelectItem value="stain">Stain</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </>
                                      )}
                                      {/* Replacement Height and Chair Rail for Drywall */}
                                      {room.wallCovering.material && room.wallCovering.material !== "paneling" && room.wallCovering.material !== "bead-board" && (
                                        <div className="space-y-1">
                                          <Label className="text-xs text-muted-foreground">Replacement Height</Label>
                                          <Select value={room.wallCovering.replacementHeight} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, replacementHeight: value } }) }}>
                                            <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              {room.wallCovering.material === "drywall-sf" && (
                                                <>
                                                  <SelectItem value="0.5W">0.5W</SelectItem>
                                                  <SelectItem value="W">W</SelectItem>
                                                </>
                                              )}
                                              {room.wallCovering.material === "drywall-lf" && (
                                                <>
                                                  <SelectItem value="PF">PF</SelectItem>
                                                  <SelectItem value="PFx2">PFx2</SelectItem>
                                                </>
                                              )}
                                              {room.wallCovering.material === "plaster" && (
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
                                      {/* Chair Rail for Drywall */}
                                      {(room.wallCovering.material === "drywall-sf" || room.wallCovering.material === "drywall-lf") && (
                                        <>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Chair Rail Action</Label>
                                            <Select value={room.wallCovering.chairRailAction} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, chairRailAction: value } }) }}>
                                              <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="replace">Replace</SelectItem>
                                                <SelectItem value="detach-reset">Detach & reset</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Chair Rail Finish</Label>
                                            <Select value={room.wallCovering.chairRailFinish} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { wallCovering: { ...room.wallCovering, chairRailFinish: value } }) }}>
                                              <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="paint">Paint</SelectItem>
                                                <SelectItem value="stain">Stain</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </>
                                      )}

                                    </div>
                                    {(room.wallCovering.material === "drywall-sf" || room.wallCovering.material === "drywall-lf") && (
                                      <p className="text-xs text-amber-500">Note: Some carriers require drywall calculated in SF instead of LF, please check with current guidelines of carriers</p>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Windows */}
                              <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={room.windowsEnabled}
                                    onCheckedChange={(checked) => { updateRoom(room.id, { windowsEnabled: checked }) }}
                                  />
                                  <Label className="font-medium">Windows ({room.windows.length})</Label>
                                  {room.windowsEnabled && (
                                    <Button variant="outline" size="sm" className="gap-2 border-border/60" onClick={() => addWindow(room.id)}>
                                      <Plus className="h-3 w-3" />
                                      Add Window
                                    </Button>
                                  )}
                                </div>
                                {room.windowsEnabled && room.windows.map((window, idx) => (
                                  <div key={window.id} className="rounded-lg bg-secondary/30 p-3 space-y-2">
                                    {/* First row: Type, Material, Size, Grade, QTY */}
                                    <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                                      <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Type</Label>
                                        <Select value={window.type} onValueChange={(__v) => {
                                          const value = __v === "__none__" ? "" : __v;
                                          const newWindows = [...room.windows]
                                          newWindows[idx] = { ...window, type: value, size: "", grade: "" }
                                          updateRoom(room.id, { windows: newWindows })
                                        }}>
                                          <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                            <SelectItem value="single-hung">Single Hung</SelectItem>
                                            <SelectItem value="double-hung">Double Hung</SelectItem>
                                            <SelectItem value="casement">Casement</SelectItem>
                                            <SelectItem value="fixed">Fixed</SelectItem>
                                            <SelectItem value="horizontal-slider">Horizontal Slider</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Material</Label>
                                        <Select value={window.material} onValueChange={(__v) => {
                                          const value = __v === "__none__" ? "" : __v;
                                          const newWindows = [...room.windows]
                                          newWindows[idx] = { ...window, material: value, size: "", grade: "" }
                                          updateRoom(room.id, { windows: newWindows })
                                        }}>
                                          <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                            <SelectItem value="vinyl">Vinyl</SelectItem>
                                            <SelectItem value="aluminum">Aluminum</SelectItem>
                                            <SelectItem value="wood">Wood</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {window.type && window.material && (
                                        <div className="space-y-1">
                                          <Label className="text-xs text-muted-foreground">Size</Label>
                                          <Select value={window.size} onValueChange={(__v) => {
                                            const value = __v === "__none__" ? "" : __v;
                                            const newWindows = [...room.windows]
                                            newWindows[idx] = { ...window, size: value }
                                            updateRoom(room.id, { windows: newWindows })
                                          }}>
                                            <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              {/* Vinyl - Single Hung */}
                                              {window.material === "vinyl" && window.type === "single-hung" && (
                                                <>
                                                  <SelectItem value="4-8">4-8 SF</SelectItem>
                                                  <SelectItem value="9-12">9-12 SF</SelectItem>
                                                  <SelectItem value="13-19">13-19 SF</SelectItem>
                                                  <SelectItem value="20-28">20-28 SF</SelectItem>
                                                </>
                                              )}
                                              {/* Vinyl - Double Hung */}
                                              {window.material === "vinyl" && window.type === "double-hung" && (
                                                <>
                                                  <SelectItem value="9-12">9-12 SF</SelectItem>
                                                  <SelectItem value="4-8">4-8 SF</SelectItem>
                                                  <SelectItem value="13-19">13-19 SF</SelectItem>
                                                  <SelectItem value="20-28">20-28 SF</SelectItem>
                                                </>
                                              )}
                                              {/* Vinyl - Casement */}
                                              {window.material === "vinyl" && window.type === "casement" && (
                                                <>
                                                  <SelectItem value="3-5">3-5 SF</SelectItem>
                                                  <SelectItem value="6-8">6-8 SF</SelectItem>
                                                  <SelectItem value="9-13">9-13 SF</SelectItem>
                                                </>
                                              )}
                                              {/* Aluminum - Horizontal Slider */}
                                              {window.material === "aluminum" && window.type === "horizontal-slider" && (
                                                <>
                                                  <SelectItem value="3-11">3-11 SF</SelectItem>
                                                  <SelectItem value="12-23">12-23 SF</SelectItem>
                                                  <SelectItem value="24-32">24-32 SF</SelectItem>
                                                  <SelectItem value="33-40">33-40 SF</SelectItem>
                                                </>
                                              )}
                                              {/* Aluminum - Casement */}
                                              {window.material === "aluminum" && window.type === "casement" && (
                                                <>
                                                  <SelectItem value="3-5">3-5 SF</SelectItem>
                                                  <SelectItem value="6-8">6-8 SF</SelectItem>
                                                  <SelectItem value="9-13">9-13 SF</SelectItem>
                                                </>
                                              )}
                                              {/* Aluminum - Fixed */}
                                              {window.material === "aluminum" && window.type === "fixed" && (
                                                <>
                                                  <SelectItem value="3-11">3-11 SF</SelectItem>
                                                  <SelectItem value="12-23">12-23 SF</SelectItem>
                                                  <SelectItem value="24-32">24-32 SF</SelectItem>
                                                  <SelectItem value="33-40">33-40 SF</SelectItem>
                                                </>
                                              )}
                                              {/* Aluminum - Single Hung */}
                                              {window.material === "aluminum" && window.type === "single-hung" && (
                                                <>
                                                  <SelectItem value="4-8">4-8 SF</SelectItem>
                                                  <SelectItem value="9-12">9-12 SF</SelectItem>
                                                  <SelectItem value="13-19">13-19 SF</SelectItem>
                                                  <SelectItem value="20-28">20-28 SF</SelectItem>
                                                </>
                                              )}
                                              {/* Aluminum - Double Hung */}
                                              {window.material === "aluminum" && window.type === "double-hung" && (
                                                <>
                                                  <SelectItem value="4-8">4-8 SF</SelectItem>
                                                  <SelectItem value="9-12">9-12 SF</SelectItem>
                                                  <SelectItem value="13-19">13-19 SF</SelectItem>
                                                  <SelectItem value="20-28">20-28 SF</SelectItem>
                                                </>
                                              )}
                                              {/* Wood - Casement */}
                                              {window.material === "wood" && window.type === "casement" && (
                                                <>
                                                  <SelectItem value="3-11">3-11 SF</SelectItem>
                                                  <SelectItem value="12-23">12-23 SF</SelectItem>
                                                  <SelectItem value="24-32">24-32 SF</SelectItem>
                                                  <SelectItem value="33-40">33-40 SF</SelectItem>
                                                </>
                                              )}
                                              {/* Wood - Double Hung */}
                                              {window.material === "wood" && window.type === "double-hung" && (
                                                <>
                                                  <SelectItem value="4-8">4-8 SF</SelectItem>
                                                  <SelectItem value="9-12">9-12 SF</SelectItem>
                                                  <SelectItem value="13-19">13-19 SF</SelectItem>
                                                  <SelectItem value="20-28">20-28 SF</SelectItem>
                                                </>
                                              )}
                                              {/* Wood - Horizontal Slider */}
                                              {window.material === "wood" && window.type === "horizontal-slider" && (
                                                <>
                                                  <SelectItem value="3-11">3-11 SF</SelectItem>
                                                  <SelectItem value="12-23">12-23 SF</SelectItem>
                                                  <SelectItem value="24-32">24-32 SF</SelectItem>
                                                  <SelectItem value="33-40">33-40 SF</SelectItem>
                                                </>
                                              )}
                                              {/* Wood - Fixed */}
                                              {window.material === "wood" && window.type === "fixed" && (
                                                <>
                                                  <SelectItem value="3-11">3-11 SF</SelectItem>
                                                  <SelectItem value="12-23">12-23 SF</SelectItem>
                                                  <SelectItem value="24-32">24-32 SF</SelectItem>
                                                  <SelectItem value="33-44">33-44 SF</SelectItem>
                                                  <SelectItem value="44-55">44-55 SF</SelectItem>
                                                </>
                                              )}
                                              {/* Wood - Single Hung */}
                                              {window.material === "wood" && window.type === "single-hung" && (
                                                <>
                                                  <SelectItem value="4-8">4-8 SF</SelectItem>
                                                  <SelectItem value="9-12">9-12 SF</SelectItem>
                                                  <SelectItem value="13-19">13-19 SF</SelectItem>
                                                  <SelectItem value="20-28">20-28 SF</SelectItem>
                                                </>
                                              )}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                      {window.type && window.material && (
                                        <div className="space-y-1">
                                          <Label className="text-xs text-muted-foreground">Grade</Label>
                                          <Select value={window.grade} onValueChange={(__v) => {
                                            const value = __v === "__none__" ? "" : __v;
                                            const newWindows = [...room.windows]
                                            newWindows[idx] = { ...window, grade: value }
                                            updateRoom(room.id, { windows: newWindows })
                                          }}>
                                            <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              {/* Vinyl - all types */}
                                              {window.material === "vinyl" && (
                                                <>
                                                  <SelectItem value="base">Base</SelectItem>
                                                  <SelectItem value="high">High Grade</SelectItem>
                                                  <SelectItem value="premium">Premium Grade</SelectItem>
                                                </>
                                              )}
                                              {/* Aluminum - Horizontal Slider, Fixed, Single Hung, Double Hung */}
                                              {window.material === "aluminum" && (window.type === "horizontal-slider" || window.type === "fixed") && (
                                                <>
                                                  <SelectItem value="base">Base</SelectItem>
                                                  <SelectItem value="2-pane">2 Pane</SelectItem>
                                                  <SelectItem value="2-pane-thermal">2 Pane w/Thermal</SelectItem>
                                                </>
                                              )}
                                              {/* Aluminum - Casement, Single Hung, Double Hung */}
                                              {window.material === "aluminum" && (window.type === "casement" || window.type === "single-hung" || window.type === "double-hung") && (
                                                <>
                                                  <SelectItem value="base">Base</SelectItem>
                                                  <SelectItem value="high">High Grade</SelectItem>
                                                  <SelectItem value="premium">Premium Grade</SelectItem>
                                                </>
                                              )}
                                              {/* Wood - Casement */}
                                              {window.material === "wood" && window.type === "casement" && (
                                                <>
                                                  <SelectItem value="base">Base</SelectItem>
                                                  <SelectItem value="high">High Grade</SelectItem>
                                                  <SelectItem value="premium">Premium Grade</SelectItem>
                                                </>
                                              )}
                                              {/* Wood - Double Hung, Horizontal Slider, Fixed, Single Hung */}
                                              {window.material === "wood" && (window.type === "double-hung" || window.type === "horizontal-slider" || window.type === "fixed" || window.type === "single-hung") && (
                                                <>
                                                  <SelectItem value="base">Base</SelectItem>
                                                  <SelectItem value="standard">Standard Grade</SelectItem>
                                                  <SelectItem value="high">High Grade</SelectItem>
                                                  <SelectItem value="premium">Premium Grade</SelectItem>
                                                </>
                                              )}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                      <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">QTY</Label>
                                        <Select value={window.quantity} onValueChange={(__v) => {
                                          const value = __v === "__none__" ? "" : __v;
                                          const newWindows = [...room.windows]
                                          newWindows[idx] = { ...window, quantity: value }
                                          updateRoom(room.id, { windows: newWindows })
                                        }}>
                                          <SelectTrigger className="w-[70px] border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                            {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                                              <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {/* Copy and Delete buttons */}
                                      <div className="flex-1" />
                                      <div className="flex items-center gap-1">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                          onClick={() => {
                                            const newWindow = { ...window, id: Date.now() }
                                            updateRoom(room.id, { windows: [...room.windows, newWindow] })
                                          }}
                                        >
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                          onClick={() => {
                                            const newWindows = room.windows.filter(w => w.id !== window.id)
                                            updateRoom(room.id, { windows: newWindows })
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    {/* Second row: Blinds, Casing/Trim, Marble Sill Replace, Marble Sill Detach */}
                                    <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                                      <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Blinds</Label>
                                        <Select value={window.blinds} onValueChange={(__v) => {
                                          const value = __v === "__none__" ? "" : __v;
                                          const newWindows = [...room.windows]
                                          newWindows[idx] = { ...window, blinds: value }
                                          updateRoom(room.id, { windows: newWindows })
                                        }}>
                                          <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                            <SelectItem value="pvc">PVC</SelectItem>
                                            <SelectItem value="wood">Wood</SelectItem>
                                            <SelectItem value="metal">Metal</SelectItem>
                                            <SelectItem value="shutters">Shutters</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Casing/Trim</Label>
                                        <Select value={window.casingTrim} onValueChange={(__v) => {
                                          const value = __v === "__none__" ? "" : __v;
                                          const newWindows = [...room.windows]
                                          newWindows[idx] = { ...window, casingTrim: value }
                                          updateRoom(room.id, { windows: newWindows })
                                        }}>
                                          <SelectTrigger className="w-[180px] border-border/60 bg-secondary/50">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                            <SelectItem value="untrimmed">Untrimmed Window</SelectItem>
                                            <SelectItem value="casing-stain">Casing - Stain</SelectItem>
                                            <SelectItem value="casing-apron-stain">Casing With Apron - Stain</SelectItem>
                                            <SelectItem value="casing-paint">Casing - Paint</SelectItem>
                                            <SelectItem value="casing-apron-paint">Casing With Apron - Paint</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex items-center gap-2 pb-1">
                                        <Switch
                                          checked={window.marbleSillReplace}
                                          onCheckedChange={(checked) => {
                                            const newWindows = [...room.windows]
                                            newWindows[idx] = { ...window, marbleSillReplace: checked }
                                            updateRoom(room.id, { windows: newWindows })
                                          }}
                                        />
                                        <Label className="text-sm whitespace-nowrap">Marble Sill Replace</Label>
                                      </div>
                                      <div className="flex items-center gap-2 pb-1">
                                        <Switch
                                          checked={window.marbleSillDetach}
                                          onCheckedChange={(checked) => {
                                            const newWindows = [...room.windows]
                                            newWindows[idx] = { ...window, marbleSillDetach: checked }
                                            updateRoom(room.id, { windows: newWindows })
                                          }}
                                        />
                                        <Label className="text-sm whitespace-nowrap">Marble Sill Detach</Label>
                                      </div>
                                    </div>
                                  </div>
                                ))}
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
                                  <div className="flex flex-wrap items-center gap-4">
                                    <div className="space-y-1 w-[80px]">
                                      <Label className="text-xs text-muted-foreground">110 Outlets</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        placeholder="QTY"
                                        value={room.electrical.outlets110 || ""}
                                        onChange={(e) => updateRoom(room.id, { electrical: { ...room.electrical, outlets110: parseInt(e.target.value) || 0 } })}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                    <div className="space-y-1 w-[80px]">
                                      <Label className="text-xs text-muted-foreground">220 Outlets</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        placeholder="QTY"
                                        value={room.electrical.outlets220 || ""}
                                        onChange={(e) => updateRoom(room.id, { electrical: { ...room.electrical, outlets220: parseInt(e.target.value) || 0 } })}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                    <div className="space-y-1 w-[80px]">
                                      <Label className="text-xs text-muted-foreground">GFI Outlets</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        placeholder="QTY"
                                        value={room.electrical.gfiOutlets || ""}
                                        onChange={(e) => updateRoom(room.id, { electrical: { ...room.electrical, gfiOutlets: parseInt(e.target.value) || 0 } })}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                    <div className="space-y-1 w-[80px]">
                                      <Label className="text-xs text-muted-foreground">Light Switches</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        placeholder="QTY"
                                        value={room.electrical.lightSwitches || ""}
                                        onChange={(e) => updateRoom(room.id, { electrical: { ...room.electrical, lightSwitches: parseInt(e.target.value) || 0 } })}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                    <div className="space-y-1 w-[80px]">
                                      <Label className="text-xs text-muted-foreground">Ceiling Lights</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        placeholder="QTY"
                                        value={room.electrical.ceilingLights || ""}
                                        onChange={(e) => updateRoom(room.id, { electrical: { ...room.electrical, ceilingLights: parseInt(e.target.value) || 0 } })}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                    <div className="space-y-1 w-[80px]">
                                      <Label className="text-xs text-muted-foreground">Ceiling Fans</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        placeholder="QTY"
                                        value={room.electrical.ceilingFans || ""}
                                        onChange={(e) => updateRoom(room.id, { electrical: { ...room.electrical, ceilingFans: parseInt(e.target.value) || 0 } })}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                    <div className="space-y-1 min-w-[130px]">
                                      <Label className="text-xs text-muted-foreground">Bathroom Light Bar</Label>
                                      <Select value={room.electrical.bathroomLightBar} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { electrical: { ...room.electrical, bathroomLightBar: value } }) }}>
                                        <SelectTrigger className="border-border/60 bg-secondary/50">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                          <SelectItem value="1">1 light</SelectItem>
                                          <SelectItem value="2">2 light</SelectItem>
                                          <SelectItem value="3">3 light</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-1 w-[80px]">
                                      <Input
                                        type="number"
                                        min="0"
                                        placeholder="QTY"
                                        value={room.electrical.bathroomLightBarQty || ""}
                                        onChange={(e) => updateRoom(room.id, { electrical: { ...room.electrical, bathroomLightBarQty: parseInt(e.target.value) || 0 } })}
                                        className="border-border/60 bg-secondary/50"
                                      />
                                    </div>
                                  </div>
                                )}
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
                                      <div className="space-y-3 pl-2">
                                        {/* Vanity Cabinet row */}
                                        <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Size (LF)</Label>
                                            <Input
                                              type="text"
                                              value={room.vanity.size}
                                              onChange={(e) => updateRoom(room.id, { vanity: { ...room.vanity!, size: e.target.value } })}
                                              placeholder="Qty"
                                              className="w-[80px] border-border/60 bg-secondary/50"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Grade</Label>
                                            <Select value={room.vanity.grade} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { vanity: { ...room.vanity!, grade: value } }) }}>
                                              <SelectTrigger className="w-[110px] border-border/60 bg-secondary/50">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="base">Base</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="premium">Premium</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="flex items-center gap-2 pb-1">
                                            <Switch
                                              checked={room.vanity.detachAndReset}
                                              onCheckedChange={(checked) => updateRoom(room.id, { vanity: { ...room.vanity!, detachAndReset: checked } })}
                                            />
                                            <Label className="text-xs whitespace-nowrap">Detach and Reset</Label>
                                          </div>
                                          <span className="text-xs text-orange-400 pb-1">Note: cabinets are replaced/in unless D/R is selected</span>
                                        </div>
                                        {/* Countertop section */}
                                        <div className="rounded-md border border-border/30 bg-secondary/20 p-3 space-y-3">
                                          <Label className="text-xs font-medium text-muted-foreground">Countertop</Label>
                                          <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                                            <div className="space-y-1">
                                              <Label className="text-xs text-muted-foreground">Type</Label>
                                              <Select value={room.vanity.countertop.type} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { vanity: { ...room.vanity!, countertop: { ...room.vanity!.countertop, type: value } } }) }}>
                                                <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                                                  <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="cultured-marble">Cultured Marble</SelectItem>
                                                  <SelectItem value="laminate">Laminate</SelectItem>
                                                  <SelectItem value="tile">Tile</SelectItem>
                                                  <SelectItem value="granite">Granite</SelectItem>
                                                  <SelectItem value="marble">Marble</SelectItem>
                                                  <SelectItem value="butcher-block">Butcher Block</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div className="space-y-1">
                                              <Label className="text-xs text-muted-foreground">Grade</Label>
                                              <Select value={room.vanity.countertop.grade} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { vanity: { ...room.vanity!, countertop: { ...room.vanity!.countertop, grade: value } } }) }}>
                                                <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                                                  <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="base">Base</SelectItem>
                                                  <SelectItem value="high">High</SelectItem>
                                                  <SelectItem value="premium">Premium</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div className="space-y-1">
                                              <Label className="text-xs text-muted-foreground">
                                                Size ({room.vanity.countertop.type === "cultured-marble" ? "LF" : "SF"})
                                              </Label>
                                              <Input
                                                type="text"
                                                value={room.vanity.countertop.size}
                                                onChange={(e) => updateRoom(room.id, { vanity: { ...room.vanity!, countertop: { ...room.vanity!.countertop, size: e.target.value } } })}
                                                placeholder="QTY"
                                                className="w-[80px] border-border/60 bg-secondary/50"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <Label className="text-xs text-muted-foreground">P-Stop</Label>
                                              <Input
                                                type="text"
                                                value={room.vanity.countertop.pStop}
                                                onChange={(e) => updateRoom(room.id, { vanity: { ...room.vanity!, countertop: { ...room.vanity!.countertop, pStop: e.target.value } } })}
                                                placeholder="QTY"
                                                className="w-[70px] border-border/60 bg-secondary/50"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <Label className="text-xs text-muted-foreground">Sink</Label>
                                              <Select value={room.vanity.countertop.sink} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { vanity: { ...room.vanity!, countertop: { ...room.vanity!.countertop, sink: value } } }) }}>
                                                <SelectTrigger className="w-[150px] border-border/60 bg-secondary/50">
                                                  <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="sink">Sink</SelectItem>
                                                  <SelectItem value="double">Double</SelectItem>
                                                  <SelectItem value="undermount-single">Undermount - Single</SelectItem>
                                                  <SelectItem value="undermount-double">Undermount - Double</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div className="space-y-1">
                                              <Label className="text-xs text-muted-foreground">Action</Label>
                                              <Select value={room.vanity.countertop.action} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { vanity: { ...room.vanity!, countertop: { ...room.vanity!.countertop, action: value } } }) }}>
                                                <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                                                  <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div className="space-y-1">
                                              <Label className="text-xs text-muted-foreground">Faucet</Label>
                                              <Input
                                                type="text"
                                                value={room.vanity.countertop.faucet}
                                                onChange={(e) => updateRoom(room.id, { vanity: { ...room.vanity!, countertop: { ...room.vanity!.countertop, faucet: e.target.value } } })}
                                                placeholder="QTY"
                                                className="w-[70px] border-border/60 bg-secondary/50"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <Label className="text-xs text-muted-foreground">Faucet Action</Label>
                                              <Select value={room.vanity.countertop.faucetAction} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { vanity: { ...room.vanity!, countertop: { ...room.vanity!.countertop, faucetAction: value } } }) }}>
                                                <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                                                  <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                                  <SelectItem value="replace">Replace</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </div>
                                          {/* Backsplash/Unattached row */}
                                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 border-t border-border/20">
                                            <div className="flex items-center gap-2">
                                              <Switch
                                                checked={room.vanity.backsplashUnattached}
                                                onCheckedChange={(checked) => updateRoom(room.id, { vanity: { ...room.vanity!, backsplashUnattached: checked, backsplashAction: checked ? room.vanity!.backsplashAction : "" } })}
                                              />
                                              <Label className="text-xs whitespace-nowrap">Backsplash/Unattached</Label>
                                            </div>
                                            {room.vanity.backsplashUnattached && (
                                              <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Action</Label>
                                                <Select value={room.vanity.backsplashAction} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { vanity: { ...room.vanity!, backsplashAction: value } }) }}>
                                                  <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                    <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            )}
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
                                      <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                                        <div className="space-y-1">
                                          <Label className="text-xs text-muted-foreground">Action</Label>
                                          <Select value={room.toilet.action} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { toilet: { ...room.toilet!, action: value } }) }}>
                                            <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              <SelectItem value="replace">Replace</SelectItem>
                                              <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex items-center gap-2 pb-1">
                                          <Switch
                                            checked={room.toilet.seatReplacement}
                                            onCheckedChange={(checked) => updateRoom(room.id, { toilet: { ...room.toilet!, seatReplacement: checked } })}
                                          />
                                          <Label className="text-sm whitespace-nowrap">Seat Replacement</Label>
                                        </div>
                                        <div className="flex items-center gap-2 pb-1">
                                          <Switch
                                            checked={room.toilet.supplyLine}
                                            onCheckedChange={(checked) => updateRoom(room.id, { toilet: { ...room.toilet!, supplyLine: checked } })}
                                          />
                                          <Label className="text-sm whitespace-nowrap">Supply Line</Label>
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
                                      <div className="space-y-3">
                                        <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Type</Label>
                                            <Select value={room.shower.type} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { shower: { ...room.shower!, type: value } }) }}>
                                              <SelectTrigger className="w-[180px] border-border/60 bg-secondary/50">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="fiberglass-tub-shower">Fiberglass Tub/Shwr Unit</SelectItem>
                                                <SelectItem value="tub-tile-surround">Tub With Tiled Surround</SelectItem>
                                                <SelectItem value="tub-cultured-marble">Tub With Cultured Marble</SelectItem>
                                                <SelectItem value="tile-shower">Tiled Shower</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          {/* Fiberglass Tub/Shower Unit fields */}
                                          {room.shower.type === "fiberglass-tub-shower" && (
                                            <>
                                              <div className="flex items-center gap-2 pb-1">
                                                <Switch
                                                  checked={room.shower.detachAndReset}
                                                  onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, detachAndReset: checked } })}
                                                />
                                                <Label className="text-sm whitespace-nowrap">Detach and reset</Label>
                                              </div>
                                              <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">shower faucet</Label>
                                                <Select value={room.shower.showerFaucet} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { shower: { ...room.shower!, showerFaucet: value } }) }}>
                                                  <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                    <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                    <SelectItem value="replace">Replace</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </>
                                          )}

                                          {/* Tub With Tiled Surround fields */}
                                          {room.shower.type === "tub-tile-surround" && (
                                            <>
                                              <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Action for tub</Label>
                                                <Select value={room.shower.actionForTub} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { shower: { ...room.shower!, actionForTub: value } }) }}>
                                                  <SelectTrigger className="w-[120px] border-border/60 bg-secondary/50">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                    <SelectItem value="detach-tub">Detach tub</SelectItem>
                                                    <SelectItem value="replace-tub">Replace tub</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div className="flex items-center gap-2 pb-1">
                                                <Switch
                                                  checked={room.shower.jetted}
                                                  onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, jetted: checked } })}
                                                />
                                                <Label className="text-sm whitespace-nowrap">Jetted</Label>
                                              </div>
                                              <div className="flex items-center gap-2 pb-1">
                                                <Switch
                                                  checked={room.shower.jettedMotorReplace}
                                                  onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, jettedMotorReplace: checked } })}
                                                />
                                                <Label className="text-sm whitespace-nowrap">Jetted tub motor replace</Label>
                                              </div>
                                              <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Surround</Label>
                                                <Select value={room.shower.surround} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { shower: { ...room.shower!, surround: value } }) }}>
                                                  <SelectTrigger className="w-[120px] border-border/60 bg-secondary/50">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                    <SelectItem value="up-to-60sf">Up to 60 SF</SelectItem>
                                                    <SelectItem value="up-to-60sf-high">Up to 60 SF - High Grade</SelectItem>
                                                    <SelectItem value="60-75sf">60-75 SF</SelectItem>
                                                    <SelectItem value="60-75sf-high">60-75 SF - High Grade</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Tub Shower Faucet</Label>
                                                <Select value={room.shower.tubShowerFaucet} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { shower: { ...room.shower!, tubShowerFaucet: value } }) }}>
                                                  <SelectTrigger className="w-[120px] border-border/60 bg-secondary/50">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                    <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                    <SelectItem value="replace">Replace</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                        {/* FEMA Note - only when Replace tub is selected for Tub With Tiled Surround */}
                                        {room.shower.type === "tub-tile-surround" && room.shower.actionForTub === "replace-tub" && (
                                          <span className="text-xs text-orange-400">Note: If replacing tub please note fema requires photos of damage to warrant replacement</span>
                                        )}
                                        {/* Misc row for Tub With Tiled Surround */}
                                        {room.shower.type === "tub-tile-surround" && (
                                          <div className="space-y-2">
                                            <Label className="text-xs font-medium text-muted-foreground">Misc</Label>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                              <div className="flex items-center gap-2">
                                                <Switch
                                                  checked={room.shower.tileNiche}
                                                  onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, tileNiche: checked, tileNicheQty: checked ? room.shower!.tileNicheQty : "" } })}
                                                />
                                                <Label className="text-sm whitespace-nowrap">Tile Niche</Label>
                                              </div>
                                              {room.shower.tileNiche && (
                                                <Input
                                                  type="number"
                                                  min={1}
                                                  value={room.shower.tileNicheQty || ""}
                                                  onChange={(e) => updateRoom(room.id, { shower: { ...room.shower!, tileNicheQty: e.target.value } })}
                                                  className="w-[70px] border-border/60 bg-secondary/50"
                                                  placeholder="QTY"
                                                />
                                              )}
                                              <div className="flex items-center gap-2">
                                                <Switch
                                                  checked={room.shower.grabBar}
                                                  onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, grabBar: checked, grabBarQty: checked ? room.shower!.grabBarQty : "" } })}
                                                />
                                                <Label className="text-sm whitespace-nowrap">Grab Bar</Label>
                                              </div>
                                              {room.shower.grabBar && (
                                                <Input
                                                  type="number"
                                                  min={1}
                                                  value={room.shower.grabBarQty || ""}
                                                  onChange={(e) => updateRoom(room.id, { shower: { ...room.shower!, grabBarQty: e.target.value } })}
                                                  className="w-[70px] border-border/60 bg-secondary/50"
                                                  placeholder="QTY"
                                                />
                                              )}
                                              <div className="flex items-center gap-2">
                                                <Switch
                                                  checked={room.shower.tileSoapDish}
                                                  onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, tileSoapDish: checked } })}
                                                />
                                                <Label className="text-sm whitespace-nowrap">Tile Soap dish</Label>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Switch
                                                  checked={room.shower.tileFeatureStrip}
                                                  onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, tileFeatureStrip: checked } })}
                                                />
                                                <Label className="text-sm whitespace-nowrap">Tile Feature Strip</Label>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {room.shower.type !== "tub-tile-surround" && (
                                        <div className="flex flex-wrap items-end gap-x-3 gap-y-2">

                                          {/* Tub With Cultured Marble fields */}
                                          {room.shower.type === "tub-cultured-marble" && (
                                            <>
                                              <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Action for tub</Label>
                                                <Select value={room.shower.actionForTub} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { shower: { ...room.shower!, actionForTub: value } }) }}>
                                                  <SelectTrigger className="w-[120px] border-border/60 bg-secondary/50">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                    <SelectItem value="detach-tub">Detach tub</SelectItem>
                                                    <SelectItem value="replace-tub">Replace tub</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Tub Shower Faucet</Label>
                                                <Select value={room.shower.tubShowerFaucet} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { shower: { ...room.shower!, tubShowerFaucet: value } }) }}>
                                                  <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                    <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                    <SelectItem value="replace">Replace</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </>
                                          )}

                                          {/* Tiled Shower fields */}
                                          {room.shower.type === "tile-shower" && (
                                            <>
                                              <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Action Mortar Bed</Label>
                                                <div className="flex items-center gap-2 pt-1">
                                                  <Switch
                                                    checked={room.shower.mortarBedReplace}
                                                    onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, mortarBedReplace: checked } })}
                                                  />
                                                  <Label className="text-sm whitespace-nowrap">Replace</Label>
                                                </div>
                                              </div>
                                              <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Walls</Label>
                                                <Select value={room.shower.walls} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { shower: { ...room.shower!, walls: value } }) }}>
                                                  <SelectTrigger className="w-[180px] border-border/60 bg-secondary/50">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                    <SelectItem value="up-to-60sf">Up to 60 SF</SelectItem>
                                                    <SelectItem value="up-to-60sf-high">Up to 60 SF - High Grade</SelectItem>
                                                    <SelectItem value="61-100sf">61-100 SF</SelectItem>
                                                    <SelectItem value="61-100sf-high">61-100 SF - High Grade</SelectItem>
                                                    <SelectItem value="101-120sf">101-120 SF</SelectItem>
                                                    <SelectItem value="101-120sf-high">101-120 SF - High Grade</SelectItem>
                                                    <SelectItem value="121-150sf">121-150 SF</SelectItem>
                                                    <SelectItem value="121-150sf-high">121-150 SF - High Grade</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Shower Faucet</Label>
                                                <Select value={room.shower.showerFaucet} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { shower: { ...room.shower!, showerFaucet: value } }) }}>
                                                  <SelectTrigger className="w-[180px] border-border/60 bg-secondary/50">
                                                    <SelectValue placeholder="Select" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                    <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                    <SelectItem value="replace">Replace</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                        )}

                                        {/* Notes for different types */}
                                        {room.shower.type === "fiberglass-tub-shower" && (
                                          <p className="text-xs text-amber-500">Note: Includes the shower/tub unit and faucets</p>
                                        )}
                                        {room.shower.type === "tile-shower" && (
                                          <p className="text-xs text-amber-500">Note: includes cement board replacement</p>
                                        )}

                                        {/* Misc section - shown for non tub-tile-surround types (tub-tile-surround has its own Misc above) */}
                                        {room.shower.type && room.shower.type !== "__none__" && room.shower.type !== "tub-tile-surround" && (
                                          <div className="space-y-3">
                                            <div>
                                              <Label className="text-xs text-muted-foreground mb-2 block">Misc</Label>
                                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                                <div className="flex items-center gap-2">
                                                  <Switch
                                                    checked={room.shower.tileBench}
                                                    onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, tileBench: checked } })}
                                                  />
                                                  <Label className="text-sm">Tile Bench</Label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <Switch
                                                    checked={room.shower.tileNiche}
                                                    onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, tileNiche: checked } })}
                                                  />
                                                  <Label className="text-sm">Tile Niche</Label>
                                                  {room.shower.tileNiche && (
                                                    <Input
                                                      type="number"
                                                      min={1}
                                                      value={room.shower.tileNicheQty || ""}
                                                      onChange={(e) => updateRoom(room.id, { shower: { ...room.shower!, tileNicheQty: e.target.value } })}
                                                      className="w-[70px] border-border/60 bg-secondary/50"
                                                      placeholder="QTY"
                                                    />
                                                  )}
                                                </div>
                                                {room.shower.type === "tile-shower" && (
                                                  <div className="flex items-center gap-2">
                                                    <Switch
                                                      checked={room.shower.grabBar}
                                                      onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, grabBar: checked, grabBarQty: checked ? room.shower!.grabBarQty : "" } })}
                                                    />
                                                    <Label className="text-sm">Grab Bar</Label>
                                                    {room.shower.grabBar && (
                                                      <Input
                                                        type="number"
                                                        min={1}
                                                        value={room.shower.grabBarQty || ""}
                                                        onChange={(e) => updateRoom(room.id, { shower: { ...room.shower!, grabBarQty: e.target.value } })}
                                                        className="w-[70px] border-border/60 bg-secondary/50"
                                                        placeholder="QTY"
                                                      />
                                                    )}
                                                  </div>
                                                )}
                                                {room.shower.type !== "tile-shower" && (
                                                  <div className="flex items-center gap-2">
                                                    <Switch
                                                      checked={room.shower.towelBar}
                                                      onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, towelBar: checked } })}
                                                    />
                                                    <Label className="text-sm">Towel Bar</Label>
                                                  </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                  <Switch
                                                    checked={room.shower.tileSoapDish}
                                                    onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, tileSoapDish: checked } })}
                                                  />
                                                  <Label className="text-sm">Tile Soap dish</Label>
                                                  {room.shower.tileSoapDish && room.shower.type !== "tile-shower" && (
                                                    <Input
                                                      type="number"
                                                      min={1}
                                                      value={room.shower.tileSoapDishQty || ""}
                                                      onChange={(e) => updateRoom(room.id, { shower: { ...room.shower!, tileSoapDishQty: e.target.value } })}
                                                      className="w-[70px] border-border/60 bg-secondary/50"
                                                      placeholder="QTY"
                                                    />
                                                  )}
                                                </div>
                                                {room.shower.type === "tile-shower" && (
                                                  <div className="flex items-center gap-2">
                                                    <Switch
                                                      checked={room.shower.tileFeatureStrip}
                                                      onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, tileFeatureStrip: checked } })}
                                                    />
                                                    <Label className="text-sm">Tile Feature Strip</Label>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            {/* Glass door row - only for tile-shower */}
                                            {room.shower.type === "tile-shower" && (
                                              <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                                                <div className="flex items-center gap-2">
                                                  <Switch
                                                    checked={room.shower.glassDoor}
                                                    onCheckedChange={(checked) => updateRoom(room.id, { shower: { ...room.shower!, glassDoor: checked, glassDoorAction: checked ? room.shower!.glassDoorAction : "" } })}
                                                  />
                                                  <Label className="text-sm">Glass door</Label>
                                                </div>
                                                {room.shower.glassDoor && (
                                                  <div className="space-y-1">
                                                    <Label className="text-xs text-muted-foreground">Action for Glass door</Label>
                                                    <Select value={room.shower.glassDoorAction} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { shower: { ...room.shower!, glassDoorAction: value } }) }}>
                                                      <SelectTrigger className="w-[120px] border-border/60 bg-secondary/50">
                                                        <SelectValue placeholder="Select" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                        <SelectItem value="replace">Replace</SelectItem>
                                                        <SelectItem value="clean">Clean</SelectItem>
                                                      </SelectContent>
                                                    </Select>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        )}
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

                                  {/* Kitchen sections */}
                                  <div className="space-y-3 pl-2">
                                    {/* Cabinetry section */}
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-muted-foreground">Cabinetry</Label>
                                      <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                                        <div className="space-y-1">
                                          <Label className="text-xs text-muted-foreground">Size (LF)</Label>
                                          <Select value={room.cabinets.size} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { cabinets: { ...room.cabinets!, size: value } }) }}>
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
                                          <Select value={room.cabinets.grade} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { cabinets: { ...room.cabinets!, grade: value } }) }}>
                                            <SelectTrigger className="w-[110px] border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
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
                                          <Label className="text-xs whitespace-nowrap">Detach and reset</Label>
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-xs text-muted-foreground">Toe Kick (LF)</Label>
                                          <Select value={room.cabinets.toeKick.size} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { cabinets: { ...room.cabinets!, toeKick: { ...room.cabinets!.toeKick, size: value } } }) }}>
                                            <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Size" />
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
                                    </div>

                                    {/* Countertop section */}
                                    <div className="rounded-md border border-border/30 bg-secondary/20 p-3 space-y-2">
                                      <Label className="text-xs font-medium text-muted-foreground">Countertop</Label>
                                      <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                                        <div className="space-y-1">
                                          <Label className="text-xs text-muted-foreground">Type</Label>
                                          <Select value={room.countertop.type} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { countertop: { ...room.countertop!, type: value } }) }}>
                                            <SelectTrigger className="w-[130px] border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              <SelectItem value="cultured-marble">Cultured Marble</SelectItem>
                                              <SelectItem value="laminate">Laminate</SelectItem>
                                              <SelectItem value="tile">Tile</SelectItem>
                                              <SelectItem value="granite">Granite</SelectItem>
                                              <SelectItem value="marble">Marble</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-xs text-muted-foreground">Grade</Label>
                                          <Select value={room.countertop.grade} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { countertop: { ...room.countertop!, grade: value } }) }}>
                                            <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              <SelectItem value="base">Base</SelectItem>
                                              <SelectItem value="standard">Standard</SelectItem>
                                              <SelectItem value="premium">Premium</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-xs text-muted-foreground">
                                            Size ({room.countertop.type === "cultured-marble" || room.countertop.type === "laminate" ? "LF" : "SF"})
                                          </Label>
                                          <Select value={room.countertop.size} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { countertop: { ...room.countertop!, size: value } }) }}>
                                            <SelectTrigger className="w-[90px] border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                                                <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex items-center gap-2 pb-1">
                                          <Switch
                                            checked={room.countertop.detachAndReset}
                                            onCheckedChange={(checked) => updateRoom(room.id, { countertop: { ...room.countertop!, detachAndReset: checked } })}
                                          />
                                          <Label className="text-xs whitespace-nowrap">Detach and reset</Label>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Backsplash section */}
                                    <div className="rounded-md border border-border/30 bg-secondary/20 p-3 space-y-2">
                                      <Label className="text-xs font-medium text-muted-foreground">Backsplash</Label>
                                      <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                                        <div className="space-y-1">
                                          <Label className="text-xs text-muted-foreground">Type</Label>
                                          <Select value={room.cabinets.toeKick.backSplash} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { cabinets: { ...room.cabinets!, toeKick: { ...room.cabinets!.toeKick, backSplash: value } } }) }}>
                                            <SelectTrigger className="w-[120px] border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              <SelectItem value="tile">Tile</SelectItem>
                                              <SelectItem value="solid-surface">Solid surface</SelectItem>
                                              <SelectItem value="unattached">Unattached</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-xs text-muted-foreground">Grade</Label>
                                          <Select value={room.cabinets.toeKick.grade} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { cabinets: { ...room.cabinets!, toeKick: { ...room.cabinets!.toeKick, grade: value } } }) }}>
                                            <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              <SelectItem value="base">Base</SelectItem>
                                              <SelectItem value="standard">Standard</SelectItem>
                                              <SelectItem value="premium">Premium</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex items-center gap-2 pb-1">
                                          <Switch
                                            checked={room.cabinets.toeKick.glass}
                                            onCheckedChange={(checked) => updateRoom(room.id, { cabinets: { ...room.cabinets!, toeKick: { ...room.cabinets!.toeKick, glass: checked } } })}
                                          />
                                          <Label className="text-xs">Glass</Label>
                                        </div>
                                        <div className="flex items-center gap-2 pb-1">
                                          <Switch
                                            checked={room.cabinets.toeKick.diagonalInstallation}
                                            onCheckedChange={(checked) => updateRoom(room.id, { cabinets: { ...room.cabinets!, toeKick: { ...room.cabinets!.toeKick, diagonalInstallation: checked } } })}
                                          />
                                          <Label className="text-xs whitespace-nowrap">Diagonal installation</Label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Plumbing */}
                                  <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                    <Label className="font-medium">Plumbing</Label>
                                    {/* Row 1: Faucet toggles + Water supply line */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={room.plumbing.replaceFaucetSink}
                                          onCheckedChange={(checked) => updateRoom(room.id, { plumbing: { ...room.plumbing!, replaceFaucetSink: checked, drFaucetSink: checked ? false : room.plumbing!.drFaucetSink } })}
                                        />
                                        <Label className="text-sm whitespace-nowrap">Replace faucet/sink</Label>
                                      </div>
                                      <span className="text-muted-foreground text-sm">or</span>
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={room.plumbing.drFaucetSink}
                                          onCheckedChange={(checked) => updateRoom(room.id, { plumbing: { ...room.plumbing!, drFaucetSink: checked, replaceFaucetSink: checked ? false : room.plumbing!.replaceFaucetSink } })}
                                        />
                                        <Label className="text-sm whitespace-nowrap">D/R faucet/sink</Label>
                                      </div>
                                      {/* Vertical divider */}
                                      <div className="h-6 w-px bg-border/60" />
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={room.plumbing.waterSupplyLine.enabled}
                                          onCheckedChange={(checked) => updateRoom(room.id, { plumbing: { ...room.plumbing!, waterSupplyLine: { ...room.plumbing!.waterSupplyLine, enabled: checked } } })}
                                        />
                                        <Label className="text-sm whitespace-nowrap">Water supply line</Label>
                                        {room.plumbing.waterSupplyLine.enabled && (
                                          <Select value={room.plumbing.waterSupplyLine.qty} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { plumbing: { ...room.plumbing!, waterSupplyLine: { ...room.plumbing!.waterSupplyLine, qty: value } } }) }}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50 w-[80px]">
                                              <SelectValue placeholder="QTY" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                                <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        )}
                                      </div>
                                    </div>

                                    {/* Reverse Osmosis row */}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={room.plumbing.reverseOsmosis.enabled}
                                          onCheckedChange={(checked) => updateRoom(room.id, { plumbing: { ...room.plumbing!, reverseOsmosis: { ...room.plumbing!.reverseOsmosis, enabled: checked } } })}
                                        />
                                        <Label className="text-sm whitespace-nowrap">Reverse osmosis</Label>
                                      </div>
                                      {room.plumbing.reverseOsmosis.enabled && (
                                        <>
                                          <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Action</Label>
                                            <Select value={room.plumbing.reverseOsmosis.action} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { plumbing: { ...room.plumbing!, reverseOsmosis: { ...room.plumbing!.reverseOsmosis, action: value } } }) }}>
                                              <SelectTrigger className="border-border/60 bg-secondary/50 w-[140px]">
                                                <SelectValue placeholder="Select" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                                <SelectItem value="replace">Replace</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <Input
                                            placeholder="F9 Model/serial..."
                                            value={room.plumbing.reverseOsmosis.f9Note}
                                            onChange={(e) => updateRoom(room.id, { plumbing: { ...room.plumbing!, reverseOsmosis: { ...room.plumbing!.reverseOsmosis, f9Note: e.target.value } } })}
                                            className="border-border/60 bg-primary/20 w-[200px]"
                                          />
                                        </>
                                      )}
                                    </div>

                                    {/* Garbage Disposal row */}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={room.plumbing.garbageDisposal.enabled}
                                          onCheckedChange={(checked) => updateRoom(room.id, { plumbing: { ...room.plumbing!, garbageDisposal: { ...room.plumbing!.garbageDisposal, enabled: checked } } })}
                                        />
                                        <Label className="text-sm whitespace-nowrap">Garbage Disposal</Label>
                                      </div>
                                      {room.plumbing.garbageDisposal.enabled && (
                                        <>
                                          <Select value={room.plumbing.garbageDisposal.action} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { plumbing: { ...room.plumbing!, garbageDisposal: { ...room.plumbing!.garbageDisposal, action: value } } }) }}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50 w-[140px]">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              <SelectItem value="detach-reset">Detach and reset</SelectItem>
                                              <SelectItem value="replace">Replace</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <Input
                                            placeholder="F9 Model/serial..."
                                            value={room.plumbing.garbageDisposal.f9Note}
                                            onChange={(e) => updateRoom(room.id, { plumbing: { ...room.plumbing!, garbageDisposal: { ...room.plumbing!.garbageDisposal, f9Note: e.target.value } } })}
                                            className="border-border/60 bg-primary/20 w-[200px]"
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
                                            <div className="flex flex-wrap items-center gap-3">
                                              <Select value={room.appliances.refrigerator.type} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, type: value, size: "" } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[160px]">
                                                  <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="top-freezer">Top Freezer</SelectItem>
                                                  <SelectItem value="bottom-freezer">Bottom Freezer</SelectItem>
                                                  <SelectItem value="built-in">Built In</SelectItem>
                                                  <SelectItem value="compact">Compact (under counter)</SelectItem>
                                                  <SelectItem value="side-by-side">Side by side</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              {room.appliances.refrigerator.type && room.appliances.refrigerator.type !== "compact" && room.appliances.refrigerator.type !== "__none__" && (
                                                <Select value={room.appliances.refrigerator.size} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, size: value } } }) }}>
                                                  <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[100px]">
                                                    <SelectValue placeholder="Size" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                    {room.appliances.refrigerator.type === "top-freezer" && (
                                                      <>
                                                        <SelectItem value="14-18">14-18 cf</SelectItem>
                                                        <SelectItem value="18-22">18-22 cf</SelectItem>
                                                        <SelectItem value="22-24">22-24 cf</SelectItem>
                                                        <SelectItem value="24-26">24-26 cf</SelectItem>
                                                      </>
                                                    )}
                                                    {room.appliances.refrigerator.type === "bottom-freezer" && (
                                                      <>
                                                        <SelectItem value="18-22">18-22 cf</SelectItem>
                                                        <SelectItem value="22-25">22-25 cf</SelectItem>
                                                        <SelectItem value="25-30">25-30 cf</SelectItem>
                                                        <SelectItem value="25-26">25-26 cf</SelectItem>
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
                                                        <SelectItem value="12-22">12-22 cf</SelectItem>
                                                        <SelectItem value="22-25">22-25 cf</SelectItem>
                                                        <SelectItem value="25-30">25-30 cf</SelectItem>
                                                      </>
                                                    )}
                                                  </SelectContent>
                                                </Select>
                                              )}
                                              <Select value={room.appliances.refrigerator.grade} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, grade: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[120px]">
                                                  <SelectValue placeholder="Grade" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="base">Base</SelectItem>
                                                  <SelectItem value="standard">Standard</SelectItem>
                                                  <SelectItem value="high">High grade</SelectItem>
                                                  <SelectItem value="premium">Premium</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.refrigerator.action} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, action: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[140px]">
                                                  <SelectValue placeholder="Action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                                  <SelectItem value="replace">Replace</SelectItem>
                                                  <SelectItem value="service-call">Service Call</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Input
                                                placeholder="F9 Model/Serial..."
                                                value={room.appliances.refrigerator.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50 flex-1 min-w-[150px]"
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
                                            <div className="flex flex-wrap items-center gap-3">
                                              <Select value={room.appliances.dishwasher.grade} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, dishwasher: { ...room.appliances!.dishwasher, grade: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[120px]">
                                                  <SelectValue placeholder="Grade" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="standard">Standard</SelectItem>
                                                  <SelectItem value="high">High</SelectItem>
                                                  <SelectItem value="premium">Premium</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.dishwasher.action} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, dishwasher: { ...room.appliances!.dishwasher, action: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[140px]">
                                                  <SelectValue placeholder="Action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                                  <SelectItem value="replace">Replace</SelectItem>
                                                  <SelectItem value="service-call">Service Call</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Input
                                                placeholder="F9 Model/Serial..."
                                                value={room.appliances.dishwasher.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, dishwasher: { ...room.appliances!.dishwasher, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50 flex-1 min-w-[150px]"
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
                                            <div className="flex flex-wrap items-center gap-3">
                                              <Select value={room.appliances.range.type} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, type: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[100px]">
                                                  <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="gas">Gas</SelectItem>
                                                  <SelectItem value="electric">Electric</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.range.options} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, options: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[180px]">
                                                  <SelectValue placeholder="Options" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="freestanding">Freestanding</SelectItem>
                                                  <SelectItem value="slide-in">Slide In</SelectItem>
                                                  <SelectItem value="drop-in">Drop In</SelectItem>
                                                  <SelectItem value="freestanding-double">Freestanding - Double Oven</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.range.grade} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, grade: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[120px]">
                                                  <SelectValue placeholder="Grade" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="standard">Standard</SelectItem>
                                                  <SelectItem value="high">High</SelectItem>
                                                  <SelectItem value="premium">Premium</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.range.action} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, action: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[140px]">
                                                  <SelectValue placeholder="Action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                                  <SelectItem value="replace">Replace</SelectItem>
                                                  <SelectItem value="service-call">Service Call</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Input
                                                placeholder="F9 Model/Serial..."
                                                value={room.appliances.range.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50 flex-1 min-w-[150px]"
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
                                            <div className="flex flex-wrap items-center gap-3">
                                              <Select value={room.appliances.cooktop.type} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, cooktop: { ...room.appliances!.cooktop, type: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[100px]">
                                                  <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="gas">Gas</SelectItem>
                                                  <SelectItem value="electric">Electric</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.cooktop.grade} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, cooktop: { ...room.appliances!.cooktop, grade: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[120px]">
                                                  <SelectValue placeholder="Grade" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="standard">Standard</SelectItem>
                                                  <SelectItem value="high">High</SelectItem>
                                                  <SelectItem value="premium">Premium</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.cooktop.action} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, cooktop: { ...room.appliances!.cooktop, action: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[140px]">
                                                  <SelectValue placeholder="Action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                                  <SelectItem value="replace">Replace</SelectItem>
                                                  <SelectItem value="service-call">Service Call</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Input
                                                placeholder="F9 Model/Serial..."
                                                value={room.appliances.cooktop.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, cooktop: { ...room.appliances!.cooktop, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50 flex-1 min-w-[150px]"
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
                                            <div className="flex flex-wrap items-center gap-3">
                                              <Select value={room.appliances.waterHeater.type} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, type: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[100px]">
                                                  <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="gas">Gas</SelectItem>
                                                  <SelectItem value="electric">Electric</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.waterHeater.size} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, size: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[100px]">
                                                  <SelectValue placeholder="Size" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="20">20 gal</SelectItem>
                                                  <SelectItem value="30">30 gal</SelectItem>
                                                  <SelectItem value="40">40 gal</SelectItem>
                                                  <SelectItem value="50">50 gal</SelectItem>
                                                  <SelectItem value="60">60 gal</SelectItem>
                                                  <SelectItem value="75">75 gal</SelectItem>
                                                  <SelectItem value="80">80 gal</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.waterHeater.rating} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, rating: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[100px]">
                                                  <SelectValue placeholder="Rating" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="6">6 yr</SelectItem>
                                                  <SelectItem value="9">9 yr</SelectItem>
                                                  <SelectItem value="12">12 yr</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.waterHeater.action} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, action: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[140px]">
                                                  <SelectValue placeholder="Action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                                  <SelectItem value="replace">Replace</SelectItem>
                                                  <SelectItem value="service-call">Service Call</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Input
                                                placeholder="F9 Model/Serial..."
                                                value={room.appliances.waterHeater.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50 flex-1 min-w-[150px]"
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
                                            <div className="flex flex-wrap items-center gap-3">
                                              <Select value={room.appliances.wallOven.type} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, wallOven: { ...room.appliances!.wallOven, type: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[180px]">
                                                  <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="freestanding">Freestanding</SelectItem>
                                                  <SelectItem value="slide-in">Slide in</SelectItem>
                                                  <SelectItem value="drop-in">Drop in</SelectItem>
                                                  <SelectItem value="freestanding-double">Freestanding - double oven</SelectItem>
                                                  <SelectItem value="built-in">Built in</SelectItem>
                                                  <SelectItem value="built-in-double">Built in double oven</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.wallOven.grade} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, wallOven: { ...room.appliances!.wallOven, grade: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[120px]">
                                                  <SelectValue placeholder="Grade" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="standard">Standard</SelectItem>
                                                  <SelectItem value="high">High</SelectItem>
                                                  <SelectItem value="premium">Premium</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.wallOven.action} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, wallOven: { ...room.appliances!.wallOven, action: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[140px]">
                                                  <SelectValue placeholder="Action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                                  <SelectItem value="replace">Replace</SelectItem>
                                                  <SelectItem value="service-call">Service Call</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Input
                                                placeholder="F9 Model/Serial..."
                                                value={room.appliances.wallOven.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, wallOven: { ...room.appliances!.wallOven, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50 flex-1 min-w-[150px]"
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
                                            <div className="flex flex-wrap items-center gap-3">
                                              <Select value={room.appliances.airHandler.type} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, airHandler: { ...room.appliances!.airHandler, type: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[100px]">
                                                  <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="2-ton">2 ton</SelectItem>
                                                  <SelectItem value="3-ton">3 ton</SelectItem>
                                                  <SelectItem value="4-ton">4 ton</SelectItem>
                                                  <SelectItem value="5-ton">5 ton</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.airHandler.options} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, airHandler: { ...room.appliances!.airHandler, options: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[200px]">
                                                  <SelectValue placeholder="Options" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="with-heating-element">With heating element</SelectItem>
                                                  <SelectItem value="with-a-coil">With A coil</SelectItem>
                                                  <SelectItem value="with-heating-and-coil">With heating element and a Coil</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.airHandler.action} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, airHandler: { ...room.appliances!.airHandler, action: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[140px]">
                                                  <SelectValue placeholder="Action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                                  <SelectItem value="replace">Replace</SelectItem>
                                                  <SelectItem value="service-call">Service Call</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Input
                                                placeholder="F9 Model/Serial..."
                                                value={room.appliances.airHandler.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, airHandler: { ...room.appliances!.airHandler, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50 flex-1 min-w-[150px]"
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
                                            <div className="flex flex-wrap items-center gap-3">
                                              <Select value={room.appliances.boiler.type} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, type: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[120px]">
                                                  <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="natural-gas">Natural Gas</SelectItem>
                                                  <SelectItem value="electric">Electric</SelectItem>
                                                  <SelectItem value="oil-fired">Oil fired</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Select value={room.appliances.boiler.action} onValueChange={(__v) => { const value = nv(__v); updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, action: value } } }) }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[140px]">
                                                  <SelectValue placeholder="Action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                                  <SelectItem value="replace">Replace</SelectItem>
                                                  <SelectItem value="service-call">Service Call</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <div className="flex items-center gap-2">
                                                <Switch
                                                  checked={room.appliances.boiler.expansionTank}
                                                  onCheckedChange={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, expansionTank: checked } } })}
                                                />
                                                <Label className="text-sm whitespace-nowrap">Expansion Tank</Label>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Switch
                                                  checked={room.appliances.boiler.circulatorPump}
                                                  onCheckedChange={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, circulatorPump: checked } } })}
                                                />
                                                <Label className="text-sm whitespace-nowrap">Circulator pump</Label>
                                              </div>
                                              <Input
                                                placeholder="F9 Model/Serial..."
                                                value={room.appliances.boiler.f9Note}
                                                onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, f9Note: e.target.value } } })}
                                                className="border-border/60 bg-secondary/50 flex-1 min-w-[150px]"
                                              />
                                            </div>
                                          )}
                                        </div>
                                        
                                        {/* Complete Button */}
                                        <div className="flex justify-end pt-3 border-t border-border/40">
                                          <Button 
                                            type="button" 
                                            onClick={() => { handleSave(); }}
                                            className="gap-2"
                                          >
                                            <CheckCircle className="h-4 w-4" />
                                            Complete
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}

                              {/* Doors - Always last */}
                              <div className="space-y-3 rounded-lg border border-border/40 p-4">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={room.doorsEnabled}
                                    onCheckedChange={(checked) => { updateRoom(room.id, { doorsEnabled: checked }) }}
                                  />
                                  <Label className="font-medium">Doors ({room.doors.length})</Label>
                                  {room.doorsEnabled && (
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
                                  )}
                                </div>
                                {/* Interior Doors */}
                                {room.doorsEnabled && room.doors.filter(d => d.category === "interior").length > 0 && (
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Interior Doors</Label>
                                    {room.doors.map((door, idx) => door.category === "interior" && (
                                      <div key={door.id} className="rounded-lg bg-secondary/30 p-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                          <Select value={door.type} onValueChange={(__v) => {
                                            const value = __v === "__none__" ? "" : __v;
                                            const newDoors = [...room.doors]
                                            newDoors[idx] = { ...door, type: value, grade: "" }
                                            updateRoom(room.id, { doors: newDoors })
                                          }}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[140px]">
                                              <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              <SelectItem value="6-panel">6 Panel</SelectItem>
                                              <SelectItem value="8ft-wood">8ft Wood Door</SelectItem>
                                              <SelectItem value="french">French Door</SelectItem>
                                              <SelectItem value="louvered">Louvered Door</SelectItem>
                                              <SelectItem value="bifold">Bifold</SelectItem>
                                              <SelectItem value="bypass">Bypass</SelectItem>
                                              <SelectItem value="pocket">Pocket</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <Select value={door.grade} onValueChange={(__v) => {
                                            const value = __v === "__none__" ? "" : __v;
                                            const newDoors = [...room.doors]
                                            newDoors[idx] = { ...door, grade: value }
                                            updateRoom(room.id, { doors: newDoors })
                                          }}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[220px]">
                                              <SelectValue placeholder="Grade" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              {/* 6 Panel */}
                                              {door.type === "6-panel" && (
                                                <>
                                                  <SelectItem value="base">Base</SelectItem>
                                                  <SelectItem value="standard">Standard</SelectItem>
                                                  <SelectItem value="high">High</SelectItem>
                                                  <SelectItem value="premium">Premium</SelectItem>
                                                </>
                                              )}
                                              {/* 8ft Wood Door */}
                                              {door.type === "8ft-wood" && (
                                                <>
                                                  <SelectItem value="solid-adler-paneled">Solid Adler - Paneled</SelectItem>
                                                  <SelectItem value="colonist">Colonist</SelectItem>
                                                </>
                                              )}
                                              {/* French Door */}
                                              {door.type === "french" && (
                                                <>
                                                  <SelectItem value="single-prehung">Single - Pre Hung</SelectItem>
                                                  <SelectItem value="double-prehung">Double - Pre Hung</SelectItem>
                                                  <SelectItem value="8-single-prehung">8&apos; single - Pre Hung</SelectItem>
                                                  <SelectItem value="8-double-prehung">8&apos; double - Pre Hung</SelectItem>
                                                </>
                                              )}
                                              {/* Louvered Door */}
                                              {door.type === "louvered" && (
                                                <>
                                                  <SelectItem value="single-half-louvered">Single - Half Louvered</SelectItem>
                                                  <SelectItem value="single-full-louvered">Single - Full Louvered</SelectItem>
                                                  <SelectItem value="double-half-louvered">Double - Half Louvered</SelectItem>
                                                  <SelectItem value="double-full-louvered">Double - Full Louvered</SelectItem>
                                                </>
                                              )}
                                              {/* Bifold */}
                                              {door.type === "bifold" && (
                                                <>
                                                  <SelectItem value="colonist-double">Colonist - Double</SelectItem>
                                                  <SelectItem value="colonist-single">Colonist - Single</SelectItem>
                                                  <SelectItem value="solid-core">Solid core</SelectItem>
                                                  <SelectItem value="double-half-louvered">Double Half Louvered</SelectItem>
                                                  <SelectItem value="solid-core-single-half-louvered">Solid Core - Single Half Louvered</SelectItem>
                                                  <SelectItem value="full-louvered-double">Full Louvered - Double</SelectItem>
                                                  <SelectItem value="full-louvered-single">Full Louvered - Single</SelectItem>
                                                  <SelectItem value="mirrored-single">Mirrored - Single</SelectItem>
                                                  <SelectItem value="mirrored-double">Mirrored - Double</SelectItem>
                                                </>
                                              )}
                                              {/* Bypass */}
                                              {door.type === "bypass" && (
                                                <>
                                                  <SelectItem value="colonist">Colonist</SelectItem>
                                                  <SelectItem value="lauan-mahogany">Lauan/Mahogany</SelectItem>
                                                  <SelectItem value="birch">Birch</SelectItem>
                                                  <SelectItem value="panel">Panel</SelectItem>
                                                  <SelectItem value="mirrored-door-set">Mirrored Door Set</SelectItem>
                                                  <SelectItem value="mirrored-door-set-high">Mirrored Door Set - High Grade</SelectItem>
                                                </>
                                              )}
                                              {/* Pocket */}
                                              {door.type === "pocket" && (
                                                <>
                                                  <SelectItem value="colonist">Colonist</SelectItem>
                                                  <SelectItem value="lauan-mahogany">Lauan / Mahogany</SelectItem>
                                                  <SelectItem value="birch">Birch</SelectItem>
                                                  <SelectItem value="panel">Panel</SelectItem>
                                                </>
                                              )}
                                            </SelectContent>
                                          </Select>
                                          <Select value={door.finish} onValueChange={(__v) => {
                                            const value = __v === "__none__" ? "" : __v;
                                            const newDoors = [...room.doors]
                                            newDoors[idx] = { ...door, finish: value }
                                            updateRoom(room.id, { doors: newDoors })
                                          }}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[100px]">
                                              <SelectValue placeholder="Finish" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              <SelectItem value="paint">Paint</SelectItem>
                                              <SelectItem value="stain">Stain</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <Select value={door.handleAction} onValueChange={(__v) => {
                                            const value = __v === "__none__" ? "" : __v;
                                            const newDoors = [...room.doors]
                                            newDoors[idx] = { ...door, handleAction: value }
                                            updateRoom(room.id, { doors: newDoors })
                                          }}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[120px]">
                                              <SelectValue placeholder="Handle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              <SelectItem value="replace">Replace</SelectItem>
                                              <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <div className="flex items-center gap-2">
                                            <Switch
                                              checked={door.nonCased}
                                              onCheckedChange={(checked) => {
                                                const newDoors = [...room.doors]
                                                newDoors[idx] = { ...door, nonCased: checked }
                                                updateRoom(room.id, { doors: newDoors })
                                              }}
                                            />
                                            <Label className="text-sm whitespace-nowrap">Non-Cased</Label>
                                          </div>
                                          <div className="flex-1"></div>
                                          <div className="flex items-center gap-1">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-9 w-9 text-muted-foreground hover:text-primary"
                                              onClick={() => {
                                                const newDoor = { ...door, id: Date.now() }
                                                updateRoom(room.id, { doors: [...room.doors, newDoor] })
                                              }}
                                            >
                                              <Copy className="h-4 w-4" />
                                            </Button>
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
                                      </div>
                                    ))}
                                    <p className="text-xs text-muted-foreground mt-2">Note: All doors include a standard casing unless marked non-cased</p>
                                  </div>
                                )}
                                {/* Exterior Doors */}
                                {room.doorsEnabled && room.doors.filter(d => d.category === "exterior").length > 0 && (
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Exterior Doors</Label>
                                    {room.doors.map((door, idx) => door.category === "exterior" && (
                                      <div key={door.id} className="space-y-3 rounded-lg bg-secondary/30 p-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                          <Select value={door.type} onValueChange={(__v) => {
                                            const value = __v === "__none__" ? "" : __v;
                                            const newDoors = [...room.doors]
                                            newDoors[idx] = { ...door, type: value, grade: "", size: "" }
                                            updateRoom(room.id, { doors: newDoors })
                                          }}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[140px]">
                                              <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              <SelectItem value="solid-wood">Solid Wood</SelectItem>
                                              <SelectItem value="french">French</SelectItem>
                                              <SelectItem value="metal">Metal</SelectItem>
                                              <SelectItem value="overhead">Overhead Door</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          {/* Size field for Overhead Door only */}
                                          {door.type === "overhead" && (
                                            <Select value={door.size} onValueChange={(__v) => {
                                              const value = __v === "__none__" ? "" : __v;
                                              const newDoors = [...room.doors]
                                              newDoors[idx] = { ...door, size: value }
                                              updateRoom(room.id, { doors: newDoors })
                                            }}>
                                              <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[100px]">
                                                <SelectValue placeholder="Size" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="10x7">10x7</SelectItem>
                                                <SelectItem value="10x8">10x8</SelectItem>
                                                <SelectItem value="10x9">10x9</SelectItem>
                                                <SelectItem value="10x10">10x10</SelectItem>
                                                <SelectItem value="10x11">10x11</SelectItem>
                                                <SelectItem value="10x12">10x12</SelectItem>
                                                <SelectItem value="12x7">12x7</SelectItem>
                                                <SelectItem value="12x8">12x8</SelectItem>
                                                <SelectItem value="16x7">16x7</SelectItem>
                                                <SelectItem value="16x8">16x8</SelectItem>
                                                <SelectItem value="18x7">18x7</SelectItem>
                                                <SelectItem value="18x8">18x8</SelectItem>
                                                <SelectItem value="8x10">8x10</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          )}
                                          <Select value={door.grade} onValueChange={(__v) => {
                                            const value = __v === "__none__" ? "" : __v;
                                            const newDoors = [...room.doors]
                                            newDoors[idx] = { ...door, grade: value }
                                            updateRoom(room.id, { doors: newDoors })
                                          }}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[220px]">
                                              <SelectValue placeholder="Grade" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              {/* Solid Wood */}
                                              {door.type === "solid-wood" && (
                                                <>
                                                  <SelectItem value="paneled">Paneled</SelectItem>
                                                  <SelectItem value="paneled-radial-top">Paneled Radial Top</SelectItem>
                                                  <SelectItem value="paneled-8ft">Paneled 8ft</SelectItem>
                                                  <SelectItem value="double-paneled">Double Door - Paneled</SelectItem>
                                                  <SelectItem value="double-paneled-radial">Double Door Paneled - Radial Top</SelectItem>
                                                  <SelectItem value="double-8ft-paneled">Double Door 8ft - Paneled</SelectItem>
                                                  <SelectItem value="deluxe-wood-detail">Deluxe Grade - Wood w/Detail</SelectItem>
                                                </>
                                              )}
                                              {/* French */}
                                              {door.type === "french" && (
                                                <>
                                                  <SelectItem value="single">Single</SelectItem>
                                                  <SelectItem value="double-door">Double Door</SelectItem>
                                                  <SelectItem value="double-metal">Double Metal Door</SelectItem>
                                                  <SelectItem value="single-8-metal">Single 8&apos; Metal</SelectItem>
                                                </>
                                              )}
                                              {/* Metal */}
                                              {door.type === "metal" && (
                                                <>
                                                  <SelectItem value="metal-flush-panel">Metal Flush Panel</SelectItem>
                                                  <SelectItem value="metal-flush-high">Metal Flush Panel - High Grade</SelectItem>
                                                  <SelectItem value="metal-flush-8ft">Metal Flush Panel - 8&apos;</SelectItem>
                                                  <SelectItem value="fiberglass-premium">Fiberglass - Premium Grade</SelectItem>
                                                  <SelectItem value="double-metal-flush">Double Metal Flush Panel</SelectItem>
                                                </>
                                              )}
                                              {/* Overhead Door */}
                                              {door.type === "overhead" && (
                                                <>
                                                  <SelectItem value="base">Base</SelectItem>
                                                  <SelectItem value="high">High Grade</SelectItem>
                                                  <SelectItem value="premium">Premium</SelectItem>
                                                </>
                                              )}
                                            </SelectContent>
                                          </Select>
                                          {/* Finish/Action field - changes based on door type */}
                                          <Select value={door.finish} onValueChange={(__v) => {
                                            const value = __v === "__none__" ? "" : __v;
                                            const newDoors = [...room.doors]
                                            newDoors[idx] = { ...door, finish: value }
                                            updateRoom(room.id, { doors: newDoors })
                                          }}>
                                            <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[120px]">
                                              <SelectValue placeholder={door.type === "overhead" ? "Action" : "Finish"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                              {door.type === "overhead" ? (
                                                <>
                                                  <SelectItem value="replace">Replace</SelectItem>
                                                  <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                                  <SelectItem value="clean">Clean</SelectItem>
                                                </>
                                              ) : (
                                                <>
                                                  <SelectItem value="paint">Paint</SelectItem>
                                                  <SelectItem value="stain">Stain</SelectItem>
                                                </>
                                              )}
                                            </SelectContent>
                                          </Select>
                                          {/* Handle field - only for non-overhead doors */}
                                          {door.type !== "overhead" && (
                                            <Select value={door.handleAction} onValueChange={(__v) => {
                                              const value = __v === "__none__" ? "" : __v;
                                              const newDoors = [...room.doors]
                                              newDoors[idx] = { ...door, handleAction: value }
                                              updateRoom(room.id, { doors: newDoors })
                                            }}>
                                              <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[120px]">
                                                <SelectValue placeholder="Handle" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="replace">Replace</SelectItem>
                                                <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          )}
                                          {/* Misc field - only for non-overhead doors */}
                                          {door.type !== "overhead" && (
                                            <Select value={door.misc} onValueChange={(__v) => {
                                              const value = __v === "__none__" ? "" : __v;
                                              const newDoors = [...room.doors]
                                              newDoors[idx] = { ...door, misc: value }
                                              updateRoom(room.id, { doors: newDoors })
                                            }}>
                                              <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[110px]">
                                                <SelectValue placeholder="Misc" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                <SelectItem value="peep-hole">Peep Hole</SelectItem>
                                                <SelectItem value="mail-slot">Mail Slot</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          )}
                                          <div className="flex-1"></div>
                                          <div className="flex items-center gap-1">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-9 w-9 text-muted-foreground hover:text-primary"
                                              onClick={() => {
                                                const newDoor = { ...door, id: Date.now() }
                                                updateRoom(room.id, { doors: [...room.doors, newDoor] })
                                              }}
                                            >
                                              <Copy className="h-4 w-4" />
                                            </Button>
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
                                        {/* Sidelites/Panel Replacement row */}
                                        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/20">
                                          <div className="flex items-center gap-2">
                                            <Switch
                                              checked={door.sidelites}
                                              onCheckedChange={(checked) => {
                                                const newDoors = [...room.doors]
                                                newDoors[idx] = { ...door, sidelites: checked, sidelitesQty: checked ? door.sidelitesQty : "", panelSize: "", panelGrade: "" }
                                                updateRoom(room.id, { doors: newDoors })
                                              }}
                                            />
                                            <Label className="text-sm whitespace-nowrap">{door.type === "overhead" ? "Panel Replacement" : "Sidelites"}</Label>
                                          </div>
                                          {door.sidelites && (
                                            <>
                                              <Select value={door.sidelitesQty} onValueChange={(__v) => {
                                                const value = __v === "__none__" ? "" : __v;
                                                const newDoors = [...room.doors]
                                                newDoors[idx] = { ...door, sidelitesQty: value }
                                                updateRoom(room.id, { doors: newDoors })
                                              }}>
                                                <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[80px]">
                                                  <SelectValue placeholder="QTY" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                                    <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                              {/* Additional Size and Grade fields for Overhead Panel Replacement */}
                                              {door.type === "overhead" && (
                                                <>
                                                  <Select value={door.panelSize} onValueChange={(__v) => {
                                                    const value = __v === "__none__" ? "" : __v;
                                                    const newDoors = [...room.doors]
                                                    newDoors[idx] = { ...door, panelSize: value }
                                                    updateRoom(room.id, { doors: newDoors })
                                                  }}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[110px]">
                                                      <SelectValue placeholder="Size" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                      <SelectItem value="up-to-12">Up to 12&apos;</SelectItem>
                                                      <SelectItem value="13-to-18">13 to 18&apos;</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                  <Select value={door.panelGrade} onValueChange={(__v) => {
                                                    const value = __v === "__none__" ? "" : __v;
                                                    const newDoors = [...room.doors]
                                                    newDoors[idx] = { ...door, panelGrade: value }
                                                    updateRoom(room.id, { doors: newDoors })
                                                  }}>
                                                    <SelectTrigger className="border-border/60 bg-secondary/50 text-sm w-[130px]">
                                                      <SelectValue placeholder="Grade" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                                                      <SelectItem value="base">Base</SelectItem>
                                                      <SelectItem value="high">High Grade</SelectItem>
                                                      <SelectItem value="premium">Premium Grade</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </>
                                              )}
                                            </>
                                          )}
                                          {/* Stormdoor Assembly and Retrofit in Stucco - only for non-overhead doors */}
                                          {door.type !== "overhead" && (
                                            <>
                                              <div className="flex items-center gap-2">
                                                <Switch
                                                  checked={door.stormdoorAssembly}
                                                  onCheckedChange={(checked) => {
                                                    const newDoors = [...room.doors]
                                                    newDoors[idx] = { ...door, stormdoorAssembly: checked }
                                                    updateRoom(room.id, { doors: newDoors })
                                                  }}
                                                />
                                                <Label className="text-sm whitespace-nowrap">Stormdoor Assembly</Label>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Switch
                                                  checked={door.retrofitInStucco}
                                                  onCheckedChange={(checked) => {
                                                    const newDoors = [...room.doors]
                                                    newDoors[idx] = { ...door, retrofitInStucco: checked }
                                                    updateRoom(room.id, { doors: newDoors })
                                                  }}
                                                />
                                                <Label className="text-sm whitespace-nowrap">Retrofit in Stucco</Label>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
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
