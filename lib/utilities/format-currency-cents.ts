/** Stripe-style integer cents + ISO currency code. */
export function formatCurrencyFromCents(cents: number, currency: string): string {
  const code = currency?.length === 3 ? currency.toUpperCase() : "USD"
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: code }).format(cents / 100)
  } catch {
    return `$${(cents / 100).toFixed(2)}`
  }
}
