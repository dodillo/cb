"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useBudgets } from "@/hooks/useBudgets"
import { usePerformanceKPIs } from "@/hooks/usePerformanceKPIs"
import { AnalysisResultCard } from "@/components/scenarios/analysis-result-card"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const scoreStatus = (score: number) => {
  if (score >= 80) return "success"
  if (score >= 60) return "warning"
  return "risk"
}

export function BudgetPerformance() {
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const { data: budgets, isLoading, error, source } = useBudgets()
  const { kpis } = usePerformanceKPIs()

  const performanceData = useMemo(
    () =>
      budgets.map((budget) => ({
        name: budget.name,
        score: Math.round(budget.progress),
        status: scoreStatus(budget.progress),
      })),
    [budgets],
  )

  const radarData = useMemo(() => {
    const avgProgress = budgets.length
      ? budgets.reduce((sum, budget) => sum + budget.progress, 0) / budgets.length
      : 0
    const accuracy = Math.min(100, 60 + avgProgress * 0.4)
    return [
      { subject: "Accuracy", Portfolio: Math.round(accuracy), fullMark: 100 },
      { subject: "Responsiveness", Portfolio: Math.round(70 + avgProgress * 0.2), fullMark: 100 },
      { subject: "Flexibility", Portfolio: Math.round(65 + avgProgress * 0.25), fullMark: 100 },
      { subject: "Efficiency", Portfolio: Math.round(75 + avgProgress * 0.15), fullMark: 100 },
      { subject: "Compliance", Portfolio: Math.round(80 + avgProgress * 0.1), fullMark: 100 },
    ]
  }, [budgets])

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading budget performance...</div>
  }

  if (budgets.length === 0) {
    return (
      <Alert>
        <AlertDescription>No budget data available yet.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <AnalysisResultCard
            key={kpi.id}
            title={kpi.label}
            value={
              kpi.format === "currency"
                ? kpi.value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
                : kpi.format === "percent"
                  ? `${(kpi.value * 100).toFixed(1)}%`
                  : kpi.value.toLocaleString("en-US")
            }
            type={kpi.status === "risk" ? "negative" : kpi.status === "warning" ? "neutral" : "positive"}
            description={source === "baseline" ? "Baseline mode" : "Live data"}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reporting period</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current quarter</SelectItem>
                <SelectItem value="previous">Previous quarter</SelectItem>
                <SelectItem value="year">Year-to-date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Portfolio view</TabsTrigger>
          <TabsTrigger value="detailed">Detailed review</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Portfolio performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="score"
                      nameKey="name"
                      label={({ name, score }) => `${name}: ${score}%`}
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Execution profile</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Portfolio" dataKey="Portfolio" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Portfolio summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {performanceData.map((budget) => (
                <Card key={budget.name}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{budget.name}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          budget.status === "success"
                            ? "bg-emerald-100 text-emerald-800"
                            : budget.status === "warning"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {budget.status === "success" ? "Healthy" : budget.status === "warning" ? "Watch" : "Risk"}
                      </span>
                    </div>
                    <div className="mt-4 text-3xl font-bold">{budget.score}%</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {budget.score >= 80
                        ? "On track for targets."
                        : budget.score >= 60
                          ? "Requires targeted adjustments."
                          : "Requires immediate intervention."}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6 mt-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Detailed budget review</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Strengths</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>Execution is aligned with portfolio targets.</li>
                    <li>Variance monitoring cadence is consistent.</li>
                    <li>Forecast updates remain within target range.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Focus areas</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>Increase responsiveness to market demand shifts.</li>
                    <li>Improve allocation accuracy for growth programs.</li>
                    <li>Strengthen cost governance in underperforming units.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Recommended actions</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Establish a bi-weekly reforecast cadence.</li>
                  <li>Align cross-functional owners on variance remediation.</li>
                  <li>Track execution velocity against strategic milestones.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
