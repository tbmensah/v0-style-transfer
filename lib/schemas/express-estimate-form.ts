/**
 * Zod schemas for Express Estimate (`job_type: ee`) wizard.
 * Mirrors interfaces + top-level state in `app/(dashboard)/express-estimate/new/page.tsx`.
 * `projectDetails.projectName` and `projectDetails.claimNumber` are required (UI *). Other wizard
 * fields stay deep-partial; backend may enforce additional rules on submit.
 */
import { z } from "zod"

const str = z.string()
const bool = z.boolean()
const num = z.number()

/** Every key optional at every depth; arrays optional and elements deep-partial. */
function deepPartialSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema instanceof z.ZodObject) {
    const shape: z.ZodRawShape = {}
    for (const [key, val] of Object.entries(schema.shape)) {
      shape[key] = deepPartialSchema(val as z.ZodTypeAny).optional()
    }
    return z.object(shape)
  }
  if (schema instanceof z.ZodArray) {
    return z.array(deepPartialSchema(schema.element)).optional()
  }
  if (schema instanceof z.ZodOptional) {
    return deepPartialSchema(schema.unwrap()).optional()
  }
  if (schema instanceof z.ZodNullable) {
    return deepPartialSchema(schema.unwrap()).nullish()
  }
  if (schema instanceof z.ZodDefault) {
    return deepPartialSchema(schema.removeDefault()).optional()
  }
  return schema.optional()
}

/** --- Shared rows --- */
export const circuitRowSchema = z.object({
  id: num,
  type: str,
  qty: str,
})

export const windowItemSchema = z.object({
  id: num,
  type: str,
  material: str,
  size: str,
  grade: str,
  quantity: str,
  finish: str,
  blinds: str,
  casingTrim: str,
  marbleSillReplace: bool,
  marbleSillDetach: bool,
})

export const doorItemSchema = z.object({
  id: num,
  category: z.enum(["interior", "exterior"]),
  type: str,
  size: str,
  grade: str,
  finish: str,
  handleAction: str,
  misc: str,
  peepHole: bool,
  mailSlot: bool,
  nonCased: bool,
  sidelites: bool,
  sidelitesQty: str,
  sidelitesSize: str,
  sidelitesGrade: str,
  panelSize: str,
  panelGrade: str,
  stormdoorAssembly: bool,
  retrofitInStucco: bool,
  cleanSensor: bool,
  replaceSensor: bool,
})

export const floorLayerSchema = z.object({
  id: num,
  type: str,
  grade: str,
  application: str,
  action: str,
  vaporBarrier: bool,
  subfloorReplacement: bool,
})

export const nfipCleaningOptionsSchema = z.object({
  enabled: bool,
  wall: z.object({
    height: str,
    wallType: str,
    ceilingAffected: bool,
  }),
  floor: z.object({
    type: str,
    areaOnCrawlspace: bool,
  }),
})

export const flooringOptionsSchema = z.object({
  enabled: bool,
  multipleLayers: bool,
  layers: z.array(floorLayerSchema),
  vaporBarrier: bool,
  subfloorReplacement: bool,
  f9Note: str,
})

export const trimOptionsSchema = z.object({
  enabled: bool,
  baseboardHeight: str,
  material: str,
  detail: str,
  finish: str,
  cap: bool,
  shoe: bool,
  shoeFinish: str,
  subtractCabinetry: bool,
})

export const wallCoveringOptionsSchema = z.object({
  enabled: bool,
  material: str,
  type: str,
  replacementHeight: str,
  texture: bool,
  textureType: str,
  panelingStyle: str,
  panelingFinish: str,
  panelingGrade: str,
  chairRailAction: str,
  chairRailFinish: str,
})

export const electricalRoomOptionsSchema = z.object({
  enabled: bool,
  outlets110: num,
  outlets220: num,
  gfiOutlets: num,
  lightSwitches: num,
  ceilingLights: num,
  ceilingFans: num,
  bathroomLightBar: str,
  bathroomLightBarQty: num,
})

export const vanityOptionsSchema = z.object({
  enabled: bool,
  size: str,
  grade: str,
  detachAndReset: bool,
  countertop: z.object({
    type: str,
    grade: str,
    size: str,
    pStop: str,
    sink: str,
    action: str,
    faucet: str,
    faucetAction: str,
  }),
  backsplashUnattached: bool,
  backsplashAction: str,
})

export const toiletOptionsSchema = z.object({
  enabled: bool,
  action: str,
  seatReplacement: bool,
  supplyLine: bool,
})

export const showerOptionsSchema = z.object({
  enabled: bool,
  type: str,
  detachAndReset: bool,
  showerFaucet: str,
  actionForTub: str,
  jetted: bool,
  jettedMotorReplace: bool,
  surround: str,
  tubShowerFaucet: str,
  mortarBedReplace: bool,
  mortarBedSize: str,
  walls: str,
  tileBench: bool,
  tileNiche: bool,
  tileNicheQty: str,
  towelBar: bool,
  tileSoapDish: bool,
  tileSoapDishQty: str,
  grabBar: bool,
  grabBarQty: str,
  tileFeatureStrip: bool,
  glassDoor: bool,
  glassDoorAction: str,
})

export const cabinetOptionsSchema = z.object({
  enabled: bool,
  size: str,
  grade: str,
  detachAndReset: bool,
  toeKick: z.object({
    size: str,
    backSplash: str,
    grade: str,
    glass: bool,
    diagonalInstallation: bool,
  }),
})

export const countertopOptionsSchema = z.object({
  enabled: bool,
  type: str,
  grade: str,
  size: str,
  detachAndReset: bool,
})

export const plumbingOptionsSchema = z.object({
  replaceFaucetSink: bool,
  drFaucetSink: bool,
  waterSupplyLine: z.object({ enabled: bool, qty: str }),
  reverseOsmosis: z.object({ enabled: bool, action: str, f9Note: str }),
  garbageDisposal: z.object({ enabled: bool, action: str, f9Note: str }),
})

export const applianceOptionsSchema = z.object({
  enabled: bool,
  refrigerator: z.object({
    enabled: bool,
    type: str,
    size: str,
    grade: str,
    action: str,
    f9Note: str,
  }),
  dishwasher: z.object({ enabled: bool, grade: str, action: str, f9Note: str }),
  range: z.object({
    enabled: bool,
    type: str,
    options: str,
    grade: str,
    action: str,
    f9Note: str,
  }),
  cooktop: z.object({ enabled: bool, type: str, grade: str, action: str, f9Note: str }),
  waterHeater: z.object({
    enabled: bool,
    type: str,
    size: str,
    rating: str,
    action: str,
    f9Note: str,
  }),
  wallOven: z.object({ enabled: bool, type: str, grade: str, action: str, f9Note: str }),
  airHandler: z.object({ enabled: bool, type: str, options: str, action: str, f9Note: str }),
  boiler: z.object({
    enabled: bool,
    type: str,
    action: str,
    f9Note: str,
    expansionTank: bool,
    circulatorPump: bool,
  }),
  baseboardHeat: z.object({ enabled: bool, type: str, size: str, action: str }),
})

export const roomSchema = z.object({
  id: num,
  name: str,
  type: str,
  sqft: str,
  nfipCleaning: nfipCleaningOptionsSchema,
  flooring: flooringOptionsSchema,
  trim: trimOptionsSchema,
  wallCovering: wallCoveringOptionsSchema,
  electrical: electricalRoomOptionsSchema,
  windowsEnabled: bool,
  windows: z.array(windowItemSchema),
  doorsEnabled: bool,
  doors: z.array(doorItemSchema),
  vanity: vanityOptionsSchema.optional(),
  toilet: toiletOptionsSchema.optional(),
  shower: showerOptionsSchema.optional(),
  cabinets: cabinetOptionsSchema.optional(),
  countertop: countertopOptionsSchema.optional(),
  plumbing: plumbingOptionsSchema.optional(),
  appliances: applianceOptionsSchema.optional(),
})

/** --- Project / exterior / foundation --- */
export const projectDetailsSchema = z.object({
  projectName: str,
  claimNumber: str,
  inspectionDate: str,
  propertyAddress: str,
  propertyType: str,
  preFirm: bool,
  adjusterName: str,
  notes: str,
})

export const exteriorCondenserSchema = z.object({
  id: num,
  tonnage: str,
  seer: str,
  replace: bool,
  serviceCall: bool,
  f9Note: str,
})

export const exteriorPackageUnitSchema = z.object({
  id: num,
  unitType: str,
  tonnage: str,
  seer: str,
  replace: bool,
  serviceCall: bool,
  f9Note: str,
})

export const exteriorMiniSplitSchema = z.object({
  id: num,
  zones: str,
  highEfficiency: bool,
  replace: bool,
  serviceCall: bool,
  f9Note: str,
})

export const exteriorSchema = z.object({
  pressureWash: z.object({
    enabled: bool,
    perimeterFeet: str,
    regularPwash: bool,
    cleanWithSteam: bool,
  }),
  dumpster: z.object({
    enabled: bool,
    count: str,
    size: str,
  }),
  hvac: z.object({
    condenserUnits: z.array(exteriorCondenserSchema),
    packageUnits: z.array(exteriorPackageUnitSchema),
    miniSplits: z.array(exteriorMiniSplitSchema),
  }),
  electrical: z.object({
    exteriorOutlets: str,
    disconnect30Amp: str,
    breakerPanel: z.object({
      enabled: bool,
      amps: str,
      arcFaults: bool,
      panelReplacement: bool,
      circuitReplacement: bool,
      panelType: str,
      circuits: z.array(circuitRowSchema),
    }),
    meterBox: bool,
    meterBoxQty: str,
  }),
  finishes: z.object({
    exteriorPaint: z.object({ enabled: bool }),
    siding: z.object({
      enabled: bool,
      perimeterFeet: str,
      squareFeetEnabled: bool,
      squareFeet: str,
    }),
    sheathing: z.object({
      enabled: bool,
      type: str,
      replacementHeight: str,
    }),
    houseWrap: z.object({
      enabled: bool,
      replacementHeight: str,
    }),
    backerBoard: z.object({
      enabled: bool,
      replacementHeight: str,
    }),
    wallInsulation: z.object({
      enabled: bool,
      type: str,
      replacementHeight: str,
    }),
  }),
})

const measureTypeSchema = z.enum(["sf", "lf"])
const piersTypeSchema = z.union([z.literal(""), z.literal("short"), z.literal("tall")])

export const foundationWindowRowSchema = z.object({
  id: num,
  type: str,
  size: str,
  quantity: str,
  material: str,
})

export const foundationAirHandlerSchema = z.object({
  id: num,
  type: str,
  tonnage: str,
  heatElementCount: str,
  action: str,
  f9Note: str,
})

export const foundationSchema = z.object({
  crawlspace: z.object({
    enabled: bool,
    preFirm: bool,
    acControlledSpace: bool,
    heavyCleanArea: bool,
    perimeterFeet: str,
    piersType: piersTypeSchema,
    piersCount: str,
    cleanJoist: bool,
    bellyPaper: bool,
    floorInsulation: bool,
    floorInsulationType: str,
    muck: bool,
    muckHeavy: bool,
    standingWater: bool,
    houseRewire: str,
    stairCleaning: bool,
    stairsSubmerged: str,
    treadWidth: str,
    stringersLength: str,
  }),
  enclosureRemoval: z.object({
    sandRemoval: z.object({
      enabled: bool,
      cubicFeet: str,
      length: str,
      width: str,
      depth: str,
    }),
    backfill: z.object({
      enabled: bool,
      cubicFeet: str,
      length: str,
      width: str,
      depth: str,
    }),
    confinedSpace: bool,
  }),
  insulation: z.object({
    bellyPaper: bool,
    floorInsulation: bool,
    floorInsulationType: str,
    confinedSpace: bool,
  }),
  subgradeAreaCoverage: z.object({
    drywall: z.object({
      enabled: bool,
      type: str,
      replacementHeight: str,
      measureType: measureTypeSchema,
    }),
    wallInsulation: z.object({
      enabled: bool,
      type: str,
      replacementHeight: str,
      measureType: measureTypeSchema,
    }),
    foundationalDoor: z.object({
      enabled: bool,
      action: str,
    }),
    foundationalWindowsEnabled: bool,
    foundationalWindows: z.array(windowItemSchema),
  }),
  sumpPump: z.object({
    enabled: bool,
    action: str,
    hp: str,
    f9Note: str,
  }),
  waterHeater: z.object({
    enabled: bool,
    tankless: bool,
    type: str,
    size: str,
    rating: str,
    action: str,
    f9Note: str,
  }),
  waterSoftener: z.object({
    enabled: bool,
    type: str,
    size: str,
    action: str,
    f9Note: str,
  }),
  hvac: z.object({
    airHandlers: z.array(foundationAirHandlerSchema),
    boiler: z.object({
      enabled: bool,
      type: str,
      action: str,
      f9Note: str,
      expansionTank: bool,
      circulatorPump: bool,
      oilTankReplacement: bool,
      oilReplacement: bool,
    }),
    baseboardHeat: z.object({
      enabled: bool,
      type: str,
      size: str,
      action: str,
    }),
  }),
  basement: z.object({
    enabled: bool,
    wallCleanPf: str,
    muck: bool,
    muckHeavy: bool,
    drywallEnabled: bool,
    drywallMeasureType: measureTypeSchema,
    drywallValue: str,
    stairCleaning: bool,
    stairCount: str,
    treadWidth: str,
    stringersLength: str,
    foundationDoor: bool,
    foundationDoorAction: str,
    foundationWindows: z.array(foundationWindowRowSchema),
  }),
  electrical: z.object({
    outlets110: str,
    outlets220: str,
    gfiOutlets: str,
    lightSwitch: str,
    junctionBox: str,
    breakerPanel: z.object({
      enabled: bool,
      panelReplacement: bool,
      circuitReplacement: bool,
      panelType: str,
      circuits: z.array(circuitRowSchema),
    }),
    meterBox: bool,
    meterBoxQty: str,
    houseRewire: z.object({
      enabled: bool,
      homeSf: str,
    }),
  }),
  stairs: z.object({
    stairsForReplacement: str,
    sizeOfTreads: str,
    risers: bool,
    risersQty: str,
    stringersLength: str,
    landingReplacement: bool,
  }),
  elevator: bool,
})

/** Project details: `projectName` and `claimNumber` are required (marked * in the wizard); other keys deep-partial. */
export const projectDetailsExpressEstimateSchema = z.intersection(
  deepPartialSchema(projectDetailsSchema.omit({ projectName: true, claimNumber: true })),
  z.object({
    projectName: z.string().trim().min(1, "Project name is required"),
    claimNumber: z.string().trim().min(1, "Claim number is required"),
  }),
)

/** Full wizard payload — sub-schemas above stay strict for docs / composition. */
export const expressEstimateFormSchema = z.object({
  projectDetails: projectDetailsExpressEstimateSchema,
  exterior: deepPartialSchema(exteriorSchema),
  foundation: deepPartialSchema(foundationSchema),
  rooms: deepPartialSchema(z.array(roomSchema)),
})

export type ExpressEstimateFormValues = z.infer<typeof expressEstimateFormSchema>

export const expressEstimateUiSchema = deepPartialSchema(
  z.object({
    activeTab: str,
    isSaved: bool,
  }),
)

export type ExpressEstimateUiValues = z.infer<typeof expressEstimateUiSchema>

/** Full page form: wizard fields + UI chrome (tabs, save badge). */
export const expressEstimatePageSchema = z.object({
  projectDetails: projectDetailsExpressEstimateSchema,
  exterior: deepPartialSchema(exteriorSchema),
  foundation: deepPartialSchema(foundationSchema),
  rooms: deepPartialSchema(z.array(roomSchema)),
  activeTab: z.string().optional(),
  isSaved: z.boolean().optional(),
})

export type ExpressEstimatePageValues = z.infer<typeof expressEstimatePageSchema>
