import type {
  Room,
  FloorLayer,
  WindowItem,
  DoorItem,
  VanityOptions,
  ToiletOptions,
  ShowerOptions,
  CabinetOptions,
  CountertopOptions,
  PlumbingOptions,
  ApplianceOptions,
} from "./types"

// Default values for creating new rooms
export const defaultRoom: Omit<Room, "id" | "name"> = {
  type: "room",
  sqft: "",
  nfipCleaning: {
    enabled: false,
    wall: { height: "", wallType: "", ceilingAffected: false },
    floor: { type: "", areaOnCrawlspace: false }
  },
  flooring: {
    enabled: false,
    multipleLayers: false,
    layers: [{ id: Date.now(), type: "", grade: "", application: "", action: "", vaporBarrier: false, subfloorReplacement: false }],
    vaporBarrier: false,
    subfloorReplacement: false,
    f9Note: ""
  },
  trim: {
    enabled: false,
    baseboardHeight: "",
    material: "",
    finish: "",
    cap: false,
    shoe: false,
    shoeFinish: "",
    subtractCabinetry: false
  },
  wallCovering: {
    enabled: false,
    material: "",
    type: "",
    replacementHeight: "",
    texture: false,
    textureType: ""
  },
  electrical: {
    enabled: false,
    outlets110: 0,
    outlets220: 0,
    gfiOutlets: 0,
    lightSwitches: 0,
    ceilingLights: 0,
    ceilingFans: 0,
    bathroomLightBar: "",
    bathroomLightBarQty: 0
  },
  windows: [],
  doors: [],
}

export const defaultBathroomExtras: {
  vanity: VanityOptions
  toilet: ToiletOptions
  shower: ShowerOptions
} = {
  vanity: {
    enabled: false,
    size: "",
    grade: "",
    detachAndReset: false,
    countertop: { type: "", grade: "", size: "", detachAndReset: false },
    backsplashUnattached: false
  },
  toilet: {
    enabled: false,
    action: "",
    seatReplacement: false,
    supplyLine: false
  },
  shower: {
    enabled: false,
    type: "",
    detachAndReset: false,
    showerFaucet: "",
    actionForTub: "",
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
    tileSoapDishQty: ""
  },
}

export const defaultKitchenExtras: {
  cabinets: CabinetOptions
  countertop: CountertopOptions
  plumbing: PlumbingOptions
  appliances: ApplianceOptions
} = {
  cabinets: {
    enabled: false,
    size: "",
    grade: "",
    detachAndReset: false,
    toeKick: { size: "", backSplash: "", grade: "", glass: false, diagonalInstallation: false }
  },
  countertop: {
    enabled: false,
    type: "",
    grade: "",
    size: "",
    detachAndReset: false
  },
  plumbing: {
    replaceFaucetSink: false,
    drFaucetSink: false,
    waterSupplyLine: { enabled: false, qty: "" },
    reverseOsmosis: { enabled: false, action: "", f9Note: "" },
    garbageDisposal: { enabled: false, action: "", f9Note: "" }
  },
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

// Helper to create a new floor layer
export const createFloorLayer = (): FloorLayer => ({
  id: Date.now(),
  type: "",
  grade: "",
  application: "",
  action: "",
  vaporBarrier: false,
  subfloorReplacement: false,
})

// Helper to create a new window
export const createWindow = (): WindowItem => ({
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
})

// Helper to create a new door
export const createDoor = (category: "interior" | "exterior"): DoorItem => ({
  id: Date.now(),
  category,
  type: "",
  grade: "",
  finish: "",
  handleAction: "",
  peepHole: false,
  mailSlot: false,
})
