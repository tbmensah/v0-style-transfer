/** `datetime-local` value → ISO 8601 or undefined if empty/invalid */
export function datetimeLocalToIso(value: string): string | undefined {
  const v = value.trim()
  if (!v) return undefined
  const ms = new Date(v).getTime()
  if (Number.isNaN(ms)) return undefined
  return new Date(ms).toISOString()
}

/** ISO 8601 → value for `datetime-local` (local), or empty string */
export function isoToDatetimeLocal(iso: string | null | undefined): string {
  if (!iso?.trim()) return ""
  const ms = Date.parse(iso)
  if (Number.isNaN(ms)) return ""
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
