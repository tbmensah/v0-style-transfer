"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SelectFieldProps {
  label?: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  options: { value: string; label: string }[]
  className?: string
  minWidth?: string
}

export function SelectField({
  label,
  value,
  onValueChange,
  placeholder = "Select",
  options,
  className = "",
  minWidth = "100px",
}: SelectFieldProps) {
  return (
    <div className={`space-y-1 ${className}`} style={{ minWidth }}>
      {label && <Label className="text-xs text-muted-foreground">{label}</Label>}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="border-border/60 bg-secondary/50">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface InputFieldProps {
  label?: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  type?: "text" | "number"
  className?: string
  minWidth?: string
  width?: string
}

export function InputField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  minWidth,
  width,
}: InputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      const val = e.target.value.replace(/^0+/, "") || "0"
      onChange(val)
    } else {
      onChange(e.target.value)
    }
  }

  return (
    <div className={`space-y-1 ${className}`} style={{ minWidth, width }}>
      {label && <Label className="text-xs text-muted-foreground">{label}</Label>}
      <Input
        type="text"
        inputMode={type === "number" ? "numeric" : "text"}
        pattern={type === "number" ? "[0-9]*" : undefined}
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder}
        className="border-border/60 bg-secondary/50"
      />
    </div>
  )
}

interface NumericInputProps {
  label?: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
  className?: string
  width?: string
}

export function NumericInput({
  label,
  value,
  onChange,
  placeholder = "0",
  className = "",
  width = "80px",
}: NumericInputProps) {
  return (
    <div className={`space-y-1 ${className}`} style={{ width }}>
      {label && <Label className="text-xs text-muted-foreground">{label}</Label>}
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => {
          const val = e.target.value.replace(/^0+/, "") || "0"
          onChange(parseInt(val) || 0)
        }}
        className="border-border/60 bg-secondary/50"
      />
    </div>
  )
}
