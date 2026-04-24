import { unwrapSuccess } from "@/lib/api/unwrap-envelope"
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints"
import { clampListPageSize } from "@/lib/constants/pagination"
import { apiClient } from "@/lib/http/api-client"
import type { SuccessEnvelope } from "@/lib/types/api-envelope"
import type {
  StubTokenCreditData,
  StubTokenCreditRequest,
  TokenCatalogData,
  TokenLifetimeData,
  TokenPurchaseStatus,
  TokenPurchasesListData,
  TokenPurchasesParams,
} from "@/lib/types/tokens"

/** Public Fast Fill token pricing. `GET /tokens` */
export async function fetchTokenCatalog(): Promise<TokenCatalogData> {
  const { data } = await apiClient.get<SuccessEnvelope<TokenCatalogData>>(API_ENDPOINTS.tokensCatalog)
  return unwrapSuccess(data, "No token catalog")
}

/** Lifetime purchase + usage totals. `GET /tokens/lifetime` */
export async function fetchTokenLifetime(): Promise<TokenLifetimeData> {
  const { data } = await apiClient.get<SuccessEnvelope<TokenLifetimeData>>(API_ENDPOINTS.tokensLifetime)
  return unwrapSuccess(data, "No token lifetime data")
}

function appendPurchaseStatusParams(search: URLSearchParams, status?: TokenPurchaseStatus[] | null) {
  if (!status?.length) return
  const sorted = [...status].sort()
  for (const s of sorted) {
    search.append("status", s)
  }
}

function buildTokenPurchasesQuery(params: TokenPurchasesParams): string {
  const search = new URLSearchParams()
  if (params.token_type) search.set("token_type", params.token_type)
  appendPurchaseStatusParams(search, params.status)
  if (params.created_from) search.set("created_from", params.created_from)
  if (params.created_to) search.set("created_to", params.created_to)
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) {
    search.set("page_size", String(clampListPageSize(params.page_size)))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

/** Paginated Stripe purchases. `GET /tokens/purchases` */
export async function fetchTokenPurchases(params: TokenPurchasesParams): Promise<TokenPurchasesListData> {
  const { data } = await apiClient.get<SuccessEnvelope<TokenPurchasesListData>>(
    `${API_ENDPOINTS.tokensPurchases}${buildTokenPurchasesQuery(params)}`,
  )
  return unwrapSuccess(data, "No purchases data")
}

/** Stub wallet credit (dev). `POST /tokens/stub/credit` */
export async function postStubTokenCredit(body: StubTokenCreditRequest): Promise<StubTokenCreditData> {
  const { data } = await apiClient.post<SuccessEnvelope<StubTokenCreditData>>(
    API_ENDPOINTS.tokensStubCredit,
    body,
  )
  return unwrapSuccess(data, "No stub credit data")
}
