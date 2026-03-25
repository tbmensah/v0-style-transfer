// NFIP Cleaning
export interface NFIPCleaningOptions {
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

// Flooring
export interface FloorLayer {
  id: number
  type: string
  grade: string
  application: string
  action: string
}

export interface FlooringOptions {
  enabled: boolean
  multipleLayers: boolean
  layers: FloorLayer[]
  vaporBarrier: boolean
  subfloorReplacement: boolean
  f9Note: string
}

// Trim
export interface TrimOptions {
  enabled: boolean
  baseboardHeight: string
  material: string
  finish: string
  cap: boolean
  shoe: boolean
  shoeFinish: string
}

// Wall Covering
export interface WallCoveringOptions {
  enabled: boolean
  type: string
  replacementCalc: string
  replacementHeight: string
  texture: boolean
  textureType: string
}

// Electrical
export interface ElectricalOptions {
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

// Windows
export interface WindowItem {
  id: number
  type: string
  size: string
  grade: string
  casing: string
  marbleSill: boolean
}

// Doors
export interface DoorItem {
  id: number
  category: "interior" | "exterior"
  type: string
  grade: string
  finish: string
  handleAction: string
  peepHole: boolean
  mailSlot: boolean
}

// Bathroom Options
export interface VanityOptions {
  enabled: boolean
  linearFeet: number
  countertop: string
  backsplash: boolean
}

export interface ToiletOptions {
  enabled: boolean
  action: string
  seatReplacement: boolean
}

export interface ShowerOptions {
  enabled: boolean
  type: string
  size: string
  glassDoor: boolean
  tileNiche: boolean
}

// Kitchen Options
export interface CabinetOptions {
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

export interface CountertopOptions {
  enabled: boolean
  type: string
  grade: string
  size: string
  detachAndReset: boolean
}

export interface PlumbingOptions {
  replaceFaucetSink: boolean
  drFaucetSink: boolean
  waterSupplyLine: { enabled: boolean; qty: string }
  reverseOsmosis: { enabled: boolean; action: string; f9Note: string }
  garbageDisposal: { enabled: boolean; action: string; f9Note: string }
}

export interface ApplianceOptions {
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

// Room
export interface Room {
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

// Exterior Types
export interface CondenserUnit {
  id: number
  tonnage: string
  seer: string
  replace: boolean
  serviceCall: boolean
  f9Note: string
}

export interface PackageUnit {
  id: number
  unitType: string
  tonnage: string
  seer: string
  replace: boolean
  serviceCall: boolean
  f9Note: string
}

export interface MiniSplit {
  id: number
  zones: string
  highEfficiency: boolean
  replace: boolean
  serviceCall: boolean
  f9Note: string
}

export interface ExteriorFinish {
  id: number
  type: string
  measureType: "pf" | "sf" | "lf"
  value: string
}

export interface ExteriorState {
  pressureWash: { enabled: boolean; perimeterFeet: string; regularPwash: boolean; cleanWithSteam: boolean }
  dumpster: { enabled: boolean; count: string; size: string }
  hvac: {
    condenserUnits: CondenserUnit[]
    packageUnits: PackageUnit[]
    miniSplits: MiniSplit[]
  }
  electrical: {
    exteriorOutlets: string
    disconnect30Amp: string
    breakerPanel: { enabled: boolean; amps: string; arcFaults: boolean }
    meterBox: boolean
  }
  finishes: ExteriorFinish[]
}

// Foundation Types
export interface AirHandler {
  id: number
  type: string
  tonnage: string
  heatElementCount: string
  action: string
  f9Note: string
}

export interface FoundationWindow {
  id: number
  type: string
  size: string
  quantity: string
  material: string
}

export interface FoundationState {
  crawlspace: {
    enabled: boolean
    preFirm: boolean
    acControlledSpace: boolean
    heavyCleanArea: boolean
    perimeterFeet: string
    piersType: "" | "short" | "tall"
    piersCount: string
    cleanJoist: boolean
    bellyPaper: boolean
    floorInsulation: boolean
    floorInsulationType: string
    muck: boolean
    muckHeavy: boolean
    standingWater: boolean
    houseRewire: string
  }
  enclosureRemoval: {
    sandRemoval: { enabled: boolean; cubicFeet: string; length: string; width: string; depth: string }
    backfill: { enabled: boolean; cubicFeet: string; length: string; width: string; depth: string }
    confinedSpace: boolean
  }
  sumpPump: { enabled: boolean; minorAdjustment: string; action: string; hp: string }
  hvac: {
    airHandlers: AirHandler[]
  }
  basement: {
    enabled: boolean
    wallCleanPf: string
    muck: boolean
    muckHeavy: boolean
    drywallEnabled: boolean
    drywallMeasureType: "sf" | "lf"
    drywallValue: string
    stairCleaning: boolean
    stairCount: string
    totalStairsSubmerged: string
    foundationDoor: boolean
    foundationDoorAction: string
    foundationWindows: FoundationWindow[]
  }
  electrical: {
    outlets110: string
    outlets220: string
    gfiOutlets: string
    lightSwitch: string
    junctionBox: string
    breakerPanel: { enabled: boolean; amps: string; arcFaults: boolean }
    meterBox: boolean
  }
}

// Project Details
export interface ProjectDetails {
  projectName: string
  claimNumber: string
  inspectionDate: string
  propertyAddress: string
  propertyType: string
  preFirm: boolean
  adjusterName: string
  notes: string
}
