"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AnalysisResultCard } from "@/components/scenarios/analysis-result-card"
import { useAIAgent } from "@/hooks/useAIAgent"
import { Activity, ArrowRight, Database, ShieldCheck } from "lucide-react"
import type { KPI } from "@/types/analytics"
import type { AIAgentCoverage, AIAgentRunStatus, AIAgentRiskLevel, AIAgentDataSourceStatus } from "@/types/ai-agent"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})
const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })
const percentFormatter = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 })
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
})

const formatKpiValue = (kpi: KPI) => {
  if (kpi.format === "currency") return currencyFormatter.format(kpi.value)
  if (kpi.format === "percent") return percentFormatter.format(kpi.value)
  return numberFormatter.format(kpi.value)
}

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

const sourceClasses: Record<AIAgentDataSourceStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  degraded: "bg-amber-50 text-amber-700 border border-amber-200",
  offline: "bg-rose-50 text-rose-700 border border-rose-200",
}

const coverageTrend = (trend: AIAgentCoverage["trend"]) => {
  if (trend === "up") return "text-emerald-600"
  if (trend === "down") return "text-rose-600"
  return "text-slate-500"
}

const formatLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

export default function AutomatedFinancialIntelligencePage() {
  const { data, kpis, alerts, recommendations, trends, isLoading, error, source } = useAIAgent()

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const throughputData = trends.map((point) => ({ name: point.label, runs: point.value }))

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col xl:flex-row justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Automated Financial Intelligence</h1>
            <Badge className="bg-slate-900 text-white">Enterprise</Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Autonomous decision support for finance operations with audit-ready outputs, continuous monitoring, and
            policy-aligned recommendations.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              Decision Support Engine
            </Badge>
            <Badge variant="outline" className="text-xs">
              Operational data fabric
            </Badge>
            <Badge variant="outline" className="text-xs">
              Governance-ready telemetry
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/ai-dashboard">
              <Activity className="h-4 w-4 mr-2" />
              Intelligence operations
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Governance
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <AnalysisResultCard
            key={kpi.id}
            title={kpi.label}
            value={formatKpiValue(kpi)}
            type={kpi.status === "risk" ? "negative" : kpi.status === "warning" ? "neutral" : "positive"}
            description={source === "baseline" ? "Baseline mode" : "Live data"}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Intelligence run queue</CardTitle>
            <CardDescription>Active and queued workflows with live telemetry.</CardDescription>
          </CardHeader>
          <CardContent>
            {data.runs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No automated runs are active right now.</p>
            ) : (
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Run</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Dataset</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Impact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.runs.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell>
                          <div className="font-medium">{run.name}</div>
                          <div className="text-xs text-muted-foreground">{run.category}</div>
                        </TableCell>
                        <TableCell>{run.owner}</TableCell>
                        <TableCell>
                          <div className="text-sm">{run.dataset}</div>
                          <div className="text-xs text-muted-foreground">{run.confidence}% confidence</div>
                        </TableCell>
                        <TableCell className="text-sm">{formatTimestamp(run.startedAt)}</TableCell>
                        <TableCell className="text-sm">
                          {formatDuration(run.status, run.durationMinutes, run.etaMinutes)}
                        </TableCell>
                        <TableCell className="text-sm">{currencyFormatter.format(run.savingsImpact)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <Badge className={statusClasses[run.status]}>{formatLabel(run.status)}</Badge>
                            <Badge className={riskClasses[run.riskLevel]}>{formatLabel(run.riskLevel)} risk</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/scenarios/${run.id}`}>
                              View
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk signals</CardTitle>
            <CardDescription>Highlights that require analyst review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active signals.</p>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="rounded-md border p-3 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{alert.title}</p>
                    <Badge
                      className={
                        alert.level === "risk"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : alert.level === "warning"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-50 text-slate-600 border border-slate-200"
                      }
                    >
                      {alert.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sources">
        <TabsList className="mb-4">
          <TabsTrigger value="sources">
            <Database className="h-4 w-4 mr-2" />
            Data sources
          </TabsTrigger>
          <TabsTrigger value="coverage">
            <Activity className="h-4 w-4 mr-2" />
            Coverage map
          </TabsTrigger>
          <TabsTrigger value="capabilities">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Capabilities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.dataSources.map((source) => (
              <Card key={source.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{source.name}</CardTitle>
                  <CardDescription>{source.system}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <Badge className={sourceClasses[source.status]}>{source.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last sync</span>
                    <span>{formatTimestamp(source.lastSync)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Records</span>
                    <span>{numberFormatter.format(source.records)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Latency</span>
                    <span>{source.latencyMs} ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Freshness</span>
                    <span>{source.freshnessMinutes} min</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coverage" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Operational coverage</CardTitle>
              <CardDescription>Domain coverage across finance workstreams.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.coverage.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.domain}</span>
                    <span className={coverageTrend(item.trend)}>
                      {item.percent}% {item.trend === "up" ? "up" : item.trend === "down" ? "down" : "steady"}
                    </span>
                  </div>
                  <Progress value={item.percent} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capabilities" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.capabilities.map((capability) => (
              <Card key={capability.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{capability.name}</CardTitle>
                  <CardDescription>{capability.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Maturity</span>
                    <Badge
                      className={
                        capability.maturity === "production"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : capability.maturity === "pilot"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-50 text-slate-600 border border-slate-200"
                      }
                    >
                      {capability.maturity}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Coverage</span>
                      <span>{capability.coveragePercent}%</span>
                    </div>
                    <Progress value={capability.coveragePercent} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly throughput</CardTitle>
            <CardDescription>Automated runs completed per week.</CardDescription>
          </CardHeader>
          <CardContent>
            {throughputData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No throughput data available.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={throughputData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="runs" name="Runs" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Executive recommendations</CardTitle>
            <CardDescription>High-impact actions prioritized by the intelligence engine.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recommendations available.</p>
            ) : (
              recommendations.map((rec) => (
                <div key={rec.id} className="rounded-md border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{rec.title}</p>
                    {rec.impact && (
                      <Badge
                        className={
                          rec.impact === "high"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : rec.impact === "medium"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }
                      >
                        {rec.impact} impact
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
