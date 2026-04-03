"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { VanityOptions, ToiletOptions, ShowerOptions } from "../types"

const nv = (v: string) => v === "__none__" ? "" : v

// ===== VANITY SECTION =====
interface VanitySectionProps {
  vanity: VanityOptions
  onChange: (updates: Partial<VanityOptions>) => void
}

export function VanitySection({ vanity, onChange }: VanitySectionProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <div className="flex items-center gap-3">
        <Switch
          checked={vanity.enabled}
          onCheckedChange={(checked) => onChange({ enabled: checked })}
        />
        <Label className="font-medium">Vanity</Label>
      </div>
      {vanity.enabled && (
        <div className="space-y-3 pl-2">
          {/* Vanity Cabinet row */}
          <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Size (LF)</Label>
              <Select value={vanity.size} onValueChange={(v) => onChange({ size: nv(v) })}>
                <SelectTrigger className="w-[90px] border-border/60 bg-secondary/50">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={String(num)}>{num} LF</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Grade</Label>
              <Select value={vanity.grade} onValueChange={(v) => onChange({ grade: nv(v) })}>
                <SelectTrigger className="w-[110px] border-border/60 bg-secondary/50">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
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
                checked={vanity.detachAndReset}
                onCheckedChange={(checked) => onChange({ detachAndReset: checked })}
              />
              <Label className="text-sm whitespace-nowrap">D&R</Label>
            </div>
          </div>

          {/* Countertop row */}
          <div className="flex flex-wrap items-end gap-x-3 gap-y-2 pt-2 border-t border-border/20">
            <Label className="text-xs text-muted-foreground self-center">Countertop:</Label>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Type</Label>
              <Select value={vanity.countertop.type} onValueChange={(v) => onChange({ countertop: { ...vanity.countertop, type: nv(v) } })}>
                <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                  <SelectItem value="cultured-marble">Cultured Marble</SelectItem>
                  <SelectItem value="granite">Granite</SelectItem>
                  <SelectItem value="laminate">Laminate</SelectItem>
                  <SelectItem value="solid-surface">Solid Surface</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Grade</Label>
              <Select value={vanity.countertop.grade} onValueChange={(v) => onChange({ countertop: { ...vanity.countertop, grade: nv(v) } })}>
                <SelectTrigger className="w-[100px] border-border/60 bg-secondary/50">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High Grade</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Size ({vanity.countertop.type === "cultured-marble" || vanity.countertop.type === "laminate" ? "LF" : "SF"})
              </Label>
              <Select value={vanity.countertop.size} onValueChange={(v) => onChange({ countertop: { ...vanity.countertop, size: nv(v) } })}>
                <SelectTrigger className="w-[80px] border-border/60 bg-secondary/50">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Switch
                checked={vanity.countertop.detachAndReset}
                onCheckedChange={(checked) => onChange({ countertop: { ...vanity.countertop, detachAndReset: checked } })}
              />
              <Label className="text-sm">D&R</Label>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Switch
                checked={vanity.backsplashUnattached}
                onCheckedChange={(checked) => onChange({ backsplashUnattached: checked })}
              />
              <Label className="text-sm">Backsplash Unattached</Label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== TOILET SECTION =====
interface ToiletSectionProps {
  toilet: ToiletOptions
  onChange: (updates: Partial<ToiletOptions>) => void
}

export function ToiletSection({ toilet, onChange }: ToiletSectionProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <div className="flex items-center gap-3">
        <Switch
          checked={toilet.enabled}
          onCheckedChange={(checked) => onChange({ enabled: checked })}
        />
        <Label className="font-medium">Toilet</Label>
      </div>
      {toilet.enabled && (
        <div className="flex flex-wrap items-center gap-4">
          <Select value={toilet.action} onValueChange={(v) => onChange({ action: nv(v) })}>
            <SelectTrigger className="w-[160px] border-border/60 bg-secondary/50">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
              <SelectItem value="replace">Replace</SelectItem>
              <SelectItem value="detach-reset">Detach & Reset</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch
              checked={toilet.seatReplacement}
              onCheckedChange={(checked) => onChange({ seatReplacement: checked })}
            />
            <Label className="text-sm">Seat Replacement</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={toilet.supplyLine}
              onCheckedChange={(checked) => onChange({ supplyLine: checked })}
            />
            <Label className="text-sm">Supply Line</Label>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== SHOWER SECTION =====
interface ShowerSectionProps {
  shower: ShowerOptions
  onChange: (updates: Partial<ShowerOptions>) => void
}

export function ShowerSection({ shower, onChange }: ShowerSectionProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border/40 p-4">
      <div className="flex items-center gap-3">
        <Switch
          checked={shower.enabled}
          onCheckedChange={(checked) => onChange({ enabled: checked })}
        />
        <Label className="font-medium">Shower / Tub</Label>
      </div>
      {shower.enabled && (
        <div className="space-y-3">
          {/* Type selection */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Type</Label>
              <Select value={shower.type} onValueChange={(v) => onChange({ type: nv(v) })}>
                <SelectTrigger className="w-[180px] border-border/60 bg-secondary/50">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                  <SelectItem value="fiberglass-tub-shower">Fiberglass Tub/Shower</SelectItem>
                  <SelectItem value="tub-tile-surround">Tub w/Tile Surround</SelectItem>
                  <SelectItem value="tub-cultured-marble">Tub w/Cultured Marble</SelectItem>
                  <SelectItem value="tile-shower">Tile Shower</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fiberglass Tub/Shower options */}
            {shower.type === "fiberglass-tub-shower" && (
              <>
                <div className="flex items-center gap-2 pb-1">
                  <Switch
                    checked={shower.detachAndReset}
                    onCheckedChange={(checked) => onChange({ detachAndReset: checked })}
                  />
                  <Label className="text-sm">D&R</Label>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Shower Faucet</Label>
                  <Select value={shower.showerFaucet} onValueChange={(v) => onChange({ showerFaucet: nv(v) })}>
                    <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High Grade</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Tub w/Tile Surround options */}
            {shower.type === "tub-tile-surround" && (
              <>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Tub Action</Label>
                  <Select value={shower.actionForTub} onValueChange={(v) => onChange({ actionForTub: nv(v) })}>
                    <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="replace">Replace</SelectItem>
                      <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Surround</Label>
                  <Select value={shower.surround} onValueChange={(v) => onChange({ surround: nv(v) })}>
                    <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High Grade</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Faucet</Label>
                  <Select value={shower.tubShowerFaucet} onValueChange={(v) => onChange({ tubShowerFaucet: nv(v) })}>
                    <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High Grade</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Tub w/Cultured Marble options */}
            {shower.type === "tub-cultured-marble" && (
              <>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Tub Action</Label>
                  <Select value={shower.actionForTub} onValueChange={(v) => onChange({ actionForTub: nv(v) })}>
                    <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="replace">Replace</SelectItem>
                      <SelectItem value="detach-reset">Detach & Reset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Faucet</Label>
                  <Select value={shower.tubShowerFaucet} onValueChange={(v) => onChange({ tubShowerFaucet: nv(v) })}>
                    <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High Grade</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Tile Shower options */}
            {shower.type === "tile-shower" && (
              <>
                <div className="flex items-center gap-2 pb-1">
                  <Switch
                    checked={shower.mortarBedReplace}
                    onCheckedChange={(checked) => onChange({ mortarBedReplace: checked })}
                  />
                  <Label className="text-sm">Mortar Bed Replace</Label>
                </div>
                {shower.mortarBedReplace && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">SF</Label>
                    <Input
                      type="number"
                      min="0"
                      value={shower.mortarBedSize || ""}
                      onChange={(e) => onChange({ mortarBedSize: parseInt(e.target.value) || 0 })}
                      className="w-[80px] border-border/60 bg-secondary/50"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Surround</Label>
                  <Select value={shower.surround} onValueChange={(v) => onChange({ surround: nv(v) })}>
                    <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High Grade</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Shower Faucet</Label>
                  <Select value={shower.showerFaucet} onValueChange={(v) => onChange({ showerFaucet: nv(v) })}>
                    <SelectTrigger className="w-[140px] border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__" className="italic text-muted-foreground">None</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High Grade</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          {/* Description text */}
          {shower.type === "fiberglass-tub-shower" && (
            <p className="text-xs text-muted-foreground">Includes: 60&quot; fiberglass tub/shower combo</p>
          )}
          {shower.type === "tub-tile-surround" && (
            <p className="text-xs text-muted-foreground">Includes: Standard tub with tile surround</p>
          )}
          {shower.type === "tile-shower" && (
            <p className="text-xs text-muted-foreground">Includes: Custom tile shower with pan</p>
          )}

          {/* Additional accessories */}
          {shower.type && shower.type !== "__none__" && (
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/20">
              <div className="flex items-center gap-2">
                <Switch
                  checked={shower.tileBench}
                  onCheckedChange={(checked) => onChange({ tileBench: checked })}
                />
                <Label className="text-sm">Tile Bench</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={shower.tileNiche}
                  onCheckedChange={(checked) => onChange({ tileNiche: checked })}
                />
                <Label className="text-sm">Tile Niche</Label>
              </div>
              {shower.tileNiche && (
                <Select value={shower.tileNicheQty} onValueChange={(v) => onChange({ tileNicheQty: nv(v) })}>
                  <SelectTrigger className="w-[70px] border-border/60 bg-secondary/50">
                    <SelectValue placeholder="Qty" />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4"].map((q) => (
                      <SelectItem key={q} value={q}>{q}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div className="flex items-center gap-2">
                <Switch
                  checked={shower.towelBar}
                  onCheckedChange={(checked) => onChange({ towelBar: checked })}
                />
                <Label className="text-sm">Towel Bar</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={shower.tileSoapDish}
                  onCheckedChange={(checked) => onChange({ tileSoapDish: checked })}
                />
                <Label className="text-sm">Soap Dish</Label>
              </div>
              {shower.tileSoapDish && (
                <Select value={shower.tileSoapDishQty} onValueChange={(v) => onChange({ tileSoapDishQty: nv(v) })}>
                  <SelectTrigger className="w-[70px] border-border/60 bg-secondary/50">
                    <SelectValue placeholder="Qty" />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4"].map((q) => (
                      <SelectItem key={q} value={q}>{q}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
