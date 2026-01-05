import type { ScenarioInput, ScenarioType } from "@/types/scenarios"

export interface AIInsightRequest {
  scenarioId: string
  scenarioTitle: string
  scenarioType: ScenarioType
  scenarioDescription: string
  inputs: ScenarioInput
}

export interface AIInsightResponse {
  executiveSummary: string
  riskSignals: string[]
  optimizationOpportunities: string[]
  recommendations: string[]
  rawResponse?: string
}

export async function analyzeScenarioWithAI(request: AIInsightRequest): Promise<AIInsightResponse> {
  try {
    const response = await fetch("/api/ai-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Unable to generate automated insights.")
    }

    const data = (await response.json()) as AIInsightResponse
    return data
  } catch (error) {
    console.error("AI insight request failed:", error)
    throw new Error("Unable to generate automated insights. Please try again.")
  }
}
