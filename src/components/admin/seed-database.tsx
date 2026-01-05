"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Database, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SeedDatabase() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysesLoading, setAnalysesLoading] = useState(false)
  const [analysesSuccess, setAnalysesSuccess] = useState(false)
  const [analysesError, setAnalysesError] = useState<string | null>(null)

  const handleSeedDatabase = async () => {
    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      const response = await fetch("/api/seed")
      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.message || "Database initialization failed.")
      }
    } catch (err) {
      setError("Database initialization failed.")
      console.error("Error seeding database:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSeedAnalyses = async () => {
    setAnalysesLoading(true)
    setAnalysesSuccess(false)
    setAnalysesError(null)

    try {
      const response = await fetch("/api/seed-analyses")
      const data = await response.json()

      if (response.ok) {
        setAnalysesSuccess(true)
      } else {
        setAnalysesError(data.message || "Analysis initialization failed.")
      }
    } catch (err) {
      setAnalysesError("Analysis initialization failed.")
      console.error("Error seeding analyses:", err)
    } finally {
      setAnalysesLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Initialize core data</CardTitle>
          <CardDescription>
            Seed the workspace with baseline products, budgets, costs, and accounting entries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4 bg-emerald-50 text-emerald-800 border-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Core data has been initialized successfully.</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert className="mb-4 bg-rose-50 text-rose-800 border-rose-200" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <p className="text-sm text-muted-foreground">
            This action will overwrite existing data with baseline operational records.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSeedDatabase} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Database className={`mr-2 h-4 w-4 ${loading ? "hidden" : ""}`} />
            {loading ? "Initializing..." : "Initialize data"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Initialize analysis library</CardTitle>
          <CardDescription>Seed the workspace with baseline variance and optimization analyses.</CardDescription>
        </CardHeader>
        <CardContent>
          {analysesSuccess && (
            <Alert className="mb-4 bg-emerald-50 text-emerald-800 border-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Analysis records have been initialized successfully.</AlertDescription>
            </Alert>
          )}
          {analysesError && (
            <Alert className="mb-4 bg-rose-50 text-rose-800 border-rose-200" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{analysesError}</AlertDescription>
            </Alert>
          )}
          <p className="text-sm text-muted-foreground">
            Creates variance, optimization, trend, and distribution analyses for baseline workflows.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSeedAnalyses} disabled={analysesLoading}>
            {analysesLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Database className={`mr-2 h-4 w-4 ${analysesLoading ? "hidden" : ""}`} />
            {analysesLoading ? "Initializing..." : "Initialize analyses"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
