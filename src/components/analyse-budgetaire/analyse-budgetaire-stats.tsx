"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart4, Calculator, LineChart, PieChart } from "lucide-react"
import { useAnalyses } from "@/hooks/use-analyses"
import { Skeleton } from "@/components/ui/skeleton"

export function AnalyseBudgetaireStats() {
  const { analyses, loading } = useAnalyses({ realtime: true })

  const getStats = () => {
    if (!analyses.length) {
      return {
        total: 0,
        byType: {
          variance: 0,
          optimization: 0,
          trend: 0,
          distribution: 0,
        },
        recentCount: 0,
      }
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    return {
      total: analyses.length,
      byType: {
        variance: analyses.filter((analysis) => analysis.type === "variance").length,
        optimization: analyses.filter((analysis) => analysis.type === "optimization").length,
        trend: analyses.filter((analysis) => analysis.type === "trend").length,
        distribution: analyses.filter((analysis) => analysis.type === "distribution").length,
      },
      recentCount: analyses.filter((analysis) => new Date(analysis.created_at || "") > oneWeekAgo).length,
    }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2 mb-1" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total analyses</CardTitle>
          <BarChart4 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">{stats.recentCount} new analyses this week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Variance intelligence</CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byType.variance}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.byType.variance / stats.total) * 100 || 0).toFixed(0)}% of total analyses
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trend analysis</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byType.trend}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.byType.trend / stats.total) * 100 || 0).toFixed(0)}% of total analyses
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distribution analysis</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byType.distribution}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.byType.distribution / stats.total) * 100 || 0).toFixed(0)}% of total analyses
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
