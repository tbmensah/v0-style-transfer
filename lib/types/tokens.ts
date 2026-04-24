/** `GET /tokens` — one row in `data.packages`. */
export type FastFillTokenPackage = {
  product: string
  tokens: number
  total_usd: string
  price_per_token_usd: string
}

/** `GET /tokens` — `data` payload. */
export type TokenCatalogData = {
  packages: FastFillTokenPackage[]
}

/** `GET /tokens/lifetime` — `data` payload. */
export type TokenLifetimeData = {
  total_ff_purchased: number
  total_ee_purchased: number
  ff_tokens_used: number
  ee_tokens_used: number
}

/** Stripe purchase row status. */
export type TokenPurchaseStatus = "pending" | "completed" | "refunded" | "failed"

/** `GET /tokens/purchases` — one item. */
export type TokenPurchaseItem = {
  id: string
  created_at: string
  token_type: "ee" | "ff"
  tokens_purchased: number
  amount_cents: number
  currency: string
  status: TokenPurchaseStatus
  stripe_payment_intent_id: string
  stripe_session_id: string
}

/** `GET /tokens/purchases` — `data` payload. */
export type TokenPurchasesListData = {
  items: TokenPurchaseItem[]
  total: number
  page: number
  page_size: number
}

/** `GET /tokens/purchases` query params. */
export type TokenPurchasesParams = {
  token_type?: "ee" | "ff" | null
  /** Repeat `status` query param per value. */
  status?: TokenPurchaseStatus[] | null
  created_from?: string | null
  created_to?: string | null
  page?: number
  page_size?: number
}

/** `POST /tokens/stub/credit` request body. */
export type StubTokenCreditRequest = {
  token_type: "ee" | "ff"
  amount: number
}

/** `POST /tokens/stub/credit` — `data` payload. */
export type StubTokenCreditData = {
  token_type: "ee" | "ff"
  credited: number
  ff_balance: number
  ee_balance: number
}
