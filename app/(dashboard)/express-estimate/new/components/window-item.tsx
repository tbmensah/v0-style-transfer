"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import type { WindowItem as WindowItemType } from "../types"

interface WindowItemProps {
  window: WindowItemType
  onChange: (updates: Partial<WindowItemType>) => void
  onDelete: () => void
}

export function WindowItemComponent({ window, onChange, onDelete }: WindowItemProps) {
  const nv = (v: string) => v === "__none__" ? "" : v

  return (
    <div className="rounded-lg bg-secondary/30 p-3">
      <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
        {/* Type */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Type</Label>
          <Select value={window.type} onValueChange={(v) => onChange({ type: nv(v), size: "", grade: "" })}>
            <SelectTrigger className="w-[125px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              <SelectItem value="single-hung">Single Hung</SelectItem>
              <SelectItem value="double-hung">Double Hung</SelectItem>
              <SelectItem value="casement">Casement</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
              <SelectItem value="horizontal-slider">Horizontal Slider</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Material */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Material</Label>
          <Select value={window.material} onValueChange={(v) => onChange({ material: nv(v), size: "", grade: "" })}>
            <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              <SelectItem value="aluminum">Aluminum</SelectItem>
              <SelectItem value="vinyl">Vinyl</SelectItem>
              <SelectItem value="wood">Wood</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Size - conditional based on type and material */}
        {window.type && window.material && (
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Size</Label>
            <Select value={window.size} onValueChange={(v) => onChange({ size: nv(v) })}>
              <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                {/* Aluminum sizes */}
                {window.material === "aluminum" && (window.type === "single-hung" || window.type === "double-hung") && (
                  <>
                    <SelectItem value="0-8">0-8 SF</SelectItem>
                    <SelectItem value="9-12">9-12 SF</SelectItem>
                    <SelectItem value="13-16">13-16 SF</SelectItem>
                    <SelectItem value="17-20">17-20 SF</SelectItem>
                  </>
                )}
                {window.material === "aluminum" && window.type === "casement" && (
                  <>
                    <SelectItem value="0-12">0-12 SF</SelectItem>
                    <SelectItem value="13-24">13-24 SF</SelectItem>
                    <SelectItem value="25-36">25-36 SF</SelectItem>
                    <SelectItem value="37+">37+ SF</SelectItem>
                  </>
                )}
                {window.material === "aluminum" && (window.type === "horizontal-slider" || window.type === "fixed") && (
                  <>
                    <SelectItem value="0-12">0-12 SF</SelectItem>
                    <SelectItem value="13-18">13-18 SF</SelectItem>
                    <SelectItem value="19-25">19-25 SF</SelectItem>
                    <SelectItem value="26+">26+ SF</SelectItem>
                  </>
                )}
                {/* Wood sizes */}
                {window.material === "wood" && (window.type === "single-hung" || window.type === "double-hung") && (
                  <>
                    <SelectItem value="0-10">0-10 SF</SelectItem>
                    <SelectItem value="11-16">11-16 SF</SelectItem>
                    <SelectItem value="17-22">17-22 SF</SelectItem>
                    <SelectItem value="23-28">23-28 SF</SelectItem>
                  </>
                )}
                {window.material === "wood" && window.type === "casement" && (
                  <>
                    <SelectItem value="0-11">0-11 SF</SelectItem>
                    <SelectItem value="12-23">12-23 SF</SelectItem>
                    <SelectItem value="24-32">24-32 SF</SelectItem>
                    <SelectItem value="33-44">33-44 SF</SelectItem>
                    <SelectItem value="44-55">44-55 SF</SelectItem>
                  </>
                )}
                {/* Vinyl sizes */}
                {window.material === "vinyl" && (window.type === "horizontal-slider" || window.type === "fixed") && (
                  <>
                    <SelectItem value="4-8">4-8 SF</SelectItem>
                    <SelectItem value="9-12">9-12 SF</SelectItem>
                    <SelectItem value="13-19">13-19 SF</SelectItem>
                    <SelectItem value="20-28">20-28 SF</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Grade - conditional based on type and material */}
        {window.type && window.material && (
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Grade</Label>
            <Select value={window.grade} onValueChange={(v) => onChange({ grade: nv(v) })}>
              <SelectTrigger className="w-[130px] border-border/60 bg-secondary/50">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                {window.material === "vinyl" && (
                  <>
                    <SelectItem value="base">Base</SelectItem>
                    <SelectItem value="high">High Grade</SelectItem>
                    <SelectItem value="premium">Premium Grade</SelectItem>
                  </>
                )}
                {window.material === "aluminum" && window.type !== "casement" && (
                  <>
                    <SelectItem value="base">Base</SelectItem>
                    <SelectItem value="2-pane">2 Pane</SelectItem>
                    <SelectItem value="2-pane-thermal">2 Pane w/thermal</SelectItem>
                  </>
                )}
                {window.material === "aluminum" && window.type === "casement" && (
                  <>
                    <SelectItem value="base">Base</SelectItem>
                    <SelectItem value="high">High Grade</SelectItem>
                    <SelectItem value="premium">Premium Grade</SelectItem>
                  </>
                )}
                {window.material === "wood" && window.type !== "casement" && (
                  <>
                    <SelectItem value="base">Base</SelectItem>
                    <SelectItem value="standard">Standard Grade</SelectItem>
                    <SelectItem value="high">High Grade</SelectItem>
                    <SelectItem value="premium">Premium Grade</SelectItem>
                  </>
                )}
                {window.material === "wood" && window.type === "casement" && (
                  <>
                    <SelectItem value="base">Base</SelectItem>
                    <SelectItem value="high">High Grade</SelectItem>
                    <SelectItem value="premium">Premium Grade</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Blinds */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Blinds</Label>
          <Select value={window.blinds} onValueChange={(v) => onChange({ blinds: nv(v) })}>
            <SelectTrigger className="w-[90px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              <SelectItem value="pvc">PVC</SelectItem>
              <SelectItem value="wood">Wood</SelectItem>
              <SelectItem value="metal">Metal</SelectItem>
              <SelectItem value="shutters">Shutters</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Casing/Trim */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Casing/Trim</Label>
          <Select value={window.casingTrim} onValueChange={(v) => onChange({ casingTrim: nv(v) })}>
            <SelectTrigger className="w-[120px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              <SelectItem value="untrimmed">Untrimmed Window</SelectItem>
              <SelectItem value="casing-stain">Casing - Stain</SelectItem>
              <SelectItem value="casing-apron-stain">Casing With Apron - Stain</SelectItem>
              <SelectItem value="casing-paint">Casing - Paint</SelectItem>
              <SelectItem value="casing-apron-paint">Casing With Apron - Paint</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Finish */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Finish</Label>
          <Select value={window.finish} onValueChange={(v) => onChange({ finish: nv(v) })}>
            <SelectTrigger className="w-[120px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              <SelectItem value="trimmed-window">Trimmed Window</SelectItem>
              <SelectItem value="sill-apron">Sill and Apron</SelectItem>
              <SelectItem value="marble-sill">Marble Sill</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quantity */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Quantity</Label>
          <Select value={window.quantity} onValueChange={(v) => onChange({ quantity: nv(v) })}>
            <SelectTrigger className="w-[70px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={String(num)}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Marble Sill Toggles */}
        <div className="flex items-center gap-2 pb-1">
          <Switch
            checked={window.marbleSillReplace}
            onCheckedChange={(checked) => onChange({ marbleSillReplace: checked })}
          />
          <Label className="text-sm whitespace-nowrap">Marble sill replace</Label>
        </div>
        <div className="flex items-center gap-2 pb-1">
          <Switch
            checked={window.marbleSillDetach}
            onCheckedChange={(checked) => onChange({ marbleSillDetach: checked })}
          />
          <Label className="text-sm whitespace-nowrap">Marble sill detach</Label>
        </div>

        {/* Spacer and Delete */}
        <div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
