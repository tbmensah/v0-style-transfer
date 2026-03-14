"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Plus, X, FileText, File, HelpCircle } from "lucide-react"

interface FilePair {
  id: number
  pdf: File | null
  esx: File | null
}

export default function NewFastFillPage() {
  const [filePairs, setFilePairs] = useState<FilePair[]>([{ id: 1, pdf: null, esx: null }])

  const addFilePair = () => {
    setFilePairs([...filePairs, { id: Date.now(), pdf: null, esx: null }])
  }

  const removeFilePair = (id: number) => {
    if (filePairs.length > 1) {
      setFilePairs(filePairs.filter((pair) => pair.id !== id))
    }
  }

  const handleFileChange = (id: number, type: "pdf" | "esx", file: File | null) => {
    setFilePairs(filePairs.map((pair) => (pair.id === id ? { ...pair, [type]: file } : pair)))
  }

  const validPairs = filePairs.filter((pair) => pair.pdf && pair.esx).length
  const tokenCost = validPairs

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">New Fast Fill Project</h1>
        <p className="mt-1 text-muted-foreground">Upload PDF + ESX file pairs to generate estimate-ready outputs</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* File Pairs */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">File Pairs</CardTitle>
              <CardDescription>Each row represents one job. Upload a PDF and its corresponding ESX file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {filePairs.map((pair, index) => (
                <div key={pair.id} className="relative rounded-lg border border-border bg-background p-6">
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
                      <label className="mb-2 block text-sm font-medium text-foreground">Upload PDF</label>
                      <p className="mb-2 text-xs text-muted-foreground">Claim document (PDF)</p>
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-6 transition-colors hover:border-primary/50 hover:bg-secondary/50">
                        {pair.pdf ? (
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="truncate max-w-[150px]">{pair.pdf.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Drag and drop or click to browse</span>
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
                      <label className="mb-2 block text-sm font-medium text-foreground">Upload ESX</label>
                      <p className="mb-2 text-xs text-muted-foreground">XactAnalysis file (ESX)</p>
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-6 transition-colors hover:border-primary/50 hover:bg-secondary/50">
                        {pair.esx ? (
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <File className="h-5 w-5 text-primary" />
                            <span className="truncate max-w-[150px]">{pair.esx.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Drag and drop or click to browse</span>
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
                </div>
              ))}
              <Button variant="outline" onClick={addFilePair} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add Another File Pair
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submission Summary */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Submission Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Number of jobs</span>
                <span className="font-medium text-foreground">{filePairs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Token cost per job</span>
                <span className="font-medium text-foreground">1 FF</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Total cost</span>
                  <span className="font-bold text-foreground">{tokenCost} FF tokens</span>
                </div>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current balance</span>
                  <Badge variant="secondary">24 FF</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">After submission</span>
                  <span className="font-medium text-foreground">{24 - tokenCost} FF</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button className="flex-1" disabled={validPairs === 0}>
                  Submit {validPairs > 0 ? `${validPairs} Job${validPairs > 1 ? "s" : ""}` : ""}
                </Button>
              </div>
              <Link href="/fast-fill">
                <Button variant="ghost" className="w-full">Cancel</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Need Help?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Each job requires one PDF document and one corresponding ESX file from XactAnalysis.
                  </p>
                  <Link href="/support" className="mt-2 inline-block text-sm text-primary hover:underline">
                    Learn more about file requirements
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
