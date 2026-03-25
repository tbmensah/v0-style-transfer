import type {
  Room,
  ExteriorState,
  FoundationState,
  ProjectDetails,
  VanityOptions,
  ToiletOptions,
  ShowerOptions,
  CabinetOptions,
  CountertopOptions,
  PlumbingOptions,
  ApplianceOptions,
} from "./types"

export const defaultRoom: Omit<Room, "id" | "name"> = {
  type: "room",
  sqft: "",
  nfipCleaning: {
    enabled: false,
    wall: { height: "", wallType: "", ceilingAffected: false },
    floor: { type: "", areaOnCrawlspace: false },
  },
  flooring: {
    enabled: false,
    multipleLayers: false,
    layers: [{ id: Date.now(), type: "", grade: "", application: "", action: "" }],
    vaporBarrier: false,
    subfloorReplacement: false,
    f9Note: "",
  },
  trim: {
    enabled: false,
    baseboardHeight: "",
    material: "",
    finish: "",
    cap: false,
    shoe: false,
    shoeFinish: "",
  },
  wallCovering: {
    enabled: false,
    type: "",
    replacementCalc: "",
    replacementHeight: "",
    texture: false,
    textureType: "",
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
    bathroomLightBarQty: 0,
  },
  windows: [],
  doors: [],
}

export const defaultBathroomExtras: {
  vanity: VanityOptions
  toilet: ToiletOptions
  shower: ShowerOptions
} = {
  vanity: { enabled: false, linearFeet: 0, countertop: "", backsplash: false },
  toilet: { enabled: false, action: "", seatReplacement: false },
  shower: { enabled: false, type: "", size: "", glassDoor: false, tileNiche: false },
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
    toeKick: { size: "", backSplash: "", grade: "", glass: false, diagonalInstallation: false },
  },
  countertop: { enabled: false, type: "", grade: "", size: "", detachAndReset: false },
  plumbing: {
    replaceFaucetSink: false,
    drFaucetSink: false,
    waterSupplyLine: { enabled: false, qty: "" },
    reverseOsmosis: { enabled: false, action: "", f9Note: "" },
    garbageDisposal: { enabled: false, action: "", f9Note: "" },
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

export const defaultExteriorState: ExteriorState = {
  pressureWash: { enabled: false, perimeterFeet: "", regularPwash: false, cleanWithSteam: false },
  dumpster: { enabled: false, count: "", size: "" },
  hvac: {
    condenserUnits: [],
    packageUnits: [],
    miniSplits: [],
  },
  electrical: {
    exteriorOutlets: "",
    disconnect30Amp: "",
    breakerPanel: { enabled: false, amps: "", arcFaults: false },
    meterBox: false,
  },
  finishes: [],
}

export const defaultFoundationState: FoundationState = {
  crawlspace: {
    enabled: false,
    preFirm: false,
    acControlledSpace: false,
    heavyCleanArea: false,
    perimeterFeet: "",
    piersType: "",
    piersCount: "",
    cleanJoist: false,
    bellyPaper: false,
    floorInsulation: false,
    floorInsulationType: "",
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
  sumpPump: { enabled: false, minorAdjustment: "", action: "", hp: "" },
  hvac: {
    airHandlers: [],
  },
  basement: {
    enabled: false,
    wallCleanPf: "",
    muck: false,
    muckHeavy: false,
    drywallEnabled: false,
    drywallMeasureType: "sf",
    drywallValue: "",
    stairCleaning: false,
    stairCount: "",
    totalStairsSubmerged: "",
    foundationDoor: false,
    foundationDoorAction: "",
    foundationWindows: [],
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
}

export const defaultProjectDetails: ProjectDetails = {
  projectName: "",
  claimNumber: "",
  inspectionDate: "",
  propertyAddress: "",
  propertyType: "",
  preFirm: false,
  adjusterName: "",
  notes: "",
}
