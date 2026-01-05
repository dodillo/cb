"use client"

import { useCallback, useMemo } from "react"
import { useAnalyticsData } from "@/hooks/use-analytics-data"
import {
  baselineCosts,
  baselineKpis,
  baselineTrends,
  baselineAlerts,
  baselineRecommendations,
} from "@/lib/baseline-data"
import { getCosts } from "@/lib/services/cost-service"
import type { CostItem } from "@/types/finance"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

const mapBaselineCosts = (): CostItem[] =>
  baselineCosts.map((cost) => ({
    id: cost.id,
    productId: cost.product_id,
    productName: cost.product_name,
    costType: cost.cost_type,
    costCategory: cost.cost_category,
    amount: cost.amount,
    date: cost.date,
    description: cost.description,
  }))

const mapSupabaseCosts = (costs: Awaited<ReturnType<typeof getCosts>>): CostItem[] =>
  costs.map((cost: any) => ({
    id: cost.id,
    productId: cost.product_id,
    productName: cost.products?.name || cost.product_id,
    costType: cost.cost_type === "direct" ? "direct" : "indirect",
    costCategory: cost.cost_category,
    amount: cost.amount,
    date: cost.date,
    description: cost.description || undefined,
  }))

const buildKpis = (costs: CostItem[]): KPI[] => {
  const total = costs.reduce((sum, cost) => sum + cost.amount, 0)
  const direct = costs.filter((cost) => cost.costType === "direct").reduce((sum, cost) => sum + cost.amount, 0)
  const indirect = total - direct

  return [
    { id: "costs-total", label: "Total costs", value: total, format: "currency", trend: "up", status: "warning" },
    { id: "costs-direct", label: "Direct cost share", value: total ? direct / total : 0, format: "percent", trend: "down", status: "success" },
    { id: "costs-indirect", label: "Indirect exposure", value: indirect, format: "currency", trend: "up", status: "warning" },
  ]
}

const buildTrends = (_costs: CostItem[]): TrendPoint[] => baselineTrends

const buildAlerts = (costs: CostItem[]): AlertSignal[] => {
  const indirectCosts = costs.filter((cost) => cost.costType === "indirect")
  if (indirectCosts.length >= costs.length / 2) {
    return [
      {
        id: "indirect-risk",
        level: "warning",
        title: "Indirect cost concentration",
        description: "Indirect costs represent a high share of total spend.",
      },
    ]
  }
  return baselineAlerts
}

const buildRecommendations = (_costs: CostItem[]): Recommendation[] => baselineRecommendations

export function useCosts() {
  const baseline = useMemo(() => mapBaselineCosts(), [])

  const fetcher = useCallback(async () => {
    const data = await getCosts()
    return mapSupabaseCosts(data)
  }, [])

  return useAnalyticsData<CostItem[]>({
    baseline,
    fetcher,
    buildKpis,
    buildTrends,
    buildAlerts,
    buildRecommendations,
  })
}
