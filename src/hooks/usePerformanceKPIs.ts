"use client"

import { useAnalyticsData } from "@/hooks/use-analytics-data"
import { baselineAlerts, baselineKpis, baselineRecommendations, baselineTrends } from "@/lib/baseline-data"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

type PerformanceSnapshot = {
  kpis: KPI[]
}

const baseline: PerformanceSnapshot = {
  kpis: baselineKpis,
}

const buildKpis = (snapshot: PerformanceSnapshot): KPI[] => snapshot.kpis
const buildTrends = (_snapshot: PerformanceSnapshot): TrendPoint[] => baselineTrends
const buildAlerts = (_snapshot: PerformanceSnapshot): AlertSignal[] => baselineAlerts
const buildRecommendations = (_snapshot: PerformanceSnapshot): Recommendation[] => baselineRecommendations

export function usePerformanceKPIs() {
  return useAnalyticsData<PerformanceSnapshot>({
    baseline,
    buildKpis,
    buildTrends,
    buildAlerts,
    buildRecommendations,
  })
}
