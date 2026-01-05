"use client"

import { useCallback } from "react"
import { useAnalyticsData } from "@/hooks/use-analytics-data"
import { baselineAlerts, baselineRecommendations, baselineScenarios, baselineTrends } from "@/lib/baseline-data"
import { getScenarioById } from "@/lib/services/scenario-service"
import type { Scenario } from "@/types/scenarios"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

const buildKpis = (scenario: Scenario | null): KPI[] => {
  if (!scenario) {
    return [
      { id: "scenario-health", label: "Scenario readiness", value: 0, format: "percent", status: "risk" },
    ]
  }

  return [
    {
      id: "scenario-fields",
      label: "Input fields",
      value: scenario.fields.length,
      format: "number",
      trend: "flat",
      status: "success",
    },
    {
      id: "scenario-complexity",
      label: "Complexity score",
      value: scenario.complexity === "expert" ? 1 : scenario.complexity === "advanced" ? 0.7 : 0.4,
      format: "percent",
      trend: "up",
      status: "warning",
    },
  ]
}

const buildTrends = (_scenario: Scenario | null): TrendPoint[] => baselineTrends
const buildAlerts = (_scenario: Scenario | null): AlertSignal[] => baselineAlerts
const buildRecommendations = (_scenario: Scenario | null): Recommendation[] => baselineRecommendations

export function useScenarioData(id: string) {
  const baseline = baselineScenarios.find((scenario) => scenario.id === id) || null

  const fetcher = useCallback(async () => {
    const data = await getScenarioById(id)
    return data
  }, [id])

  return useAnalyticsData<Scenario | null>({
    baseline,
    fetcher,
    buildKpis,
    buildTrends,
    buildAlerts,
    buildRecommendations,
  })
}
