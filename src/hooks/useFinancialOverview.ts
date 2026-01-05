"use client"

import { useCallback, useMemo } from "react"
import { useAnalyticsData } from "@/hooks/use-analytics-data"
import {
  baselineAccountingEntries,
  baselineAlerts,
  baselineBudgets,
  baselineCosts,
  baselineRecommendations,
  baselineTrends,
} from "@/lib/baseline-data"
import { getAccountingEntries } from "@/lib/services/accounting-service"
import { getBudgets } from "@/lib/services/budget-service"
import { getCosts } from "@/lib/services/cost-service"
import type { AccountingEntry, BudgetSummary, CostItem } from "@/types/finance"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

type FinancialOverview = {
  budgets: BudgetSummary[]
  costs: CostItem[]
  entries: AccountingEntry[]
}

const buildBaseline = (): FinancialOverview => ({
  budgets: baselineBudgets.map((budget) => ({
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
  })),
  costs: baselineCosts.map((cost) => ({
    id: cost.id,
    productId: cost.product_id,
    productName: cost.product_name,
    costType: cost.cost_type,
    costCategory: cost.cost_category,
    amount: cost.amount,
    date: cost.date,
    description: cost.description,
  })),
  entries: baselineAccountingEntries.map((entry) => ({
    id: entry.id,
    date: entry.date,
    accountNumber: entry.account_number,
    accountName: entry.account_name,
    description: entry.description,
    debit: entry.debit,
    credit: entry.credit,
    type: entry.type,
    analyticalAxis: entry.analytical_axis,
  })),
})

const buildKpis = (overview: FinancialOverview): KPI[] => {
  const totalBudget = overview.budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalCost = overview.costs.reduce((sum, cost) => sum + cost.amount, 0)
  const totalRevenue = overview.entries.reduce((sum, entry) => sum + entry.credit, 0)

  return [
    { id: "overview-budget", label: "Total budgeted", value: totalBudget, format: "currency", trend: "up" },
    { id: "overview-cost", label: "Total costs", value: totalCost, format: "currency", trend: "up" },
    { id: "overview-revenue", label: "Recorded revenue", value: totalRevenue, format: "currency", trend: "up" },
  ]
}

const buildTrends = (_overview: FinancialOverview): TrendPoint[] => baselineTrends
const buildAlerts = (_overview: FinancialOverview): AlertSignal[] => baselineAlerts
const buildRecommendations = (_overview: FinancialOverview): Recommendation[] => baselineRecommendations

export function useFinancialOverview() {
  const baseline = useMemo(() => buildBaseline(), [])

  const fetcher = useCallback(async () => {
    const [budgets, costs, entries] = await Promise.all([getBudgets(), getCosts(), getAccountingEntries()])

    const mappedBudgets: BudgetSummary[] = budgets.map((budget) => ({
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

    const mappedCosts: CostItem[] = costs.map((cost: any) => ({
      id: cost.id,
      productId: cost.product_id,
      productName: cost.products?.name || cost.product_id,
      costType: cost.cost_type === "direct" ? "direct" : "indirect",
      costCategory: cost.cost_category,
      amount: cost.amount,
      date: cost.date,
      description: cost.description || undefined,
    }))

    const mappedEntries: AccountingEntry[] = entries.map((entry) => ({
      id: entry.id,
      date: entry.date,
      accountNumber: entry.account_number,
      accountName: entry.account_name,
      description: entry.description,
      debit: entry.debit,
      credit: entry.credit,
      type: entry.type as AccountingEntry["type"],
      analyticalAxis: entry.analytical_axis,
    }))

    return {
      budgets: mappedBudgets,
      costs: mappedCosts,
      entries: mappedEntries,
    }
  }, [])

  return useAnalyticsData<FinancialOverview>({
    baseline,
    fetcher,
    buildKpis,
    buildTrends,
    buildAlerts,
    buildRecommendations,
  })
}
