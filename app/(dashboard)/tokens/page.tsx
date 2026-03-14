"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, ClipboardList, CheckCircle } from "lucide-react"

const fastFillPackages = [
  { tokens: 10, price: 49.99, perToken: "5.00" },
  { tokens: 25, price: 99.99, perToken: "4.00", popular: true },
  { tokens: 50, price: 179.99, perToken: "3.60" },
  { tokens: 100, price: 299.99, perToken: "3.00" },
]

const expressEstimatePackages = [
  { tokens: 10, price: 79.99, perToken: "8.00" },
  { tokens: 25, price: 174.99, perToken: "7.00", popular: true },
  { tokens: 50, price: 299.99, perToken: "6.00" },
  { tokens: 100, price: 499.99, perToken: "5.00" },
]

const purchaseHistory = [
  { date: "Mar 1, 2024", type: "Fast Fill", quantity: 25, amount: 99.99 },
  { date: "Feb 15, 2024", type: "Express Estimate", quantity: 10, amount: 79.99 },
  { date: "Jan 20, 2024", type: "Fast Fill", quantity: 50, amount: 179.99 },
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
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fast Fill Tokens</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">24</span>
              <span className="text-muted-foreground">tokens available</span>
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setSelectedTab("fast-fill")}>
              Buy More
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Express Estimate Tokens</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">12</span>
              <span className="text-muted-foreground">tokens available</span>
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setSelectedTab("express-estimate")}>
              Buy More
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Tokens */}
      <Card className="border-border bg-card">
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
                    className={`relative border-border bg-background transition-shadow hover:shadow-lg ${
                      pkg.popular ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">Popular</Badge>
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
                      <Button className="mt-4 w-full">Select</Button>
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
                    className={`relative border-border bg-background transition-shadow hover:shadow-lg ${
                      pkg.popular ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">Popular</Badge>
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
                      <Button className="mt-4 w-full">Select</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Purchase History */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Purchase History</CardTitle>
          <CardDescription>Your recent token purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Quantity</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {purchaseHistory.map((purchase, index) => (
                  <tr key={index}>
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
      <Card className="border-border bg-card">
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
              <div key={stat.label} className="rounded-lg border border-border bg-secondary p-4 text-center">
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
