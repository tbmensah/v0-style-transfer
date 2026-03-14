import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Download, Clock, Shield, CheckCircle, Zap, ArrowRight, ClipboardList, Send, FileDown } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-secondary py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                  Faster Claims Estimating for Insurance Professionals
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Generate accurate NFIP estimates in minutes, not hours. Upload your files or enter site details, and receive estimate-ready ESX outputs powered by intelligent automation.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="gap-2">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      See How It Works
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Animation Preview */}
              <div className="relative">
                <Card className="border-border bg-card shadow-xl">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-muted-foreground">Processing Claim #2024-0892</div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">claim_document.pdf</div>
                            <div className="text-xs text-muted-foreground">Uploaded successfully</div>
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/20 p-3">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">Extracting claim data...</div>
                            <div className="text-xs text-muted-foreground">AI processing in progress</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 opacity-60">
                          <Download className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">output.esx</div>
                            <div className="text-xs text-muted-foreground">Waiting...</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Two Workflows Section */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Two Powerful Workflows
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the method that fits your workflow best
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              {/* Fast Fill Card */}
              <Card className="relative overflow-hidden border-border bg-card shadow-lg transition-shadow hover:shadow-xl">
                <CardHeader className="pb-4">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">Fast Fill</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    Upload PDF + ESX pairs, receive prelim-ready ESX outputs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">Batch upload multiple file pairs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">Automatic field extraction from PDFs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">Results in minutes, not hours</span>
                    </li>
                  </ul>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-sm font-medium text-foreground">Ideal for:</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Existing claim files that need quick estimate preparation
                    </p>
                  </div>
                  <Link href="/fast-fill" className="block">
                    <Button className="w-full gap-2">
                      Start Using Fast Fill
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Express Estimate Card */}
              <Card className="relative overflow-hidden border-border bg-card shadow-lg transition-shadow hover:shadow-xl">
                <CardHeader className="pb-4">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                    <ClipboardList className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">Express Estimate</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    Enter site details, receive complete estimate-ready ESX
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">Guided on-site data entry forms</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">Room-by-room interior details</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">Autosave keeps your progress safe</span>
                    </li>
                  </ul>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-sm font-medium text-foreground">Ideal for:</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Fresh inspections where you capture damage details on-site
                    </p>
                  </div>
                  <Link href="/express-estimate" className="block">
                    <Button className="w-full gap-2">
                      Start Using Express Estimate
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-secondary py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Simple, streamlined workflows designed for busy adjusters
              </p>
            </div>

            {/* Fast Fill Process */}
            <div className="mt-16">
              <h3 className="mb-8 text-xl font-semibold text-foreground">Fast Fill Process</h3>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { step: 1, icon: Upload, title: "Upload Files", description: "Pair your PDF claim documents with XactAnalysis ESX files" },
                  { step: 2, icon: Send, title: "Batch Submit", description: "Add multiple file pairs and submit them all at once" },
                  { step: 3, icon: Zap, title: "AI Processing", description: "Our system extracts data and fills required ESX fields" },
                  { step: 4, icon: FileDown, title: "Download", description: "Get your completed ESX files ready for review" },
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                        {item.step}
                      </div>
                      <h4 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Express Estimate Process */}
            <div className="mt-20">
              <h3 className="mb-8 text-xl font-semibold text-foreground">Express Estimate Process</h3>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { step: 1, icon: FileText, title: "Create Project", description: "Start a new estimate with claim and property details" },
                  { step: 2, icon: ClipboardList, title: "Enter Details", description: "Fill exterior, foundation, and interior damage info" },
                  { step: 3, icon: CheckCircle, title: "Review & Submit", description: "Check your entries and submit for processing" },
                  { step: 4, icon: Download, title: "Download ESX", description: "Receive your complete estimate-ready file" },
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                        {item.step}
                      </div>
                      <h4 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why Choose ClaimFlow
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Built for the way insurance professionals actually work
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Clock, title: "Save Time", description: "Generate estimates in minutes instead of hours of manual entry" },
                { icon: Shield, title: "Reduce Errors", description: "Structured inputs minimize mistakes and omissions" },
                { icon: CheckCircle, title: "Stay Secure", description: "Your data is encrypted and protected at all times" },
                { icon: Download, title: "Easy Output", description: "Download ESX files ready for XactAnalysis" },
              ].map((feature) => (
                <Card key={feature.title} className="border-border bg-card text-center">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-secondary py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Simple Token-Based Pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Pay only for what you use. No subscriptions, no hidden fees.
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              <Card className="border-border bg-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Fast Fill Tokens</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    1 token = 1 PDF + ESX pair processed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">
                    From $4.99<span className="text-base font-normal text-muted-foreground">/token</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">Volume discounts available</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Express Estimate Tokens</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    1 token = 1 complete estimate generated
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">
                    From $7.99<span className="text-base font-normal text-muted-foreground">/token</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">Volume discounts available</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Card className="mx-auto inline-block border-primary bg-primary/20 px-8 py-4">
                <p className="text-lg font-medium text-foreground">
                  Start Your Free Trial
                </p>
                <p className="text-muted-foreground">
                  Get 3 free tokens of each type when you sign up
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to Speed Up Your Estimates?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join hundreds of insurance professionals already saving time with ClaimFlow.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
