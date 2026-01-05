"use client"

import { useAnalyticsData } from "@/hooks/use-analytics-data"
import { baselineActivityFeed, type BaselineActivity } from "@/lib/baseline-data"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

const buildKpis = (_data: BaselineActivity[]): KPI[] => []
const buildTrends = (_data: BaselineActivity[]): TrendPoint[] => []
const buildAlerts = (_data: BaselineActivity[]): AlertSignal[] => []
const buildRecommendations = (_data: BaselineActivity[]): Recommendation[] => []

export function useActivityFeed() {
  return useAnalyticsData<BaselineActivity[]>({
    baseline: baselineActivityFeed,
    buildKpis,
    buildTrends,
    buildAlerts,
    buildRecommendations,
  })
}
