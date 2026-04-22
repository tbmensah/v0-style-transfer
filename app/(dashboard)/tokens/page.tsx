"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/parse-api-error"
import { queryKeys } from "@/lib/api/query-keys"
import { postStubTokenCredit } from "@/lib/api/requests/tokens"
import { useTokenCatalog } from "@/lib/api/hooks/use-token-catalog"
import { useTokenPurchases } from "@/lib/api/hooks/use-token-purchases"
import { useMetricsContext } from "@/components/metrics-context"
import { hasApiBase } from "@/lib/environment/public-env"
import { formatCurrencyFromCents } from "@/lib/utilities/format-currency-cents"
import { formatJobTableDate } from "@/lib/utilities/format-job-table-date"
import { formatMetricCount } from "@/lib/utilities/metrics-display"
import type { TokenPurchaseItem, TokenPurchaseStatus } from "@/lib/types/tokens"
import { ListPagination } from "@/components/list-pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Upload, ClipboardList } from "lucide-react"

const expressEstimatePackages = [
  { tokens: 10, price: 699.90, perToken: "69.99" },
  { tokens: 25, price: 1574.75, perToken: "62.99", popular: true },
  { tokens: 50, price: 2799.50, perToken: "55.99" },
  { tokens: 100, price: 4899.00, perToken: "48.99" },
]

const PURCHASES_PAGE_SIZE = 20

function tokenTypeLabel(tokenType: TokenPurchaseItem["token_type"]) {
  return tokenType === "ff" ? "Fast Fill" : "Express Estimate"
}

function purchaseStatusBadgeVariant(
  status: TokenPurchaseStatus,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "completed") return "default"
  if (status === "failed") return "destructive"
  if (status === "refunded") return "outline"
  return "secondary"
}

export default function TokensPage() {
  const [selectedTab, setSelectedTab] = useState("fast-fill")
  const [purchasePage, setPurchasePage] = useState(1)
  const { data: catalog, isLoading: catalogLoading, isError: catalogError, error: catalogErr } =
    useTokenCatalog()
  const {
    data: purchasesData,
    isLoading: purchasesLoading,
    isError: purchasesError,
    error: purchasesErr,
    refetch: refetchPurchases,
  } = useTokenPurchases({
    page: purchasePage,
    page_size: PURCHASES_PAGE_SIZE,
  })
  const queryClient = useQueryClient()
  const { dashboard: dashboardMetrics, tokenLifetime: lifetimeQuery, refetchAll } = useMetricsContext()

  const stubCredit = useMutation({
    mutationFn: postStubTokenCredit,
    onSuccess: (data) => {
      toast.success(
        `Credited ${data.credited} ${data.token_type === "ff" ? "FF" : "EE"} token(s). FF balance: ${data.ff_balance}, EE balance: ${data.ee_balance}.`,
        { id: "stub-token-credit" },
      )
      void queryClient.invalidateQueries({ queryKey: queryKeys.metrics })
      void queryClient.invalidateQueries({ queryKey: queryKeys.tokensLifetime })
      void queryClient.invalidateQueries({ queryKey: ["api", "tokens", "purchases"] })
      void refetchAll()
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e), { id: "stub-token-credit" })
    },
  })

  const isStubPendingRow = (token_type: "ff" | "ee", amount: number) =>
    stubCredit.isPending &&
    stubCredit.variables?.token_type === token_type &&
    stubCredit.variables?.amount === amount

  const ffBalance = formatMetricCount(dashboardMetrics.data?.fast_fill_tokens, {
    isError: dashboardMetrics.isError,
    isLoading: dashboardMetrics.isLoading,
  })
  const eeBalance = formatMetricCount(dashboardMetrics.data?.express_estimate_tokens, {
    isError: dashboardMetrics.isError,
    isLoading: dashboardMetrics.isLoading,
  })
  const fastFillPackages = catalog?.packages ?? []

  const lifetimeCount = (n: number | undefined) =>
    formatMetricCount(n, {
      isError: lifetimeQuery.isError,
      isLoading: lifetimeQuery.isLoading,
    })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Token Wallet</h1>
        <p className="mt-1 text-muted-foreground">Manage your tokens and purchase more when needed</p>
      </div>

      {/* Token Balances */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-border/60 bg-card/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fast Fill Tokens</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Upload className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums text-foreground">
                {ffBalance === "—" ? "—" : ffBalance}
              </span>
              <span className="text-muted-foreground">tokens available</span>
            </div>
            <Button variant="outline" size="sm" className="mt-4 border-border/60" onClick={() => setSelectedTab("fast-fill")}>
              Buy More
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Express Estimate Tokens</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <ClipboardList className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums text-foreground">
                {eeBalance === "—" ? "—" : eeBalance}
              </span>
              <span className="text-muted-foreground">tokens available</span>
            </div>
            <Button variant="outline" size="sm" className="mt-4 border-border/60" onClick={() => setSelectedTab("express-estimate")}>
              Buy More
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Tokens */}
      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Purchase Tokens</CardTitle>
          <CardDescription>
            Select a token package to purchase. Volume discounts available. Stub checkout credits tokens immediately
            (dev; real Stripe later).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="fast-fill">Fast Fill</TabsTrigger>
              <TabsTrigger value="express-estimate">Express Estimate</TabsTrigger>
            </TabsList>
            <TabsContent value="fast-fill" className="mt-6">
              {!hasApiBase ? (
                <p className="text-sm text-muted-foreground">
                  Set <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_API_BASE_URL</code> to load
                  pricing from the API.
                </p>
              ) : catalogLoading ? (
                <p className="text-sm text-muted-foreground" aria-busy="true">
                  Loading packages…
                </p>
              ) : catalogError ? (
                <p className="text-sm text-destructive">{getApiErrorMessage(catalogErr)}</p>
              ) : fastFillPackages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No packages available.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {fastFillPackages.map((pkg) => {
                    const popular = pkg.tokens === 25
                    return (
                      <Card
                        key={pkg.tokens}
                        className={`relative border-border/60 bg-secondary/50 transition-all hover:bg-secondary/70 hover:shadow-lg ${
                          popular ? "ring-2 ring-primary shadow-md shadow-primary/10" : ""
                        }`}
                      >
                        {popular && (
                          <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 shadow-md shadow-primary/20">
                            Popular
                          </Badge>
                        )}
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold tabular-nums text-foreground">{pkg.tokens}</p>
                            <p className="text-sm text-muted-foreground">Tokens</p>
                            <p className="mt-2 text-sm text-muted-foreground">{pkg.product}</p>
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-2xl font-bold tabular-nums text-foreground">${pkg.total_usd}</p>
                            <p className="text-sm text-muted-foreground">${pkg.price_per_token_usd} per token</p>
                          </div>
                          <Button
                            className="mt-4 w-full gap-2 shadow-md shadow-primary/20"
                            disabled={stubCredit.isPending}
                            onClick={() =>
                              stubCredit.mutate({ token_type: "ff", amount: pkg.tokens })
                            }
                          >
                            {isStubPendingRow("ff", pkg.tokens) ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing…
                              </>
                            ) : (
                              "Select"
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
            <TabsContent value="express-estimate" className="mt-6">
              {!hasApiBase ? (
                <p className="text-sm text-muted-foreground">
                  Set <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_API_BASE_URL</code> to purchase
                  tokens.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {expressEstimatePackages.map((pkg) => (
                    <Card
                      key={pkg.tokens}
                      className={`relative border-border/60 bg-secondary/50 transition-all hover:bg-secondary/70 hover:shadow-lg ${
                        pkg.popular ? "ring-2 ring-primary shadow-md shadow-primary/10" : ""
                      }`}
                    >
                      {pkg.popular && (
                        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 shadow-md shadow-primary/20">
                          Popular
                        </Badge>
                      )}
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-foreground">{pkg.tokens}</p>
                          <p className="text-sm text-muted-foreground">Tokens</p>
                          <p className="mt-2 text-sm text-muted-foreground">Express Estimate</p>
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-2xl font-bold text-foreground">${pkg.price}</p>
                          <p className="text-sm text-muted-foreground">${pkg.perToken} per token</p>
                        </div>
                        <Button
                          className="mt-4 w-full gap-2 shadow-md shadow-primary/20"
                          disabled={stubCredit.isPending}
                          onClick={() =>
                            stubCredit.mutate({ token_type: "ee", amount: pkg.tokens })
                          }
                        >
                          {isStubPendingRow("ee", pkg.tokens) ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Processing…
                            </>
                          ) : (
                            "Select"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Purchase History */}
      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Purchase History</CardTitle>
          <CardDescription>Stripe token purchases for your account</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasApiBase ? (
            <p className="text-sm text-muted-foreground">
              Set <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_API_BASE_URL</code> to load
              purchase history.
            </p>
          ) : purchasesError ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive">{getApiErrorMessage(purchasesErr)}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => void refetchPurchases()}>
                Retry
              </Button>
            </div>
          ) : purchasesLoading ? (
            <p className="text-sm text-muted-foreground" aria-busy="true">
              Loading purchases…
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 text-center text-sm font-medium text-muted-foreground">Quantity</th>
                      <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {(purchasesData?.items ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                          No purchases yet.
                        </td>
                      </tr>
                    ) : (
                      (purchasesData?.items ?? []).map((row) => (
                        <tr key={row.id} className="transition-colors hover:bg-secondary/30">
                          <td className="py-4 text-sm text-foreground">{formatJobTableDate(row.created_at)}</td>
                          <td className="py-4">
                            <Badge variant={row.token_type === "ff" ? "default" : "secondary"}>
                              {row.token_type === "ff" ? (
                                <Upload className="mr-1 h-3 w-3" />
                              ) : (
                                <ClipboardList className="mr-1 h-3 w-3" />
                              )}
                              {tokenTypeLabel(row.token_type)}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <Badge variant={purchaseStatusBadgeVariant(row.status)} className="capitalize">
                              {row.status}
                            </Badge>
                          </td>
                          <td className="py-4 text-center text-sm tabular-nums text-foreground">
                            {row.tokens_purchased} tokens
                          </td>
                          <td className="py-4 text-right text-sm font-medium tabular-nums text-foreground">
                            {formatCurrencyFromCents(row.amount_cents, row.currency)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <ListPagination
                className="mt-6"
                page={purchasePage}
                totalItems={purchasesData?.total ?? 0}
                pageSize={PURCHASES_PAGE_SIZE}
                onPageChange={(p) => setPurchasePage(p)}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Token Usage Summary */}
      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Token Usage Summary</CardTitle>
          <CardDescription>Overview of your token consumption</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasApiBase ? (
            <p className="text-sm text-muted-foreground">
              Set <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_API_BASE_URL</code> to load
              lifetime totals.
            </p>
          ) : lifetimeQuery.isError ? (
            <p className="text-sm text-destructive">{getApiErrorMessage(lifetimeQuery.error)}</p>
          ) : lifetimeQuery.isLoading ? (
            <p className="text-sm text-muted-foreground" aria-busy="true">
              Loading…
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  { label: "Total FF Purchased", value: lifetimeQuery.data?.total_ff_purchased },
                  { label: "FF Tokens Used", value: lifetimeQuery.data?.ff_tokens_used },
                  { label: "Total EE Purchased", value: lifetimeQuery.data?.total_ee_purchased },
                  { label: "EE Tokens Used", value: lifetimeQuery.data?.ee_tokens_used },
                ] as const
              ).map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border/40 bg-secondary/50 p-4 text-center transition-colors hover:bg-secondary/70"
                >
                  <p className="text-2xl font-bold tabular-nums text-foreground">
                    {lifetimeCount(stat.value)}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
