export type TrendDirection = "up" | "down" | "flat"
export type AlertLevel = "info" | "warning" | "risk"
export type KPIStatus = "success" | "warning" | "risk"

export interface KPI {
  id: string
  label: string
  value: number
  format: "currency" | "percent" | "number"
  delta?: number
  trend?: TrendDirection
  status?: KPIStatus
}

export interface TrendPoint {
  label: string
  value: number
}

export interface AlertSignal {
  id: string
  level: AlertLevel
  title: string
  description: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
  impact?: "low" | "medium" | "high"
}

export interface AnalyticsPayload<T> {
  data: T
  kpis: KPI[]
  trends: TrendPoint[]
  alerts: AlertSignal[]
  recommendations: Recommendation[]
  isBaseline?: boolean
}
