// Express Estimate Types

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

export interface FloorLayer {
  id: number
  type: string
  grade: string
  application: string
  action: string
  vaporBarrier: boolean
  subfloorReplacement: boolean
}

export interface FlooringOptions {
  enabled: boolean
  multipleLayers: boolean
  layers: FloorLayer[]
  vaporBarrier: boolean
  subfloorReplacement: boolean
  f9Note: string
}

export interface TrimOptions {
  enabled: boolean
  baseboardHeight: string
  material: string
  finish: string
  cap: boolean
  shoe: boolean
  shoeFinish: string
  subtractCabinetry: boolean
}

export interface WallCoveringOptions {
  enabled: boolean
  material: string
  type: string
  replacementHeight: string
  texture: boolean
  textureType: string
}

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

export interface WindowItem {
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

export interface VanityOptions {
  enabled: boolean
  size: string
  grade: string
  detachAndReset: boolean
  countertop: {
    type: string
    grade: string
    size: string
    detachAndReset: boolean
  }
  backsplashUnattached: boolean
}

export interface ToiletOptions {
  enabled: boolean
  action: string
  seatReplacement: boolean
  supplyLine: boolean
}

export interface ShowerOptions {
  enabled: boolean
  type: string
  // Fiberglass Tub/Shower Unit fields
  detachAndReset: boolean
  showerFaucet: string
  // Tub with Tile Surround fields
  actionForTub: string
  surround: string
  tubShowerFaucet: string
  // Tile Shower fields
  mortarBedReplace: boolean
  mortarBedSize: string
  walls: string
  // Tile Shower Misc
  tileBench: boolean
  tileNiche: boolean
  tileNicheQty: string
  towelBar: boolean
  tileSoapDish: boolean
  tileSoapDishQty: string
}

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
  windowsEnabled: boolean
  windows: WindowItem[]
  doorsEnabled: boolean
  doors: DoorItem[]
  // Bathroom specific
  vanity?: VanityOptions
  toilet?: ToiletOptions
  shower?: ShowerOptions
  // Kitchen specific
  kitchenEnabled?: boolean
  cabinets?: CabinetOptions
  countertop?: CountertopOptions
  plumbing?: PlumbingOptions
  appliances?: ApplianceOptions
}
