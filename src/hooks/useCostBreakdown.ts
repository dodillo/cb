"use client"

import { useCallback, useMemo } from "react"
import { useAnalyticsData } from "@/hooks/use-analytics-data"
import {
  baselineAlerts,
  baselineCosts,
  baselineRecommendations,
  baselineStandardCosts,
  baselineTrends,
} from "@/lib/baseline-data"
import { getCosts, getStandardCosts } from "@/lib/services/cost-service"
import type { CostItem, StandardCostItem } from "@/types/finance"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

type CostVariance = {
  category: string
  standard: number
  actual: number
  variance: number
  variancePercent: number
}

type CostBreakdown = {
  varianceByCategory: CostVariance[]
  standardCosts: StandardCostItem[]
}

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

const mapBaselineStandardCosts = (): StandardCostItem[] =>
  baselineStandardCosts.map((cost) => ({
    id: cost.id,
    productId: cost.product_id,
    productName: cost.product_name,
    category: cost.category,
    standardCost: cost.standard_cost,
    unit: cost.unit,
    lastUpdated: cost.last_updated,
  }))

const computeVariance = (costs: CostItem[], standards: StandardCostItem[]): CostVariance[] => {
  const actualByCategory = costs.reduce<Record<string, number>>((acc, cost) => {
    acc[cost.costCategory] = (acc[cost.costCategory] || 0) + cost.amount
    return acc
  }, {})

  const standardByCategory = standards.reduce<Record<string, number>>((acc, cost) => {
    acc[cost.category] = (acc[cost.category] || 0) + cost.standardCost
    return acc
  }, {})

  const categories = Array.from(new Set([...Object.keys(actualByCategory), ...Object.keys(standardByCategory)]))

  return categories.map((category) => {
    const actual = actualByCategory[category] || 0
    const standard = standardByCategory[category] || 0
    const variance = actual - standard
    const variancePercent = standard ? (variance / standard) * 100 : 0
    return {
      category,
      standard,
      actual,
      variance,
      variancePercent: Number.isFinite(variancePercent) ? variancePercent : 0,
    }
  })
}

const buildBaseline = (): CostBreakdown => {
  const costs = mapBaselineCosts()
  const standards = mapBaselineStandardCosts()
  return {
    varianceByCategory: computeVariance(costs, standards),
    standardCosts: standards,
  }
}

const buildKpis = (breakdown: CostBreakdown): KPI[] => {
  const totalActual = breakdown.varianceByCategory.reduce((sum, row) => sum + row.actual, 0)
  const totalStandard = breakdown.varianceByCategory.reduce((sum, row) => sum + row.standard, 0)
  const variance = totalActual - totalStandard
  return [
    { id: "cost-total", label: "Actual cost", value: totalActual, format: "currency", trend: "up" },
    { id: "cost-standard", label: "Standard baseline", value: totalStandard, format: "currency", trend: "flat" },
    { id: "cost-variance", label: "Variance", value: variance, format: "currency", trend: variance >= 0 ? "up" : "down" },
  ]
}

const buildTrends = (_breakdown: CostBreakdown): TrendPoint[] => baselineTrends
const buildAlerts = (_breakdown: CostBreakdown): AlertSignal[] => baselineAlerts
const buildRecommendations = (_breakdown: CostBreakdown): Recommendation[] => baselineRecommendations

export function useCostBreakdown() {
  const baseline = useMemo(() => buildBaseline(), [])

  const fetcher = useCallback(async () => {
    const [costs, standards] = await Promise.all([getCosts(), getStandardCosts()])
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

    const mappedStandards: StandardCostItem[] = standards.map((standard: any) => ({
      id: standard.id,
      productId: standard.product_id,
      productName: standard.products?.name || standard.product_id,
      category: standard.category,
      standardCost: standard.standard_cost,
      unit: standard.unit,
      lastUpdated: standard.last_updated,
    }))

    return {
      varianceByCategory: computeVariance(mappedCosts, mappedStandards),
      standardCosts: mappedStandards,
    }
  }, [])

  return useAnalyticsData<CostBreakdown>({
    baseline,
    fetcher,
    buildKpis,
    buildTrends,
    buildAlerts,
    buildRecommendations,
  })
}
