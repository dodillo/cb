"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Database, ShieldCheck, Sparkles } from "lucide-react"
import { useAIAgent } from "@/hooks/useAIAgent"
import type { AIAgentCheckpointStatus, AIAgentRiskLevel, AIAgentRun, AIAgentRunStatus } from "@/types/ai-agent"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})
const percentFormatter = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 })
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
})

const formatTimestamp = (value: string) => `${dateFormatter.format(new Date(value))} UTC`

const formatDuration = (status: AIAgentRunStatus, durationMinutes: number, etaMinutes?: number) => {
  if (status === "queued") {
    return etaMinutes ? `ETA ${etaMinutes}m` : "Queued"
  }
  if (durationMinutes < 60) return `${durationMinutes}m`
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  return `${hours}h ${minutes}m`
}

const statusClasses: Record<AIAgentRunStatus, string> = {
  running: "bg-blue-100 text-blue-700 border border-blue-200",
  queued: "bg-amber-100 text-amber-700 border border-amber-200",
  completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  review: "bg-violet-100 text-violet-700 border border-violet-200",
  failed: "bg-rose-100 text-rose-700 border border-rose-200",
}

const riskClasses: Record<AIAgentRiskLevel, string> = {
  low: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  high: "bg-rose-50 text-rose-700 border border-rose-200",
}

const checkpointClasses: Record<AIAgentCheckpointStatus, string> = {
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  running: "bg-blue-50 text-blue-700 border border-blue-200",
  queued: "bg-amber-50 text-amber-700 border border-amber-200",
  blocked: "bg-rose-50 text-rose-700 border border-rose-200",
}

const formatLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const buildMetrics = (run: AIAgentRun) => [
  { label: "Confidence", value: percentFormatter.format(run.confidence / 100) },
  { label: "Savings impact", value: currencyFormatter.format(run.savingsImpact) },
  { label: "Coverage", value: `${run.coveragePercent}%` },
]

export default function AIAgentRunDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data, isLoading, error } = useAIAgent()

  const run = useMemo(() => data.runs.find((item) => item.id === params.id) ?? null, [data.runs, params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !run) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" size="icon" onClick={() => router.push("/scenarios")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error || "Run not found. Return to the intelligence queue to continue."}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.push("/scenarios")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{run.name}</h1>
            <p className="text-sm text-muted-foreground">{run.category}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={statusClasses[run.status]}>{formatLabel(run.status)}</Badge>
          <Badge className={riskClasses[run.riskLevel]}>{formatLabel(run.riskLevel)} risk</Badge>
          <Badge variant="outline">Intelligence run</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Executive summary</CardTitle>
            <CardDescription>Decision Support Engine findings for this run.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{run.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {buildMetrics(run).map((metric) => (
                <div key={metric.label} className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-lg font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Run coverage</span>
                <span>{run.coveragePercent}%</span>
              </div>
              <Progress value={run.coveragePercent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Run metadata</CardTitle>
            <CardDescription>Operational context for this execution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Owner</span>
              <span>{run.owner}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Dataset</span>
              <span>{run.dataset}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Started</span>
              <span>{formatTimestamp(run.startedAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Duration</span>
              <span>{formatDuration(run.status, run.durationMinutes, run.etaMinutes)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Confidence</span>
              <span>{run.confidence}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Savings impact</span>
              <span>{currencyFormatter.format(run.savingsImpact)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Execution checkpoints</CardTitle>
          <CardDescription>Operational stages and their current state.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {run.checkpoints.map((checkpoint) => (
            <div key={checkpoint.id} className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm font-medium">{checkpoint.label}</span>
              <Badge className={checkpointClasses[checkpoint.status]}>{formatLabel(checkpoint.status)}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Tabs defaultValue="signals">
        <TabsList className="mb-4">
          <TabsTrigger value="signals">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Signals
          </TabsTrigger>
          <TabsTrigger value="actions">
            <Sparkles className="h-4 w-4 mr-2" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="coverage">
            <Database className="h-4 w-4 mr-2" />
            Data coverage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signals" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Risk and variance signals</CardTitle>
              <CardDescription>Signals emitted during the run.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {run.signals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No signals available.</p>
              ) : (
                run.signals.map((signal) => (
                  <div key={signal.id} className="rounded-md border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{signal.title}</p>
                      <Badge
                        className={
                          signal.level === "risk"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : signal.level === "warning"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-50 text-slate-600 border border-slate-200"
                        }
                      >
                        {signal.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{signal.description}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Recommended actions</CardTitle>
              <CardDescription>Operational actions prioritized by impact.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {run.actions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No actions available.</p>
              ) : (
                run.actions.map((action) => (
                  <div key={action.id} className="rounded-md border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{action.title}</p>
                      {action.impact && (
                        <Badge
                          className={
                            action.impact === "high"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : action.impact === "medium"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }
                        >
                          {action.impact} impact
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Coverage breakdown</CardTitle>
              <CardDescription>Coverage mapped to operational domains.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {run.coverageBreakdown.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.domain}</span>
                    <span>{item.percent}%</span>
                  </div>
                  <Progress value={item.percent} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
