"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, ClipboardList, CheckCircle } from "lucide-react"

const fastFillPackages = [
  { tokens: 10, price: 149.90, perToken: "14.99" },
  { tokens: 25, price: 337.25, perToken: "13.49", popular: true },
  { tokens: 50, price: 599.60, perToken: "11.99" },
  { tokens: 100, price: 1049.30, perToken: "10.49" },
]

const expressEstimatePackages = [
  { tokens: 10, price: 699.90, perToken: "69.99" },
  { tokens: 25, price: 1574.75, perToken: "62.99", popular: true },
  { tokens: 50, price: 2799.50, perToken: "55.99" },
  { tokens: 100, price: 4899.00, perToken: "48.99" },
]

const purchaseHistory = [
  { date: "Mar 1, 2024", type: "Fast Fill", quantity: 25, amount: 337.25 },
  { date: "Feb 15, 2024", type: "Express Estimate", quantity: 10, amount: 699.90 },
  { date: "Jan 20, 2024", type: "Fast Fill", quantity: 50, amount: 599.60 },
]

export default function TokensPage() {
  const [selectedTab, setSelectedTab] = useState("fast-fill")

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
              <span className="text-4xl font-bold text-foreground">24</span>
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
              <span className="text-4xl font-bold text-foreground">12</span>
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
          <CardDescription>Select a token package to purchase. Volume discounts available.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="fast-fill">Fast Fill</TabsTrigger>
              <TabsTrigger value="express-estimate">Express Estimate</TabsTrigger>
            </TabsList>
            <TabsContent value="fast-fill" className="mt-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {fastFillPackages.map((pkg) => (
                  <Card
                    key={pkg.tokens}
                    className={`relative border-border/60 bg-secondary/50 transition-all hover:bg-secondary/70 hover:shadow-lg ${
                      pkg.popular ? "ring-2 ring-primary shadow-md shadow-primary/10" : ""
                    }`}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 shadow-md shadow-primary/20">Popular</Badge>
                    )}
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-foreground">{pkg.tokens}</p>
                        <p className="text-sm text-muted-foreground">Tokens</p>
                        <p className="mt-2 text-sm text-muted-foreground">Fast Fill</p>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-2xl font-bold text-foreground">${pkg.price}</p>
                        <p className="text-sm text-muted-foreground">${pkg.perToken} per token</p>
                      </div>
                      <Button className="mt-4 w-full shadow-md shadow-primary/20">Select</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="express-estimate" className="mt-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {expressEstimatePackages.map((pkg) => (
                  <Card
                    key={pkg.tokens}
                    className={`relative border-border/60 bg-secondary/50 transition-all hover:bg-secondary/70 hover:shadow-lg ${
                      pkg.popular ? "ring-2 ring-primary shadow-md shadow-primary/10" : ""
                    }`}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 shadow-md shadow-primary/20">Popular</Badge>
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
                      <Button className="mt-4 w-full shadow-md shadow-primary/20">Select</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Purchase History */}
      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Purchase History</CardTitle>
          <CardDescription>Your recent token purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Quantity</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {purchaseHistory.map((purchase, index) => (
                  <tr key={index} className="transition-colors hover:bg-secondary/30">
                    <td className="py-4 text-sm text-foreground">{purchase.date}</td>
                    <td className="py-4">
                      <Badge variant={purchase.type === "Fast Fill" ? "default" : "secondary"}>
                        {purchase.type === "Fast Fill" ? <Upload className="mr-1 h-3 w-3" /> : <ClipboardList className="mr-1 h-3 w-3" />}
                        {purchase.type}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-foreground">{purchase.quantity} tokens</td>
                    <td className="py-4 text-right text-sm font-medium text-foreground">${purchase.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Token Usage Summary */}
      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Token Usage Summary</CardTitle>
          <CardDescription>Overview of your token consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total FF Purchased", value: 75 },
              { label: "FF Tokens Used", value: 51 },
              { label: "Total EE Purchased", value: 20 },
              { label: "EE Tokens Used", value: 8 },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border/40 bg-secondary/50 p-4 text-center transition-colors hover:bg-secondary/70">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
