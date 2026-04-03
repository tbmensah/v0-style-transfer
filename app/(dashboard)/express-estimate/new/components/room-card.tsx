"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Copy, Trash2, Home } from "lucide-react"
import type { Room } from "../types"
import { defaultBathroomExtras, defaultKitchenExtras } from "../defaults"

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
  onSave?: () => void
}

export function RoomCard({
  room,
  onUpdate,
  onCopy,
  onRemove,
  onSave,
}: RoomCardProps) {
  console.log("[v0] RoomCard rendered for room:", room.id, room.name, "nfipCleaning.enabled:", room.nfipCleaning.enabled, "flooring.enabled:", room.flooring.enabled)
  const roomTypes = [
    { value: "room", label: "Room" },
    { value: "bathroom", label: "Bathroom" },
    { value: "kitchen", label: "Kitchen" },
  ]

  const handleTypeChange = (value: string) => {
    const newType = nv(value)
    const updates: Partial<Room> = { type: newType }
    
    // Add bathroom-specific fields when changing to bathroom
    if (newType === "bathroom" && !room.vanity) {
      Object.assign(updates, defaultBathroomExtras)
    }
    // Add kitchen-specific fields when changing to kitchen
    if (newType === "kitchen" && !room.cabinets) {
      Object.assign(updates, defaultKitchenExtras)
    }
    
    onUpdate(updates)
  }

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
      <CollapsibleContent className="mt-2 rounded-lg border border-border/60 bg-secondary/20 p-4">
        <div className="space-y-6">
          {/* Room Name & Type */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2 min-w-[160px]">
              <Label>Room Name</Label>
              <Input
                value={room.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="border-border/60 bg-secondary/50"
              />
            </div>
            <div className="space-y-2 min-w-[120px]">
              <Label>Room Type</Label>
              <Select value={room.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="border-border/60 bg-secondary/50">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                  {roomTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* NFIP Cleaning */}
          <NFIPCleaningSection
            nfipCleaning={room.nfipCleaning}
            onChange={(updates) => {
              console.log("[v0] NFIPCleaningSection onChange called with:", updates)
              onUpdate({ nfipCleaning: { ...room.nfipCleaning, ...updates } })
            }}
          />

          {/* Flooring */}
          <FlooringSection
            flooring={room.flooring}
            onChange={(updates) => {
              console.log("[v0] FlooringSection onChange called with:", updates)
              onUpdate({ flooring: { ...room.flooring, ...updates } })
            }}
          />

          {/* Trim */}
          <TrimSection
            trim={room.trim}
            onChange={(updates) => onUpdate({ trim: { ...room.trim, ...updates } })}
          />

          {/* Wall Covering */}
          <WallCoveringSection
            wallCovering={room.wallCovering}
            onChange={(updates) => onUpdate({ wallCovering: { ...room.wallCovering, ...updates } })}
          />

          {/* Electrical */}
          <ElectricalSection
            electrical={room.electrical}
            onChange={(updates) => onUpdate({ electrical: { ...room.electrical, ...updates } })}
          />

          {/* BATHROOM SPECIFIC SECTIONS */}
          {room.type === "bathroom" && room.vanity && room.toilet && room.shower && (
            <>
              <VanitySection
                vanity={room.vanity}
                onChange={(updates) => onUpdate({ vanity: { ...room.vanity!, ...updates } })}
              />
              <ToiletSection
                toilet={room.toilet}
                onChange={(updates) => onUpdate({ toilet: { ...room.toilet!, ...updates } })}
              />
              <ShowerSection
                shower={room.shower}
                onChange={(updates) => onUpdate({ shower: { ...room.shower!, ...updates } })}
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
            onChange={(windows) => onUpdate({ windows })}
          />

          {/* Doors */}
          <DoorsSection
            doors={room.doors}
            onChange={(doors) => onUpdate({ doors })}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
