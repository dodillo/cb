"use client"

import { useCallback, useMemo } from "react"
import { useAnalyticsData } from "@/hooks/use-analytics-data"
import {
  baselineAlerts,
  baselineBudgets,
  baselineCosts,
  baselineKpis,
  baselineRecommendations,
  baselineScenarios,
  baselineTrends,
} from "@/lib/baseline-data"
import { getBudgets } from "@/lib/services/budget-service"
import { getCosts } from "@/lib/services/cost-service"
import { getScenarios } from "@/lib/services/scenario-service"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

type DashboardMetrics = {
  budgets: number
  costs: number
  scenarios: number
  totalBudget: number
  totalCost: number
}

const buildKpis = (metrics: DashboardMetrics): KPI[] => [
  { id: "dash-budget", label: "Total budget", value: metrics.totalBudget, format: "currency", trend: "up" },
  { id: "dash-costs", label: "Tracked costs", value: metrics.totalCost, format: "currency", trend: "up" },
  { id: "dash-scenarios", label: "Active intelligence runs", value: metrics.scenarios, format: "number", trend: "flat" },
]

const buildTrends = (_metrics: DashboardMetrics): TrendPoint[] => baselineTrends
const buildAlerts = (_metrics: DashboardMetrics): AlertSignal[] => baselineAlerts
const buildRecommendations = (_metrics: DashboardMetrics): Recommendation[] => baselineRecommendations

const buildBaseline = (): DashboardMetrics => ({
  budgets: baselineBudgets.length,
  costs: baselineCosts.length,
  scenarios: baselineScenarios.length,
  totalBudget: baselineBudgets.reduce((sum, budget) => sum + budget.amount, 0),
  totalCost: baselineCosts.reduce((sum, cost) => sum + cost.amount, 0),
})

export function useDashboardMetrics() {
  const baseline = useMemo(() => buildBaseline(), [])

  const fetcher = useCallback(async () => {
    const [budgets, costs, scenarios] = await Promise.all([getBudgets(), getCosts(), getScenarios()])
    return {
      budgets: budgets.length,
      costs: costs.length,
      scenarios: scenarios.length,
      totalBudget: budgets.reduce((sum, budget) => sum + budget.amount, 0),
      totalCost: costs.reduce((sum, cost) => sum + cost.amount, 0),
    }
  }, [])

  return useAnalyticsData<DashboardMetrics>({
    baseline,
    fetcher,
    buildKpis,
    buildTrends,
    buildAlerts,
    buildRecommendations,
  })
}
