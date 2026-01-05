"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useVarianceInsights } from "@/hooks/useVarianceInsights"

export function Overview() {
  const { data, isLoading, error, source } = useVarianceInsights()

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.reduce((acc: Array<{ name: string; planned: number; actual: number }>, item) => {
      const existing = acc.find((entry) => entry.name === item.period)
      if (existing) {
        existing.planned += item.planned
        existing.actual += item.actual
      } else {
        acc.push({
          name: item.period,
          planned: item.planned,
          actual: item.actual,
        })
      }
      return acc
    }, [])
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance overview</CardTitle>
        <CardDescription>Planned vs. actual values across recent periods.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {isLoading && <div className="text-sm text-muted-foreground">Loading performance trend...</div>}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Unable to load trend data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && chartData.length === 0 && (
          <Alert>
            <AlertTitle>No trend data available</AlertTitle>
            <AlertDescription>Connect a data source to populate the overview.</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && chartData.length > 0 && (
          <>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Legend />
                <Bar dataKey="planned" fill="#8884d8" name="Planned" />
                <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 text-xs text-muted-foreground">
              Data source: {source === "supabase" ? "Live" : "Baseline"}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
