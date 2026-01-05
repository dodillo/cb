"use client"

import { useCallback } from "react"
import { useAnalyticsData } from "@/hooks/use-analytics-data"
import { baselineAlerts, baselineRecommendations, baselineTrends, baselineVarianceRecords } from "@/lib/baseline-data"
import type { VarianceRecord } from "@/types/finance"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

const buildKpis = (records: VarianceRecord[]): KPI[] => {
  const totalVariance = records.reduce((sum, record) => sum + record.variance, 0)
  const avgVariance = records.length
    ? records.reduce((sum, record) => sum + record.variancePercent, 0) / records.length
    : 0
  const favorable = records.filter((record) => record.variance >= 0).length

  return [
    { id: "variance-total", label: "Total variance", value: totalVariance, format: "currency", trend: "up" },
    { id: "variance-average", label: "Average variance", value: avgVariance / 100, format: "percent", trend: "flat" },
    { id: "variance-favorable", label: "Favorable lines", value: favorable, format: "number", trend: "up" },
  ]
}

const buildTrends = (records: VarianceRecord[]): TrendPoint[] =>
  records.map((record) => ({ label: record.period, value: record.variance }))

const buildAlerts = (records: VarianceRecord[]): AlertSignal[] => {
  const negative = records.filter((record) => record.variancePercent < -5)
  if (negative.length) {
    return [
      {
        id: "variance-risk",
        level: "warning",
        title: "Variance exposure",
        description: `${negative.length} segments exceed -5% variance.`,
      },
    ]
  }
  return baselineAlerts
}

const buildRecommendations = (_records: VarianceRecord[]): Recommendation[] => baselineRecommendations

export function useVarianceInsights() {
  const fetcher = useCallback(async () => baselineVarianceRecords, [])

  return useAnalyticsData<VarianceRecord[]>({
    baseline: baselineVarianceRecords,
    fetcher,
    buildKpis,
    buildTrends,
    buildAlerts,
    buildRecommendations,
  })
}
