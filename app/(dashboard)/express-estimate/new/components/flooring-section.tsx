"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus } from "lucide-react"
import type { FlooringOptions, FloorLayer } from "../types"
import { createFloorLayer } from "../defaults"
import { FloorLayerItemComponent } from "./floor-layer-item"

interface FlooringSectionProps {
  flooring: FlooringOptions
  onChange: (updates: Partial<FlooringOptions>) => void
}

export function FlooringSection({ flooring, onChange }: FlooringSectionProps) {

  const handleLayerChange = (layerIndex: number, updates: Partial<FloorLayer>) => {
    const newLayers = [...(flooring.layers || [])]
    newLayers[layerIndex] = { ...newLayers[layerIndex], ...updates }
    onChange({ layers: newLayers })
  }

  const handleLayerDelete = (layerId: number) => {
    const newLayers = (flooring.layers || []).filter(l => l.id !== layerId)
    onChange({
      layers: newLayers,
      multipleLayers: newLayers.length > 1
    })
  }

  const handleAddLayer = () => {
    const currentLayers = flooring.layers || []
    const newLayer = createFloorLayer()
    onChange({
      layers: [...currentLayers, newLayer],
      multipleLayers: true
    })
  }

  const handleEnableChange = (enabled: boolean) => {
    if (enabled) {
      // When enabling, ensure there's at least one layer
      const layers = flooring.layers?.length ? flooring.layers : [createFloorLayer()]
      onChange({ enabled, layers })
    } else {
      onChange({ enabled })
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={flooring.enabled}
              onCheckedChange={handleEnableChange}
            />
            <Label className="font-medium">Flooring</Label>
          </div>
          {flooring.enabled && (
            <div className="flex items-center gap-2 border-l border-border/40 pl-4">
              <Switch
                checked={flooring.multipleLayers}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    // When turning off multiple layers, keep only the first layer
                    const firstLayer = flooring.layers?.[0] || createFloorLayer()
                    onChange({ multipleLayers: false, layers: [firstLayer] })
                  } else {
                    onChange({ multipleLayers: true })
                  }
                }}
              />
              <Label className="text-sm text-muted-foreground">Multiple Layers</Label>
            </div>
          )}
        </div>
        {/* Add Layer button */}
        {flooring.enabled && flooring.multipleLayers && (flooring.layers?.length || 0) < 6 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1 border-border/60"
            onClick={handleAddLayer}
          >
            <Plus className="h-3 w-3" />
            Add Layer
          </Button>
        )}
      </div>

      {flooring.enabled && (
        <div className="space-y-3">
          <p className="text-xs text-amber-500">Note: Please note carpet installed over flooring is a content item</p>
          {/* Floor Layers */}
          {(flooring.layers || []).map((layer, layerIndex) => (
            <FloorLayerItemComponent
              key={layer.id}
              layer={layer}
              layerIndex={layerIndex}
              onChange={(updates) => handleLayerChange(layerIndex, updates)}
              onDelete={() => handleLayerDelete(layer.id)}
              showDelete={(flooring.layers?.length || 0) > 1}
            />
          ))}

          {/* F9 Note */}
          <div className="flex items-center gap-3 pt-2 border-t border-border/20">
            <Label className="text-sm text-muted-foreground whitespace-nowrap">F9 Note</Label>
            <Input
              placeholder="Add F9 note..."
              value={flooring.f9Note}
              onChange={(e) => onChange({ f9Note: e.target.value })}
              className="border-border/60 bg-secondary/50 flex-1"
            />
          </div>
        </div>
      )}
    </div>
  )
}
