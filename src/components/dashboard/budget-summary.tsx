"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useBudgets } from "@/hooks/useBudgets"

export function BudgetSummary() {
  const { data: budgets, isLoading, error, source } = useBudgets()

  const budgetData = useMemo(() => {
    if (!budgets || budgets.length === 0) return []
    const grouped = budgets.reduce((acc: Record<string, number>, budget) => {
      acc[budget.type] = (acc[budget.type] || 0) + budget.amount
      return acc
    }, {})

    const palette = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

    return Object.entries(grouped).map(([name, value], index) => ({
      name,
      value,
      color: palette[index % palette.length],
    }))
  }, [budgets])

  const progressData = useMemo(() => {
    if (!budgets || budgets.length === 0) return []
    return budgets.map((budget) => ({
      name: budget.name,
      progress: Math.round(budget.progress),
      total: budget.amount,
      current: Math.round((budget.amount * budget.progress) / 100),
    }))
  }, [budgets])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Budget distribution</CardTitle>
          <CardDescription>Allocation by budget category.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-sm text-muted-foreground">Loading budget distribution...</div>}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Unable to load budgets</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && budgetData.length === 0 && (
            <Alert>
              <AlertTitle>No budget data</AlertTitle>
              <AlertDescription>Connect a data source or seed baseline budgets.</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && budgetData.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget progress</CardTitle>
          <CardDescription>Execution progress against approved budgets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && <div className="text-sm text-muted-foreground">Loading budget progress...</div>}

          {!isLoading && !error && progressData.length === 0 && (
            <Alert>
              <AlertTitle>No budget data</AlertTitle>
              <AlertDescription>Connect a data source or seed baseline budgets.</AlertDescription>
            </Alert>
          )}

          {!isLoading &&
            !error &&
            progressData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ${item.current.toLocaleString()} / ${item.total.toLocaleString()}
                  </span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
          <div className="text-xs text-muted-foreground">Data source: {source === "supabase" ? "Live" : "Baseline"}</div>
        </CardContent>
      </Card>
    </div>
  )
}
