import type { AlertSignal, Recommendation, TrendDirection } from "@/types/analytics"

export type AIAgentRunStatus = "running" | "queued" | "completed" | "failed" | "review"
export type AIAgentRiskLevel = "low" | "medium" | "high"
export type AIAgentDataSourceStatus = "active" | "degraded" | "offline"
export type AIAgentCapabilityMaturity = "production" | "pilot" | "beta"
export type AIAgentCheckpointStatus = "completed" | "running" | "queued" | "blocked"

export type AIAgentCheckpoint = {
  id: string
  label: string
  status: AIAgentCheckpointStatus
}

export type AIAgentCoverage = {
  id: string
  domain: string
  percent: number
  trend: TrendDirection
}

export type AIAgentRun = {
  id: string
  name: string
  owner: string
  category: string
  status: AIAgentRunStatus
  riskLevel: AIAgentRiskLevel
  startedAt: string
  durationMinutes: number
  etaMinutes?: number
  dataset: string
  confidence: number
  savingsImpact: number
  coveragePercent: number
  summary: string
  signals: AlertSignal[]
  actions: Recommendation[]
  checkpoints: AIAgentCheckpoint[]
  coverageBreakdown: AIAgentCoverage[]
}

export type AIAgentDataSource = {
  id: string
  name: string
  system: string
  status: AIAgentDataSourceStatus
  lastSync: string
  records: number
  latencyMs: number
  freshnessMinutes: number
}

export type AIAgentCapability = {
  id: string
  name: string
  description: string
  maturity: AIAgentCapabilityMaturity
  coveragePercent: number
}

export type AIAgentThroughput = {
  label: string
  runs: number
}

export type AIAgentMetrics = {
  automationRate: number
  accuracyRate: number
  queueLatencyMinutes: number
  savingsIdentified: number
}

export type AIAgentData = {
  metrics: AIAgentMetrics
  runs: AIAgentRun[]
  dataSources: AIAgentDataSource[]
  capabilities: AIAgentCapability[]
  coverage: AIAgentCoverage[]
  throughput: AIAgentThroughput[]
  alerts: AlertSignal[]
  recommendations: Recommendation[]
}
