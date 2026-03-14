"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"

const exteriorServices = [
  { id: "pressure-wash", label: "Pressure Wash / Cleaning", description: "Include exterior cleaning services" },
  { id: "dumpster", label: "Dumpster / Debris Removal", description: "Include debris removal services" },
  { id: "insulation", label: "Insulation / Sheathing", description: "Include insulation and sheathing work" },
  { id: "hvac", label: "HVAC", description: "Include HVAC equipment and work" },
  { id: "electrical", label: "Electrical", description: "Include electrical work" },
  { id: "siding", label: "Siding / Exterior Paint", description: "Include siding and exterior paint work" },
  { id: "roofing", label: "Roofing", description: "Include roofing work" },
  { id: "windows", label: "Windows / Exterior Doors", description: "Include window and door work" },
]

export default function NewExpressEstimatePage() {
  const [formData, setFormData] = useState({
    projectName: "",
    claimNumber: "",
    inspectionDate: "",
    propertyAddress: "",
    propertyType: "",
    occupancyType: "",
    adjusterName: "",
    notes: "",
  })
  const [services, setServices] = useState<Record<string, boolean>>({})
  const [isSaved, setIsSaved] = useState(true)

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setIsSaved(false)
    // Simulate autosave
    setTimeout(() => setIsSaved(true), 1000)
  }

  const toggleService = (id: string) => {
    setServices({ ...services, [id]: !services[id] })
    setIsSaved(false)
    setTimeout(() => setIsSaved(true), 1000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">New Express Estimate</h1>
          <p className="mt-1 text-muted-foreground">Enter structured damage details to generate an estimate-ready ESX</p>
        </div>
        <div className="flex items-center gap-3">
          {isSaved ? (
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Saved
            </Badge>
          ) : (
            <Badge variant="outline">Saving...</Badge>
          )}
          <Button variant="outline">Save Draft</Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Project Details */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Project Details</CardTitle>
              <CardDescription>Enter the claim and property information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="projectName" className="text-foreground">
                    Project / Claim Name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., Johnson Residence - Water Damage"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange("projectName", e.target.value)}
                    className="border-input bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claimNumber" className="text-foreground">
                    Claim Number<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="claimNumber"
                    placeholder="e.g., CLM-2024-0892"
                    value={formData.claimNumber}
                    onChange={(e) => handleInputChange("claimNumber", e.target.value)}
                    className="border-input bg-background"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="inspectionDate" className="text-foreground">
                    Date of Inspection<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="inspectionDate"
                    type="date"
                    value={formData.inspectionDate}
                    onChange={(e) => handleInputChange("inspectionDate", e.target.value)}
                    className="border-input bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyAddress" className="text-foreground">
                    Property Address<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="propertyAddress"
                    placeholder="123 Main St, City, State ZIP"
                    value={formData.propertyAddress}
                    onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
                    className="border-input bg-background"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="propertyType" className="text-foreground">
                    Property Type<span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                    <SelectTrigger className="border-input bg-background">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-family">Single Family Home</SelectItem>
                      <SelectItem value="multi-family">Multi-Family</SelectItem>
                      <SelectItem value="condo">Condominium</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="mobile">Mobile Home</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupancyType" className="text-foreground">Occupancy Type</Label>
                  <Select value={formData.occupancyType} onValueChange={(value) => handleInputChange("occupancyType", value)}>
                    <SelectTrigger className="border-input bg-background">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner-occupied">Owner Occupied</SelectItem>
                      <SelectItem value="tenant-occupied">Tenant Occupied</SelectItem>
                      <SelectItem value="vacant">Vacant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adjusterName" className="text-foreground">Adjuster / Inspector Name</Label>
                <Input
                  id="adjusterName"
                  placeholder="Your name"
                  value={formData.adjusterName}
                  onChange={(e) => handleInputChange("adjusterName", e.target.value)}
                  className="border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-foreground">General Project Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about the claim or property..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="min-h-[100px] border-input bg-background"
                />
              </div>
            </CardContent>
          </Card>

          {/* Damage Details Tabs */}
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <Tabs defaultValue="exterior">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="exterior">Exterior</TabsTrigger>
                  <TabsTrigger value="foundation">Foundation</TabsTrigger>
                  <TabsTrigger value="interior">Interior</TabsTrigger>
                </TabsList>
                <TabsContent value="exterior" className="mt-6 space-y-4">
                  {exteriorServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                      <div>
                        <p className="font-medium text-foreground">{service.label}</p>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <Switch
                        checked={services[service.id] || false}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="foundation" className="mt-6">
                  <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-8 text-center">
                    <p className="text-muted-foreground">Foundation damage options will appear here</p>
                  </div>
                </TabsContent>
                <TabsContent value="interior" className="mt-6">
                  <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-8 text-center">
                    <p className="text-muted-foreground">Room-by-room interior details will appear here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Token cost</span>
                <Badge variant="secondary">12 EE tokens available</Badge>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/fast-fill">
                  <Button variant="outline" className="w-full">Cancel</Button>
                </Link>
                <Button className="w-full">Review & Submit</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
