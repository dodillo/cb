"use client"

import { useCallback } from "react"
import { useAnalyticsData } from "@/hooks/use-analytics-data"
import { baselineAlerts, baselineRecommendations, baselineScenarios, baselineTrends } from "@/lib/baseline-data"
import { getScenarios } from "@/lib/services/scenario-service"
import type { Scenario } from "@/types/scenarios"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

const buildKpis = (scenarios: Scenario[]): KPI[] => {
  const total = scenarios.length
  const varianceCount = scenarios.filter((scenario) => scenario.type === "variance").length
  const optimizationCount = scenarios.filter((scenario) => scenario.type === "optimization").length

  return [
    { id: "scenarios-total", label: "Total scenarios", value: total, format: "number", trend: "up", status: "success" },
    {
      id: "scenarios-variance",
      label: "Variance models",
      value: total ? varianceCount / total : 0,
      format: "percent",
      trend: "up",
      status: "success",
    },
    {
      id: "scenarios-optimization",
      label: "Optimization models",
      value: optimizationCount,
      format: "number",
      trend: "flat",
      status: "warning",
    },
  ]
}

const buildTrends = (_scenarios: Scenario[]): TrendPoint[] => baselineTrends

const buildAlerts = (scenarios: Scenario[]): AlertSignal[] => {
  if (scenarios.length === 0) return baselineAlerts
  const advanced = scenarios.filter((scenario) => scenario.complexity === "expert").length
  return advanced
    ? [
        {
          id: "scenario-complexity",
          level: "info",
          title: "Expert scenarios detected",
          description: "Ensure governance for high-impact scenario workflows.",
        },
      ]
    : baselineAlerts
}

const buildRecommendations = (_scenarios: Scenario[]): Recommendation[] => baselineRecommendations

export function useScenarioManager() {
  const fetcher = useCallback(async () => {
    const data = await getScenarios()
    return data
  }, [])

  return useAnalyticsData<Scenario[]>({
    baseline: baselineScenarios,
    fetcher,
    buildKpis,
    buildTrends,
    buildAlerts,
    buildRecommendations,
  })
}
