"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Home, Droplets, Zap } from "lucide-react"

import { ExteriorTab, FoundationTab, InteriorTab } from "./tabs"
import { useEstimateForm } from "./hooks/use-estimate-form"
import type { ProjectDetails, ExteriorState, FoundationState, Room } from "./types"

export default function NewEstimatePage() {
  const [activeTab, setActiveTab] = useState("exterior")
  
  const {
    projectDetails,
    setProjectDetails,
    exterior,
    setExterior,
    foundation,
    setFoundation,
    rooms,
    addRoom,
    updateRoom,
    removeRoom,
    duplicateRoom,
    handleSave
  } = useEstimateForm()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/express-estimate" className="text-sm text-muted-foreground hover:text-foreground">
              &larr; Back to Estimates
            </Link>
            <div className="h-4 w-px bg-border/60" />
            <h1 className="text-lg font-semibold text-foreground">New Express Estimate</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm text-primary">
              <CheckCircle className="h-4 w-4" />
              Auto-saving
            </span>
            <Button variant="outline" size="sm">
              Preview
            </Button>
            <Button size="sm">
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="space-y-6">
          {/* Project Details Card */}
          <Card className="border-border/60 bg-card/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-foreground">Project Details</CardTitle>
              <CardDescription>Basic information about the property and claim</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="claimNumber" className="text-foreground">Claim Number</Label>
                  <Input
                    id="claimNumber"
                    placeholder="CLM-2024-XXXXX"
                    value={projectDetails.claimNumber}
                    onChange={(e) => { setProjectDetails({ ...projectDetails, claimNumber: e.target.value }); handleSave() }}
                    className="border-border/60 bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspectionDate" className="text-foreground">Inspection Date</Label>
                  <Input
                    id="inspectionDate"
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={projectDetails.inspectionDate}
                    onChange={(e) => { setProjectDetails({ ...projectDetails, inspectionDate: e.target.value }); handleSave() }}
                    className="border-border/60 bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType" className="text-foreground">Property Type</Label>
                  <Select value={projectDetails.propertyType} onValueChange={(value) => { setProjectDetails({ ...projectDetails, propertyType: value }); handleSave() }}>
                    <SelectTrigger className="border-border/60 bg-secondary/50">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dwelling">Dwelling</SelectItem>
                      <SelectItem value="general-property">General Property</SelectItem>
                      <SelectItem value="rcbap">RCBAP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyAddress" className="text-foreground">Property Address</Label>
                <Input
                  id="propertyAddress"
                  placeholder="123 Main St, City, State ZIP"
                  value={projectDetails.propertyAddress}
                  onChange={(e) => { setProjectDetails({ ...projectDetails, propertyAddress: e.target.value }); handleSave() }}
                  className="border-border/60 bg-secondary/50"
                />
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 p-4">
                <Switch
                  checked={projectDetails.preFirm}
                  onCheckedChange={(checked) => { setProjectDetails({ ...projectDetails, preFirm: checked }); handleSave() }}
                />
                <div>
                  <Label className="text-foreground">Pre-FIRM Property</Label>
                  <p className="text-sm text-muted-foreground">Property built before flood insurance rate maps</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Damage Details Tabs */}
          <Card className="border-border/60 bg-card/80 shadow-md">
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="exterior" className="gap-2">
                    <Home className="h-4 w-4" />
                    Exterior
                  </TabsTrigger>
                  <TabsTrigger value="foundation" className="gap-2">
                    <Droplets className="h-4 w-4" />
                    Foundation
                  </TabsTrigger>
                  <TabsTrigger value="interior" className="gap-2">
                    <Zap className="h-4 w-4" />
                    Interior
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="exterior" className="mt-6 space-y-4">
                  <ExteriorTab
                    exterior={exterior}
                    setExterior={setExterior}
                    handleSave={handleSave}
                  />
                </TabsContent>

                <TabsContent value="foundation" className="mt-6 space-y-4">
                  <FoundationTab
                    foundation={foundation}
                    setFoundation={setFoundation}
                    handleSave={handleSave}
                  />
                </TabsContent>

                <TabsContent value="interior" className="mt-6 space-y-4">
                  <InteriorTab
                    rooms={rooms}
                    addRoom={addRoom}
                    updateRoom={updateRoom}
                    removeRoom={removeRoom}
                    duplicateRoom={duplicateRoom}
                    handleSave={handleSave}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
