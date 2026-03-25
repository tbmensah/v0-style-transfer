"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  Plus, 
  X, 
  FileText, 
  File, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle,
  Download,
  ArrowLeft,
  ArrowRight,
  Loader2
} from "lucide-react"

interface FilePair {
  id: number
  pdf: File | null
  esx: File | null
  selected: boolean
  status?: "pending" | "processing" | "completed" | "failed"
  progress?: number
}

type WorkflowStep = "upload" | "confirm" | "processing" | "complete"

export default function NewFastFillPage() {
  const [step, setStep] = useState<WorkflowStep>("upload")
  const [filePairs, setFilePairs] = useState<FilePair[]>([{ id: 1, pdf: null, esx: null, selected: true }])
  const [processingProgress, setProcessingProgress] = useState(0)

  const addFilePair = () => {
    setFilePairs([...filePairs, { id: Date.now(), pdf: null, esx: null, selected: true }])
  }

  const removeFilePair = (id: number) => {
    if (filePairs.length > 1) {
      setFilePairs(filePairs.filter((pair) => pair.id !== id))
    }
  }

  const handleFileChange = (id: number, type: "pdf" | "esx", file: File | null) => {
    setFilePairs(filePairs.map((pair) => (pair.id === id ? { ...pair, [type]: file } : pair)))
  }

  const toggleSelection = (id: number) => {
    setFilePairs(filePairs.map((pair) => (pair.id === id ? { ...pair, selected: !pair.selected } : pair)))
  }

  const validPairs = filePairs.filter((pair) => pair.pdf && pair.esx)
  const selectedPairs = validPairs.filter((pair) => pair.selected)
  const tokenCost = selectedPairs.length

  const handleProceedToConfirm = () => {
    if (validPairs.length > 0) {
      setStep("confirm")
    }
  }

  const handleStartProcessing = useCallback(() => {
    setStep("processing")
    setProcessingProgress(0)
    
    // Update all selected pairs to processing status
    setFilePairs(prev => prev.map(pair => 
      pair.selected && pair.pdf && pair.esx 
        ? { ...pair, status: "processing", progress: 0 } 
        : pair
    ))

    // Simulate processing with progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        
        // Mark all as completed
        setFilePairs(prev => prev.map(pair => 
          pair.status === "processing" 
            ? { ...pair, status: "completed", progress: 100 } 
            : pair
        ))
        
        setTimeout(() => setStep("complete"), 500)
      }
      setProcessingProgress(Math.min(progress, 100))
      
      // Update individual progress
      setFilePairs(prev => prev.map(pair => 
        pair.status === "processing" 
          ? { ...pair, progress: Math.min((pair.progress || 0) + Math.random() * 20, progress) } 
          : pair
      ))
    }, 500)
  }, [])

  const handleDownloadAll = () => {
    // Simulate download
    alert("Downloading all completed ESX files...")
  }

  const handleStartNew = () => {
    setStep("upload")
    setFilePairs([{ id: 1, pdf: null, esx: null, selected: true }])
    setProcessingProgress(0)
  }

  // Step indicator
  const steps = [
    { key: "upload", label: "Upload Files" },
    { key: "confirm", label: "Confirm" },
    { key: "processing", label: "Processing" },
    { key: "complete", label: "Complete" },
  ]

  const currentStepIndex = steps.findIndex(s => s.key === step)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">New Fast Fill Project</h1>
        <p className="mt-1 text-muted-foreground">Upload PDF + ESX file pairs to generate prelim-ready NFIP outputs</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((s, index) => (
          <div key={s.key} className="flex items-center">
            <div className={`flex items-center gap-2 ${index <= currentStepIndex ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                index < currentStepIndex 
                  ? "bg-primary text-primary-foreground" 
                  : index === currentStepIndex 
                    ? "bg-primary/20 text-primary ring-2 ring-primary" 
                    : "bg-secondary text-muted-foreground"
              }`}>
                {index < currentStepIndex ? <CheckCircle className="h-4 w-4" /> : index + 1}
              </div>
              <span className="hidden text-sm font-medium sm:inline">{s.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`mx-4 h-0.5 w-12 sm:w-24 ${index < currentStepIndex ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step: Upload */}
      {step === "upload" && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border/60 bg-card/80 shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground">Upload File Pairs</CardTitle>
                <CardDescription>Each job requires one PDF claim document and one corresponding ESX file from XactAnalysis.</CardDescription>
                <div className="mt-3 rounded-lg border border-border/60 bg-secondary/30 p-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Supported PDF formats:</span> NFIP Proof of Loss, Preliminary Report, XactContents Export, Flood Damage Assessment
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {"Don't see your format? "}
                    <button 
                      type="button"
                      onClick={() => alert("Upload form for training would open here")}
                      className="font-medium text-primary hover:underline"
                    >
                      Upload a sample PDF
                    </button>
                    {" to help us add support for your documents."}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {filePairs.map((pair, index) => (
                  <div key={pair.id} className="relative rounded-lg border border-border/60 bg-secondary/30 p-6 transition-colors hover:bg-secondary/40">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">Job {index + 1}</h4>
                      {filePairs.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFilePair(pair.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* PDF Upload */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">Claim PDF</label>
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 bg-background/50 p-6 transition-all hover:border-primary/50 hover:bg-secondary/50">
                          {pair.pdf ? (
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <FileText className="h-5 w-5 text-primary" />
                              <span className="truncate max-w-[150px]">{pair.pdf.name}</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Drop PDF or click to browse</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => handleFileChange(pair.id, "pdf", e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                      {/* ESX Upload */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">XactAnalysis ESX</label>
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 bg-background/50 p-6 transition-all hover:border-primary/50 hover:bg-secondary/50">
                          {pair.esx ? (
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <File className="h-5 w-5 text-primary" />
                              <span className="truncate max-w-[150px]">{pair.esx.name}</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Drop ESX or click to browse</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept=".esx"
                            className="hidden"
                            onChange={(e) => handleFileChange(pair.id, "esx", e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                    </div>
                    {pair.pdf && pair.esx && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                        <CheckCircle className="h-4 w-4" />
                        <span>Ready for processing</span>
                      </div>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addFilePair} className="w-full gap-2 border-border/60">
                  <Plus className="h-4 w-4" />
                  Add Another File Pair
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-border/60 bg-card/80 shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total file pairs</span>
                  <span className="font-medium text-foreground">{filePairs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Valid pairs</span>
                  <span className="font-medium text-foreground">{validPairs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Token cost</span>
                  <span className="font-medium text-foreground">{validPairs.length} FF</span>
                </div>
                <div className="border-t border-border/60 pt-4">
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your balance</span>
                      <Badge variant="secondary">24 FF</Badge>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full gap-2 shadow-md shadow-primary/20" 
                  disabled={validPairs.length === 0}
                  onClick={handleProceedToConfirm}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link href="/fast-fill">
                  <Button variant="ghost" className="w-full">Cancel</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/80 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">How Fast Fill Works</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Upload your claim PDF and XactAnalysis ESX file. We&apos;ll extract the data and update your ESX to be prelim-ready.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Step: Confirm */}
      {step === "confirm" && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border/60 bg-card/80 shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground">Confirm Your Uploads</CardTitle>
                <CardDescription>Review and select the files you want to process. Uncheck any you want to skip.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {validPairs.map((pair, index) => (
                    <div 
                      key={pair.id} 
                      className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                        pair.selected 
                          ? "border-primary/40 bg-primary/5" 
                          : "border-border/60 bg-secondary/30 opacity-60"
                      }`}
                    >
                      <Checkbox 
                        checked={pair.selected} 
                        onCheckedChange={() => toggleSelection(pair.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/20">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1 grid gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground truncate">{pair.pdf?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground truncate">{pair.esx?.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/60 bg-card/80 shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground">Processing Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Selected jobs</span>
                  <span className="font-medium text-foreground">{selectedPairs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Token cost</span>
                  <span className="font-medium text-foreground">{tokenCost} FF</span>
                </div>
                <div className="border-t border-border/60 pt-4">
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current balance</span>
                      <Badge variant="secondary">24 FF</Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">After processing</span>
                      <span className="font-medium text-foreground">{24 - tokenCost} FF</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("upload")} className="flex-1 gap-2 border-border/60">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    className="flex-1 gap-2 shadow-md shadow-primary/20" 
                    disabled={selectedPairs.length === 0}
                    onClick={handleStartProcessing}
                  >
                    Process
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Step: Processing */}
      {step === "processing" && (
        <div className="mx-auto max-w-2xl space-y-6">
          <Card className="border-border/60 bg-card/80 shadow-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <CardTitle className="text-foreground">Processing Your Files</CardTitle>
              <CardDescription>Please wait while we process your uploads. This may take a few minutes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium text-foreground">{Math.round(processingProgress)}%</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
              </div>

              <div className="space-y-3">
                {selectedPairs.map((pair, index) => (
                  <div key={pair.id} className="flex items-center gap-4 rounded-lg border border-border/60 bg-secondary/30 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/20">
                      {pair.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : pair.status === "failed" ? (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Job {index + 1}: {pair.pdf?.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Progress value={pair.progress || 0} className="h-1 flex-1" />
                        <span className="text-xs text-muted-foreground">{Math.round(pair.progress || 0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step: Complete */}
      {step === "complete" && (
        <div className="mx-auto max-w-2xl space-y-6">
          <Card className="border-border/60 bg-card/80 shadow-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-foreground">Processing Complete</CardTitle>
              <CardDescription>Your ESX files are ready for download. Files are available for 14 days.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {selectedPairs.map((pair, index) => (
                  <div key={pair.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/20">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Job {index + 1}: {pair.pdf?.name?.replace(".pdf", "_prelim.esx")}</p>
                        <p className="text-xs text-muted-foreground">Ready for download</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/20">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleDownloadAll} className="flex-1 gap-2 border-border/60">
                  <Download className="h-4 w-4" />
                  Download All
                </Button>
                <Button className="flex-1 gap-2 shadow-md shadow-primary/20" onClick={handleStartNew}>
                  <Plus className="h-4 w-4" />
                  Start New Project
                </Button>
              </div>

              <div className="text-center">
                <Link href="/fast-fill" className="text-sm text-primary hover:underline">
                  View all Fast Fill jobs
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
