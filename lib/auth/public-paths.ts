/** Routes that do not require a Supabase session. */
export function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true
  if (pathname.startsWith("/_next")) return true
  if (
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$/i.test(pathname)
  ) {
    return true
  }

  const publicPrefixes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/terms",
    "/privacy",
  ]

  return publicPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
}
