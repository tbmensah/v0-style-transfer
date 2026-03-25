"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Plus, Trash2, Copy, Home, X } from "lucide-react"
import type { Room, WindowItem, DoorItem } from "../types"

interface InteriorTabProps {
  rooms: Room[]
  addRoom: (type?: string, name?: string) => void
  copyRoom: (roomId: number) => void
  removeRoom: (roomId: number) => void
  updateRoom: (roomId: number, updates: Partial<Room>) => void
  addWindow: (roomId: number) => void
  addDoor: (roomId: number, category: "interior" | "exterior") => void
}

export function InteriorTab({
  rooms,
  addRoom,
  copyRoom,
  removeRoom,
  updateRoom,
  addWindow,
  addDoor,
}: InteriorTabProps) {
  if (rooms.length === 0) {
    return (
      <div className="mt-6 rounded-lg border border-dashed border-border/60 bg-secondary/20 p-8 text-center">
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
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          copyRoom={copyRoom}
          removeRoom={removeRoom}
          updateRoom={updateRoom}
          addWindow={addWindow}
          addDoor={addDoor}
        />
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
    </div>
  )
}

// Room Card Component
function RoomCard({
  room,
  copyRoom,
  removeRoom,
  updateRoom,
  addWindow,
  addDoor,
}: {
  room: Room
  copyRoom: (roomId: number) => void
  removeRoom: (roomId: number) => void
  updateRoom: (roomId: number, updates: Partial<Room>) => void
  addWindow: (roomId: number) => void
  addDoor: (roomId: number, category: "interior" | "exterior") => void
}) {
  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-primary/30 bg-primary/10 p-4 transition-colors hover:bg-primary/15 [&[data-state=open]>svg]:rotate-180">
        <div className="flex items-center gap-3">
          <Home className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs capitalize">{room.type.replace("-", " ")}</Badge>
          <span className="text-sm text-muted-foreground">Re-Name</span>
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
          <RoomBasicInfo room={room} updateRoom={updateRoom} />
          
          {/* NFIP Cleaning */}
          <NFIPCleaningSection room={room} updateRoom={updateRoom} />
          
          {/* Flooring */}
          <FlooringSection room={room} updateRoom={updateRoom} />
          
          {/* Trim / Baseboard */}
          <TrimSection room={room} updateRoom={updateRoom} />
          
          {/* Wall Coverings */}
          <WallCoveringSection room={room} updateRoom={updateRoom} />
          
          {/* Electrical */}
          <ElectricalSection room={room} updateRoom={updateRoom} />
          
          {/* Windows */}
          <WindowsSection room={room} updateRoom={updateRoom} addWindow={addWindow} />
          
          {/* Doors */}
          <DoorsSection room={room} updateRoom={updateRoom} addDoor={addDoor} />

          {/* BATHROOM SPECIFIC SECTIONS */}
          {room.type === "bathroom" && room.vanity && room.toilet && room.shower && (
            <>
              <VanitySection room={room} updateRoom={updateRoom} />
              <ToiletSection room={room} updateRoom={updateRoom} />
              <ShowerSection room={room} updateRoom={updateRoom} />
            </>
          )}

          {/* KITCHEN SPECIFIC SECTIONS */}
          {room.type === "kitchen" && room.cabinets && room.countertop && room.plumbing && room.appliances && (
            <>
              <div className="flex items-center gap-3 mb-2">
                <Switch checked={true} />
                <Label className="font-medium">Kitchen</Label>
              </div>
              <CabinetrySection room={room} updateRoom={updateRoom} />
              <CountertopSection room={room} updateRoom={updateRoom} />
              <PlumbingSection room={room} updateRoom={updateRoom} />
              <AppliancesSection room={room} updateRoom={updateRoom} />
            </>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// Room Basic Info
function RoomBasicInfo({ room, updateRoom }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void }) {
  return (
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
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="room">Room</SelectItem>
            <SelectItem value="bathroom">Bathroom</SelectItem>
            <SelectItem value="kitchen">Kitchen</SelectItem>
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
  )
}

// NFIP Cleaning Section
function NFIPCleaningSection({ room, updateRoom }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void }) {
  return (
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
              <Label className="text-sm font-medium">Wall</Label>
              <div className="flex flex-wrap items-center gap-4">
                <Select value={room.nfipCleaning.wall.height} onValueChange={(value) => updateRoom(room.id, { nfipCleaning: { ...room.nfipCleaning, wall: { ...room.nfipCleaning.wall, height: value } } })}>
                  <SelectTrigger className="border-border/60 bg-secondary/50 w-[100px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-40">1-40 PF</SelectItem>
                    <SelectItem value="41-80">41-80 PF</SelectItem>
                    <SelectItem value="81-120">81-120 PF</SelectItem>
                  </SelectContent>
                </Select>
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
  )
}

// Flooring Section
function FlooringSection({ room, updateRoom }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void }) {
  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <Switch
            checked={room.flooring.enabled}
            onCheckedChange={(checked) => {
              const newFlooring = { ...room.flooring, enabled: checked }
              if (checked && newFlooring.layers.length === 0) {
                newFlooring.layers = [{ id: Date.now(), type: "", grade: "", application: "", action: "" }]
              }
              updateRoom(room.id, { flooring: newFlooring })
            }}
          />
          <Label className="font-medium">Flooring</Label>
        </div>
        {room.flooring.enabled && (
          <>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`flooring-layers-${room.id}`}
                  checked={!room.flooring.multipleLayers}
                  onChange={() => updateRoom(room.id, { flooring: { ...room.flooring, multipleLayers: false, layers: room.flooring.layers.slice(0, 1) } })}
                  className="accent-primary"
                />
                <span className="text-sm">1 layer of flooring</span>
              </label>
              <span className="text-muted-foreground text-sm">or</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`flooring-layers-${room.id}`}
                  checked={room.flooring.multipleLayers}
                  onChange={() => updateRoom(room.id, { flooring: { ...room.flooring, multipleLayers: true } })}
                  className="accent-primary"
                />
                <span className="text-sm">Multiple layers of Flooring</span>
              </label>
            </div>
            <p className="text-xs text-amber-500 ml-auto">Note: Please note carpet installed over flooring is a content item</p>
          </>
        )}
      </div>
      {room.flooring.enabled && (
        <div className="space-y-4">
          {room.flooring.layers.map((layer, layerIndex) => (
            <div key={layer.id} className="space-y-2">
              <Label className="text-sm font-medium">{layerIndex === 0 ? "1st Layer" : `${layerIndex + 1}${layerIndex === 1 ? "nd" : layerIndex === 2 ? "rd" : "th"} Layer`}</Label>
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1 min-w-[140px]">
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <Select 
                    value={layer.type} 
                    onValueChange={(value) => {
                      const newLayers = [...room.flooring.layers]
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
                      const newLayers = [...room.flooring.layers]
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
                      const newLayers = [...room.flooring.layers]
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
                      const newLayers = [...room.flooring.layers]
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
                {(room.flooring.multipleLayers || layerIndex > 0) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => {
                      const newLayers = room.flooring.layers.filter(l => l.id !== layer.id)
                      if (newLayers.length === 0) {
                        newLayers.push({ id: Date.now(), type: "", grade: "", application: "", action: "" })
                      }
                      updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers, multipleLayers: newLayers.length > 1 } })
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {room.flooring.multipleLayers && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => {
                const newLayers = [...room.flooring.layers, { id: Date.now(), type: "", grade: "", application: "", action: "" }]
                updateRoom(room.id, { flooring: { ...room.flooring, layers: newLayers } })
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Layer
            </Button>
          )}
          <div className="space-y-2 pt-2">
            <Textarea
              placeholder="F9 Description of the layers of floor removed..."
              value={room.flooring.f9Note}
              onChange={(e) => updateRoom(room.id, { flooring: { ...room.flooring, f9Note: e.target.value } })}
              className="border-border/60 bg-secondary/50 min-h-[60px]"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Trim Section
function TrimSection({ room, updateRoom }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void }) {
  return (
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
  )
}

// Wall Covering Section
function WallCoveringSection({ room, updateRoom }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void }) {
  return (
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
  )
}

// Electrical Section
function ElectricalSection({ room, updateRoom }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void }) {
  return (
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
  )
}

// Windows Section
function WindowsSection({ room, updateRoom, addWindow }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void; addWindow: (roomId: number) => void }) {
  return (
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
  )
}

// Doors Section
function DoorsSection({ room, updateRoom, addDoor }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void; addDoor: (roomId: number, category: "interior" | "exterior") => void }) {
  return (
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
  )
}

// Bathroom Sections
function VanitySection({ room, updateRoom }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void }) {
  if (!room.vanity) return null
  return (
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
  )
}

function ToiletSection({ room, updateRoom }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void }) {
  if (!room.toilet) return null
  return (
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
  )
}

function ShowerSection({ room, updateRoom }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void }) {
  if (!room.shower) return null
  return (
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
  )
}

// Kitchen Sections (simplified versions - full appliance section follows)
function CabinetrySection({ room, updateRoom }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void }) {
  if (!room.cabinets) return null
  return (
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
  )
}

function CountertopSection({ room, updateRoom }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void }) {
  if (!room.countertop) return null
  return (
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
  )
}

function PlumbingSection({ room, updateRoom }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void }) {
  if (!room.plumbing) return null
  return (
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
      
      {/* Reverse Osmosis row */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/20">
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
  )
}

function AppliancesSection({ room, updateRoom }: { room: Room; updateRoom: (roomId: number, updates: Partial<Room>) => void }) {
  if (!room.appliances) return null
  return (
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
          <ApplianceItem
            title="Refrigerator"
            enabled={room.appliances.refrigerator.enabled}
            onToggle={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, enabled: checked } } })}
          >
            {room.appliances.refrigerator.enabled && (
              <div className="space-y-3">
                <div className="grid gap-4 sm:grid-cols-4">
                  <ApplianceSelect
                    label="Type"
                    value={room.appliances.refrigerator.type}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, type: value, size: "" } } })}
                    options={[
                      { value: "top-freezer", label: "Top Freezer" },
                      { value: "bottom-freezer", label: "Bottom Freezer" },
                      { value: "built-in", label: "Built In" },
                      { value: "compact", label: "Compact (under counter)" },
                      { value: "side-by-side", label: "Side by side" },
                    ]}
                  />
                  {room.appliances.refrigerator.type !== "compact" && (
                    <ApplianceSelect
                      label="Size"
                      value={room.appliances.refrigerator.size}
                      onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, size: value } } })}
                      options={
                        room.appliances.refrigerator.type === "built-in"
                          ? [{ value: "36", label: '36"' }, { value: "42", label: '42"' }, { value: "48", label: '48"' }]
                          : [{ value: "14-18", label: "14-18 CF" }, { value: "18-22", label: "18-22 CF" }, { value: "22-25", label: "22-25 CF" }, { value: "25-30", label: "25-30 CF" }]
                      }
                    />
                  )}
                  <ApplianceSelect
                    label="Grade"
                    value={room.appliances.refrigerator.grade}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, grade: value } } })}
                    options={[
                      { value: "base", label: "Base" },
                      { value: "standard", label: "Standard" },
                      { value: "high", label: "High grade" },
                      { value: "premium", label: "Premium" },
                    ]}
                  />
                  <ApplianceSelect
                    label="Action"
                    value={room.appliances.refrigerator.action}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, action: value } } })}
                    options={[
                      { value: "detach-reset", label: "Detach and reset" },
                      { value: "service-call", label: "Service call" },
                      { value: "replace", label: "Replace" },
                    ]}
                  />
                </div>
                <Input
                  placeholder="F9 Model/serial..."
                  value={room.appliances.refrigerator.f9Note}
                  onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, refrigerator: { ...room.appliances!.refrigerator, f9Note: e.target.value } } })}
                  className="border-border/60 bg-secondary/50"
                />
              </div>
            )}
          </ApplianceItem>

          {/* Dishwasher */}
          <ApplianceItem
            title="Dishwasher"
            enabled={room.appliances.dishwasher.enabled}
            onToggle={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, dishwasher: { ...room.appliances!.dishwasher, enabled: checked } } })}
          >
            {room.appliances.dishwasher.enabled && (
              <div className="space-y-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <ApplianceSelect
                    label="Grade"
                    value={room.appliances.dishwasher.grade}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, dishwasher: { ...room.appliances!.dishwasher, grade: value } } })}
                    options={[
                      { value: "standard", label: "Standard" },
                      { value: "high", label: "High" },
                      { value: "premium", label: "Premium" },
                    ]}
                  />
                  <ApplianceSelect
                    label="Action"
                    value={room.appliances.dishwasher.action}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, dishwasher: { ...room.appliances!.dishwasher, action: value } } })}
                    options={[
                      { value: "detach-reset", label: "Detach and reset" },
                      { value: "replace", label: "Replace" },
                    ]}
                  />
                </div>
                <Input
                  placeholder="F9 Model/serial..."
                  value={room.appliances.dishwasher.f9Note}
                  onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, dishwasher: { ...room.appliances!.dishwasher, f9Note: e.target.value } } })}
                  className="border-border/60 bg-secondary/50"
                />
              </div>
            )}
          </ApplianceItem>

          {/* Range */}
          <ApplianceItem
            title="Range"
            enabled={room.appliances.range.enabled}
            onToggle={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, enabled: checked } } })}
          >
            {room.appliances.range.enabled && (
              <div className="space-y-3">
                <div className="grid gap-4 sm:grid-cols-4">
                  <ApplianceSelect
                    label="Type"
                    value={room.appliances.range.type}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, type: value } } })}
                    options={[
                      { value: "gas", label: "Gas" },
                      { value: "electric", label: "Electric" },
                    ]}
                  />
                  <ApplianceSelect
                    label="Options"
                    value={room.appliances.range.options}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, options: value } } })}
                    options={[
                      { value: "free-standing", label: "Free Standing" },
                      { value: "slide-in", label: "Slide In" },
                      { value: "drop-in", label: "Drop In" },
                    ]}
                  />
                  <ApplianceSelect
                    label="Grade"
                    value={room.appliances.range.grade}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, grade: value } } })}
                    options={[
                      { value: "standard", label: "Standard" },
                      { value: "high", label: "High" },
                      { value: "premium", label: "Premium" },
                    ]}
                  />
                  <ApplianceSelect
                    label="Action"
                    value={room.appliances.range.action}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, action: value } } })}
                    options={[
                      { value: "detach-reset", label: "Detach and reset" },
                      { value: "replace", label: "Replace" },
                    ]}
                  />
                </div>
                <Input
                  placeholder="F9 Model/serial..."
                  value={room.appliances.range.f9Note}
                  onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, range: { ...room.appliances!.range, f9Note: e.target.value } } })}
                  className="border-border/60 bg-secondary/50"
                />
              </div>
            )}
          </ApplianceItem>

          {/* Water Heater */}
          <ApplianceItem
            title="Water Heater"
            enabled={room.appliances.waterHeater.enabled}
            onToggle={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, enabled: checked } } })}
          >
            {room.appliances.waterHeater.enabled && (
              <div className="space-y-3">
                <div className="grid gap-4 sm:grid-cols-4">
                  <ApplianceSelect
                    label="Type"
                    value={room.appliances.waterHeater.type}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, type: value } } })}
                    options={[
                      { value: "gas", label: "Gas" },
                      { value: "electric", label: "Electric" },
                      { value: "tankless-gas", label: "Tankless Gas" },
                      { value: "tankless-electric", label: "Tankless Electric" },
                    ]}
                  />
                  <ApplianceSelect
                    label="Size"
                    value={room.appliances.waterHeater.size}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, size: value } } })}
                    options={[
                      { value: "30", label: "30 gallon" },
                      { value: "40", label: "40 gallon" },
                      { value: "50", label: "50 gallon" },
                      { value: "80", label: "80 gallon" },
                    ]}
                  />
                  <ApplianceSelect
                    label="Rating"
                    value={room.appliances.waterHeater.rating}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, rating: value } } })}
                    options={[
                      { value: "standard", label: "Standard" },
                      { value: "high-efficiency", label: "High Efficiency" },
                    ]}
                  />
                  <ApplianceSelect
                    label="Action"
                    value={room.appliances.waterHeater.action}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, action: value } } })}
                    options={[
                      { value: "detach-reset", label: "Detach and reset" },
                      { value: "replace", label: "Replace" },
                    ]}
                  />
                </div>
                <Input
                  placeholder="F9 Model/serial..."
                  value={room.appliances.waterHeater.f9Note}
                  onChange={(e) => updateRoom(room.id, { appliances: { ...room.appliances!, waterHeater: { ...room.appliances!.waterHeater, f9Note: e.target.value } } })}
                  className="border-border/60 bg-secondary/50"
                />
              </div>
            )}
          </ApplianceItem>

          {/* Boiler */}
          <ApplianceItem
            title="Boiler"
            enabled={room.appliances.boiler.enabled}
            onToggle={(checked) => updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, enabled: checked } } })}
          >
            {room.appliances.boiler.enabled && (
              <div className="space-y-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <ApplianceSelect
                    label="Type"
                    value={room.appliances.boiler.type}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, type: value } } })}
                    options={[
                      { value: "natural-gas", label: "Natural Gas" },
                      { value: "electric", label: "Electric" },
                      { value: "oil-fired", label: "Oil fired" },
                    ]}
                  />
                  <ApplianceSelect
                    label="Action"
                    value={room.appliances.boiler.action}
                    onChange={(value) => updateRoom(room.id, { appliances: { ...room.appliances!, boiler: { ...room.appliances!.boiler, action: value } } })}
                    options={[
                      { value: "detach-reset", label: "Detach and reset" },
                      { value: "replace", label: "Replace" },
                    ]}
                  />
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
          </ApplianceItem>
        </div>
      )}
    </div>
  )
}

// Helper Components
function ApplianceItem({ title, enabled, onToggle, children }: { title: string; enabled: boolean; onToggle: (checked: boolean) => void; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-lg bg-secondary/30 p-3">
      <div className="flex items-center gap-3">
        <Switch checked={enabled} onCheckedChange={onToggle} />
        <Label className="text-sm font-medium">{title}</Label>
      </div>
      {children}
    </div>
  )
}

function ApplianceSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-border/60 bg-secondary/50 text-sm">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
