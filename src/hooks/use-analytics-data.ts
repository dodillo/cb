"use client"

import { useEffect, useState } from "react"
import { hasSupabaseConfig } from "@/lib/supabase"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

export type DataSource = "baseline" | "supabase"

export type AnalyticsState<T> = {
  data: T
  kpis: KPI[]
  trends: TrendPoint[]
  alerts: AlertSignal[]
  recommendations: Recommendation[]
  isLoading: boolean
  error: string | null
  source: DataSource
}

type AnalyticsConfig<T> = {
  baseline: T
  fetcher?: () => Promise<T>
  buildKpis: (data: T) => KPI[]
  buildTrends: (data: T) => TrendPoint[]
  buildAlerts: (data: T) => AlertSignal[]
  buildRecommendations: (data: T) => Recommendation[]
}

export function useAnalyticsData<T>({
  baseline,
  fetcher,
  buildKpis,
  buildTrends,
  buildAlerts,
  buildRecommendations,
}: AnalyticsConfig<T>): AnalyticsState<T> {
  const [state, setState] = useState<AnalyticsState<T>>({
    data: baseline,
    kpis: buildKpis(baseline),
    trends: buildTrends(baseline),
    alerts: buildAlerts(baseline),
    recommendations: buildRecommendations(baseline),
    isLoading: Boolean(fetcher && hasSupabaseConfig()),
    error: null,
    source: hasSupabaseConfig() && fetcher ? "supabase" : "baseline",
  })

  useEffect(() => {
    let isActive = true

    const loadData = async () => {
      if (!fetcher || !hasSupabaseConfig()) {
        if (!isActive) return
        setState((prev) => ({
          ...prev,
          data: baseline,
          kpis: buildKpis(baseline),
          trends: buildTrends(baseline),
          alerts: buildAlerts(baseline),
          recommendations: buildRecommendations(baseline),
          isLoading: false,
          error: null,
          source: "baseline",
        }))
        return
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null, source: "supabase" }))

      try {
        const data = await fetcher()
        if (!isActive) return
        setState({
          data,
          kpis: buildKpis(data),
          trends: buildTrends(data),
          alerts: buildAlerts(data),
          recommendations: buildRecommendations(data),
          isLoading: false,
          error: null,
          source: "supabase",
        })
      } catch (error: any) {
        if (!isActive) return
        setState({
          data: baseline,
          kpis: buildKpis(baseline),
          trends: buildTrends(baseline),
          alerts: buildAlerts(baseline),
          recommendations: buildRecommendations(baseline),
          isLoading: false,
          error: error?.message || "Unable to load analytics data.",
          source: "baseline",
        })
      }
    }

    loadData()

    return () => {
      isActive = false
    }
  }, [baseline, fetcher, buildAlerts, buildKpis, buildRecommendations, buildTrends])

  return state
}
