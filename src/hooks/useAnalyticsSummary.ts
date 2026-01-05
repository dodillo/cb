"use client"

import { useAnalyticsData } from "@/hooks/use-analytics-data"
import { baselineAlerts, baselineKpis, baselineRecommendations, baselineTrends } from "@/lib/baseline-data"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

type AnalyticsSummary = {
  kpis: KPI[]
  headline: string
}

const baseline: AnalyticsSummary = {
  kpis: baselineKpis,
  headline: "Operational performance holds steady with improving forecast accuracy.",
}

const buildKpis = (summary: AnalyticsSummary): KPI[] => summary.kpis
const buildTrends = (_summary: AnalyticsSummary): TrendPoint[] => baselineTrends
const buildAlerts = (_summary: AnalyticsSummary): AlertSignal[] => baselineAlerts
const buildRecommendations = (_summary: AnalyticsSummary): Recommendation[] => baselineRecommendations

export function useAnalyticsSummary() {
  return useAnalyticsData<AnalyticsSummary>({
    baseline,
    buildKpis,
    buildTrends,
    buildAlerts,
    buildRecommendations,
  })
}
