"use client"

import { useCallback, useMemo } from "react"
import { useAnalyticsData } from "@/hooks/use-analytics-data"
import { baselineBudgets, baselineKpis, baselineTrends, baselineAlerts, baselineRecommendations } from "@/lib/baseline-data"
import { getBudgets } from "@/lib/services/budget-service"
import type { BudgetSummary } from "@/types/finance"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

const mapBaselineBudgets = (): BudgetSummary[] =>
  baselineBudgets.map((budget) => ({
    id: budget.id,
    name: budget.name,
    type: budget.type,
    period: budget.period,
    startDate: budget.start_date,
    endDate: budget.end_date,
    amount: budget.amount,
    progress: budget.progress,
    status: budget.status,
    method: budget.method,
    description: budget.description,
    createdAt: budget.created_at,
  }))

const mapSupabaseBudgets = (budgets: Awaited<ReturnType<typeof getBudgets>>): BudgetSummary[] =>
  budgets.map((budget) => ({
    id: budget.id,
    name: budget.name,
    type: budget.type,
    period: budget.period,
    startDate: budget.start_date,
    endDate: budget.end_date,
    amount: budget.amount,
    progress: budget.progress ?? 0,
    status: (budget.status || "active") as BudgetSummary["status"],
    method: budget.method,
    description: budget.description || undefined,
    createdAt: budget.created_at || undefined,
  }))

const buildKpis = (budgets: BudgetSummary[]): KPI[] => {
  const total = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const avgProgress = budgets.length
    ? budgets.reduce((sum, budget) => sum + budget.progress, 0) / budgets.length
    : 0
  const active = budgets.filter((budget) => budget.status === "active").length

  return [
    { id: "budgets-total", label: "Total budgeted", value: total, format: "currency", trend: "up", status: "success" },
    { id: "budgets-active", label: "Active budgets", value: active, format: "number", trend: "flat", status: "warning" },
    { id: "budgets-progress", label: "Average progress", value: avgProgress, format: "percent", trend: "up", status: "success" },
  ]
}

const buildTrends = (_budgets: BudgetSummary[]): TrendPoint[] => baselineTrends

const buildAlerts = (budgets: BudgetSummary[]): AlertSignal[] => {
  if (budgets.length === 0) return baselineAlerts
  const stalled = budgets.some((budget) => budget.progress < 20 && budget.status === "active")
  return stalled
    ? [
        {
          id: "budget-stall",
          level: "warning",
          title: "Slow execution pace",
          description: "Several active budgets are below 20% utilization.",
        },
      ]
    : baselineAlerts
}

const buildRecommendations = (_budgets: BudgetSummary[]): Recommendation[] => baselineRecommendations

export function useBudgets() {
  const baseline = useMemo(() => mapBaselineBudgets(), [])

  const fetcher = useCallback(async () => {
    const data = await getBudgets()
    return mapSupabaseBudgets(data)
  }, [])

  return useAnalyticsData<BudgetSummary[]>({
    baseline,
    fetcher,
    buildKpis,
    buildTrends,
    buildAlerts,
    buildRecommendations,
  })
}
