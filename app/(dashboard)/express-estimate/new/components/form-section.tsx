"use client"

import { ReactNode } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

interface FormSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  icon?: ReactNode
}

export function FormSection({ title, children, defaultOpen = true, icon }: FormSectionProps) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="rounded-lg border border-border/60 bg-card">
      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-secondary/50 transition-colors [&[data-state=open]>svg]:rotate-180">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold">{title}</span>
        </div>
        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border/40">
        <div className="p-4 space-y-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

interface ToggleSectionProps {
  title: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  children?: ReactNode
  className?: string
}

export function ToggleSection({ title, enabled, onToggle, children, className = "" }: ToggleSectionProps) {
  return (
    <div className={`space-y-3 rounded-lg border border-border/40 p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Switch checked={enabled} onCheckedChange={onToggle} />
        <Label className="font-medium">{title}</Label>
      </div>
      {enabled && children && (
        <div className="space-y-3">
          {children}
        </div>
      )}
    </div>
  )
}

interface FieldRowProps {
  children: ReactNode
  className?: string
}

export function FieldRow({ children, className = "" }: FieldRowProps) {
  return (
    <div className={`flex flex-wrap items-end gap-4 ${className}`}>
      {children}
    </div>
  )
}

interface FieldGroupProps {
  label?: string
  children: ReactNode
  className?: string
  minWidth?: string
}

export function FieldGroup({ label, children, className = "", minWidth = "100px" }: FieldGroupProps) {
  return (
    <div className={`space-y-1 ${className}`} style={{ minWidth }}>
      {label && <Label className="text-xs text-muted-foreground">{label}</Label>}
      {children}
    </div>
  )
}

interface ToggleFieldProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export function ToggleField({ label, checked, onCheckedChange, className = "" }: ToggleFieldProps) {
  return (
    <div className={`flex items-center gap-2 pb-1 ${className}`}>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
      <Label className="text-sm">{label}</Label>
    </div>
  )
}
