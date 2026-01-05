"use client"

import { useCallback, useState } from "react"
import { analyzeScenarioWithAI } from "@/lib/ai-service"
import type { AIInsightResponse } from "@/lib/ai-service"
import type { Scenario, ScenarioInput } from "@/types/scenarios"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

type AIInsightState = {
  data: AIInsightResponse | null
  kpis: KPI[]
  trends: TrendPoint[]
  alerts: AlertSignal[]
  recommendations: Recommendation[]
  isLoading: boolean
  error: string | null
}

const buildAlerts = (analysis: AIInsightResponse | null): AlertSignal[] => {
  if (!analysis) return []
  return analysis.riskSignals.map((signal, index) => ({
    id: `ai-risk-${index}`,
    level: "warning",
    title: "Risk signal",
    description: signal,
  }))
}

const buildRecommendations = (analysis: AIInsightResponse | null): Recommendation[] => {
  if (!analysis) return []
  return analysis.recommendations.map((rec, index) => ({
    id: `ai-rec-${index}`,
    title: "Recommendation",
    description: rec,
    impact: "medium",
  }))
}

export function useAIInsights(scenario: Scenario, inputs: ScenarioInput) {
  const [state, setState] = useState<AIInsightState>({
    data: null,
    kpis: [],
    trends: [],
    alerts: [],
    recommendations: [],
    isLoading: false,
    error: null,
  })

  const runAnalysis = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const analysis = await analyzeScenarioWithAI({
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        scenarioType: scenario.type,
        scenarioDescription: scenario.description,
        inputs,
      })

      setState({
        data: analysis,
        kpis: [],
        trends: [],
        alerts: buildAlerts(analysis),
        recommendations: buildRecommendations(analysis),
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error?.message || "Unable to generate automated insights.",
      }))
    }
  }, [inputs, scenario])

  return {
    ...state,
    runAnalysis,
  }
}
