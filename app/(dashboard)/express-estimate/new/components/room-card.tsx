"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Copy, Trash2, Home } from "lucide-react"
import type { Room, WindowItem, DoorItem, FloorLayer } from "../types"

// Section Components
import { NFIPCleaningSection } from "./nfip-cleaning-section"
import { FlooringSection } from "./flooring-section"
import { TrimSection } from "./trim-section"
import { WallCoveringSection } from "./wall-covering-section"
import { ElectricalSection } from "./electrical-section"
import { WindowsSection } from "./windows-section"
import { DoorsSection } from "./doors-section"
import { VanitySection, ToiletSection, ShowerSection } from "./bathroom-sections"
import { CabinetrySection, CountertopSection, PlumbingSection } from "./kitchen-sections"
import { AppliancesSection } from "./appliances-section"

// Helper for select value normalization
const nv = (v: string) => v === "__none__" ? "" : v

interface RoomCardProps {
  room: Room
  onUpdate: (updates: Partial<Room>) => void
  onCopy: () => void
  onRemove: () => void
  onAddWindow: () => void
  onAddDoor: (category: "interior" | "exterior") => void
  onUpdateWindow: (windowId: number, updates: Partial<WindowItem>) => void
  onRemoveWindow: (windowId: number) => void
  onUpdateDoor: (doorId: number, updates: Partial<DoorItem>) => void
  onRemoveDoor: (doorId: number) => void
  onUpdateFloorLayer: (layerId: number, updates: Partial<FloorLayer>) => void
  onRemoveFloorLayer: (layerId: number) => void
  onAddFloorLayer: () => void
}

export function RoomCard({
  room,
  onUpdate,
  onCopy,
  onRemove,
  onAddWindow,
  onAddDoor,
  onUpdateWindow,
  onRemoveWindow,
  onUpdateDoor,
  onRemoveDoor,
  onUpdateFloorLayer,
  onRemoveFloorLayer,
  onAddFloorLayer,
}: RoomCardProps) {
  const roomTypes = [
    { value: "room", label: "Room" },
    { value: "bathroom", label: "Bathroom" },
    { value: "kitchen", label: "Kitchen" },
    { value: "living-room", label: "Living Room" },
    { value: "bedroom", label: "Bedroom" },
    { value: "dining-room", label: "Dining Room" },
    { value: "laundry", label: "Laundry" },
    { value: "garage", label: "Garage" },
    { value: "basement", label: "Basement" },
    { value: "attic", label: "Attic" },
    { value: "hallway", label: "Hallway" },
    { value: "closet", label: "Closet" },
    { value: "office", label: "Office" },
    { value: "utility", label: "Utility" },
  ]

  return (
    <Collapsible defaultOpen>
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
            onClick={(e) => { e.stopPropagation(); onCopy() }}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onRemove() }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-4 rounded-b-lg border border-t-0 border-border/40 bg-card/50 p-4">
          {/* Basic Room Info */}
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Room Name</Label>
              <Input
                value={room.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="Enter room name"
                className="w-[180px] border-border/60 bg-secondary/50"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Type</Label>
              <Select value={room.type} onValueChange={(v) => onUpdate({ type: nv(v) })}>
                <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Square Feet</Label>
              <Input
                type="number"
                value={room.sqft}
                onChange={(e) => onUpdate({ sqft: e.target.value })}
                placeholder="0"
                className="w-[100px] border-border/60 bg-secondary/50"
                min="0"
              />
            </div>
          </div>

          {/* NFIP Cleaning */}
          <NFIPCleaningSection
            nfipCleaning={room.nfipCleaning}
            onUpdate={(updates) => onUpdate({ nfipCleaning: { ...room.nfipCleaning, ...updates } })}
          />

          {/* Flooring */}
          <FlooringSection
            flooring={room.flooring}
            onUpdate={(updates) => onUpdate({ flooring: { ...room.flooring, ...updates } })}
            onUpdateLayer={onUpdateFloorLayer}
            onRemoveLayer={onRemoveFloorLayer}
            onAddLayer={onAddFloorLayer}
          />

          {/* Trim */}
          <TrimSection
            trim={room.trim}
            onUpdate={(updates) => onUpdate({ trim: { ...room.trim, ...updates } })}
          />

          {/* Wall Covering */}
          <WallCoveringSection
            wallCovering={room.wallCovering}
            onUpdate={(updates) => onUpdate({ wallCovering: { ...room.wallCovering, ...updates } })}
          />

          {/* Electrical */}
          <ElectricalSection
            electrical={room.electrical}
            onUpdate={(updates) => onUpdate({ electrical: { ...room.electrical, ...updates } })}
          />

          {/* BATHROOM SPECIFIC SECTIONS */}
          {room.type === "bathroom" && room.vanity && room.toilet && room.shower && (
            <>
              <VanitySection
                vanity={room.vanity}
                onUpdate={(updates) => onUpdate({ vanity: { ...room.vanity!, ...updates } })}
              />
              <ToiletSection
                toilet={room.toilet}
                onUpdate={(updates) => onUpdate({ toilet: { ...room.toilet!, ...updates } })}
              />
              <ShowerSection
                shower={room.shower}
                onUpdate={(updates) => onUpdate({ shower: { ...room.shower!, ...updates } })}
              />
            </>
          )}

          {/* KITCHEN SPECIFIC SECTIONS */}
          {room.type === "kitchen" && room.cabinets && room.countertop && room.plumbing && room.appliances && (
            <>
              <CabinetrySection
                cabinets={room.cabinets}
                onUpdate={(updates) => onUpdate({ cabinets: { ...room.cabinets!, ...updates } })}
              />
              <CountertopSection
                countertop={room.countertop}
                onUpdate={(updates) => onUpdate({ countertop: { ...room.countertop!, ...updates } })}
              />
              <PlumbingSection
                plumbing={room.plumbing}
                onUpdate={(updates) => onUpdate({ plumbing: { ...room.plumbing!, ...updates } })}
              />
              <AppliancesSection
                appliances={room.appliances}
                onUpdate={(updates) => onUpdate({ appliances: { ...room.appliances!, ...updates } })}
              />
            </>
          )}

          {/* Windows */}
          <WindowsSection
            windows={room.windows}
            windowsEnabled={room.windowsEnabled}
            onToggle={(enabled) => onUpdate({ windowsEnabled: enabled })}
            onAddWindow={onAddWindow}
            onUpdateWindow={onUpdateWindow}
            onRemoveWindow={onRemoveWindow}
          />

          {/* Doors */}
          <DoorsSection
            doors={room.doors}
            doorsEnabled={room.doorsEnabled}
            onToggle={(enabled) => onUpdate({ doorsEnabled: enabled })}
            onAddDoor={onAddDoor}
            onUpdateDoor={onUpdateDoor}
            onRemoveDoor={onRemoveDoor}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
