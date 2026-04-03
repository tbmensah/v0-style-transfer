"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import type { FloorLayer } from "../types"

interface FloorLayerItemProps {
  layer: FloorLayer
  layerIndex: number
  onChange: (updates: Partial<FloorLayer>) => void
  onDelete: () => void
  showDelete: boolean
}

export function FloorLayerItemComponent({ layer, layerIndex, onChange, onDelete, showDelete }: FloorLayerItemProps) {
  const nv = (v: string) => v === "__none__" ? "" : v

  return (
    <div className="flex flex-wrap items-end gap-3 p-2 rounded-lg bg-secondary/20">
      <Badge variant="outline" className="text-xs h-6 self-center">Layer {layerIndex + 1}</Badge>
      
      {/* Type */}
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Type</Label>
        <Select 
          value={layer.type} 
          onValueChange={(v) => onChange({ type: nv(v), grade: "", application: "" })}
        >
          <SelectTrigger className="w-[130px] border-border/60 bg-secondary/50">
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
            <SelectItem value="terrazzo">Terrazzo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grade - conditional on type */}
      {layer.type && layer.type !== "terrazzo" && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Grade</Label>
          <Select value={layer.grade} onValueChange={(v) => onChange({ grade: nv(v) })}>
            <SelectTrigger className="w-[110px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              {layer.type === "vinyl-plank" && (
                <>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High Grade</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </>
              )}
              {layer.type === "sheet-vinyl" && (
                <>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High Grade</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </>
              )}
              {layer.type === "laminate" && (
                <>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High Grade</SelectItem>
                </>
              )}
              {layer.type === "carpet" && (
                <>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High Grade</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </>
              )}
              {layer.type === "carpet-glue-down" && (
                <>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High Grade</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </>
              )}
              {layer.type === "hardwood" && (
                <>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High Grade</SelectItem>
                </>
              )}
              {layer.type === "tile" && (
                <>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High Grade</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Application - conditional on type */}
      {(layer.type === "vinyl-plank" || layer.type === "hardwood" || layer.type === "terrazzo") && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Application</Label>
          <Select value={layer.application} onValueChange={(v) => onChange({ application: nv(v) })}>
            <SelectTrigger className="w-[130px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              {layer.type === "vinyl-plank" && (
                <>
                  <SelectItem value="glue-down">Glue Down</SelectItem>
                  <SelectItem value="floating">Floating</SelectItem>
                </>
              )}
              {layer.type === "hardwood" && (
                <>
                  <SelectItem value="nail-down">Nail Down</SelectItem>
                  <SelectItem value="glue-down">Glue Down</SelectItem>
                </>
              )}
              {layer.type === "terrazzo" && (
                <>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="replace">Replace</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Action */}
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Action</Label>
        <Select value={layer.action} onValueChange={(v) => onChange({ action: nv(v) })}>
          <SelectTrigger className="w-[130px] border-border/60 bg-secondary/50">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
            <SelectItem value="replace">Replace</SelectItem>
            <SelectItem value="remove">R&R (Remove)</SelectItem>
            <SelectItem value="clean">Clean</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-2 pb-1">
        <Switch
          checked={layer.vaporBarrier}
          onCheckedChange={(checked) => onChange({ 
            vaporBarrier: checked, 
            subfloorReplacement: checked ? false : layer.subfloorReplacement 
          })}
        />
        <Label className="text-sm whitespace-nowrap">Vapor Barrier</Label>
      </div>
      <div className="flex items-center gap-2 pb-1">
        <Switch
          checked={layer.subfloorReplacement}
          onCheckedChange={(checked) => onChange({ 
            subfloorReplacement: checked, 
            vaporBarrier: checked ? false : layer.vaporBarrier 
          })}
        />
        <Label className="text-sm whitespace-nowrap">Subfloor Replacement</Label>
      </div>

      {/* Delete button - only show if more than one layer */}
      {showDelete && (
        <>
          <div className="flex-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/20"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}
