"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { useVarianceInsights } from "@/hooks/useVarianceInsights"
import { AnalysisResultCard } from "@/components/scenarios/analysis-result-card"

export function VarianceAnalysis() {
  const { data, kpis, alerts, recommendations, isLoading, error, source } = useVarianceInsights()

  const varianceData = useMemo(
    () =>
      data.map((record) => ({
        ...record,
        varianceLabel: record.variancePercent >= 0 ? "Above plan" : "Below plan",
      })),
    [data],
  )

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading variance intelligence...</div>
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
            type={kpi.value >= 0 ? "positive" : "negative"}
            description={source === "baseline" ? "Baseline mode" : "Live data"}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Planned vs. actual</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={varianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar name="Planned" dataKey="planned" fill="#8884d8" />
                <Bar name="Actual" dataKey="actual" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Variance percentage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={varianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis unit="%" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar name="Variance (%)" dataKey="variancePercent">
                  {varianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.variancePercent >= 0 ? "#22c55e" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Variance details</h3>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Planned</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Variance</TableHead>
                <TableHead className="text-right">Variance %</TableHead>
                <TableHead>Signal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {varianceData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell className="text-right">{item.planned.toLocaleString("en-US")}</TableCell>
                  <TableCell className="text-right">{item.actual.toLocaleString("en-US")}</TableCell>
                  <TableCell className={`text-right ${item.variance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {item.variance >= 0 ? "+" : ""}
                    {item.variance.toLocaleString("en-US")}
                  </TableCell>
                  <TableCell className={`text-right ${item.variancePercent >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {item.variancePercent >= 0 ? "+" : ""}
                    {item.variancePercent.toFixed(1)}%
                  </TableCell>
                  <TableCell>{item.varianceLabel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Action signals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Alerts</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                {alerts.map((alert) => (
                  <li key={alert.id}>{alert.description}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                {recommendations.map((rec) => (
                  <li key={rec.id}>{rec.description}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
