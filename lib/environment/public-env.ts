/** True when `NEXT_PUBLIC_API_BASE_URL` is set (browser + server). */
export const hasApiBase =
  typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)
