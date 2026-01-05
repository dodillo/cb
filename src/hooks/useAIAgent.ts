"use client"

import { useAnalyticsData } from "@/hooks/use-analytics-data"
import { baselineAIAgentData } from "@/lib/ai-agent-data"
import type { AIAgentData } from "@/types/ai-agent"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

const buildKpis = (data: AIAgentData): KPI[] => {
  const activeRuns = data.runs.filter((run) => run.status === "running").length
  const queuedRuns = data.runs.filter((run) => run.status === "queued").length

  return [
    {
      id: "agent-kpi-active",
      label: "Active runs",
      value: activeRuns,
      format: "number",
      trend: activeRuns > 0 ? "up" : "flat",
      status: activeRuns > 0 ? "success" : "warning",
    },
    {
      id: "agent-kpi-queue",
      label: "Queue latency (min)",
      value: data.metrics.queueLatencyMinutes,
      format: "number",
      trend: queuedRuns > 0 ? "up" : "flat",
      status: data.metrics.queueLatencyMinutes > 20 ? "warning" : "success",
    },
    {
      id: "agent-kpi-automation",
      label: "Automation rate",
      value: data.metrics.automationRate / 100,
      format: "percent",
      trend: "up",
      status: data.metrics.automationRate >= 70 ? "success" : "warning",
    },
    {
      id: "agent-kpi-savings",
      label: "Savings identified",
      value: data.metrics.savingsIdentified,
      format: "currency",
      trend: "up",
      status: data.metrics.savingsIdentified >= 1000000 ? "success" : "warning",
    },
  ]
}

const buildTrends = (data: AIAgentData): TrendPoint[] =>
  data.throughput.map((point) => ({ label: point.label, value: point.runs }))

const buildAlerts = (data: AIAgentData): AlertSignal[] => data.alerts

const buildRecommendations = (data: AIAgentData): Recommendation[] => data.recommendations

export function useAIAgent() {
  return useAnalyticsData<AIAgentData>({
    baseline: baselineAIAgentData,
    buildKpis,
    buildTrends,
    buildAlerts,
    buildRecommendations,
  })
}
