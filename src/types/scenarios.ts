export type ScenarioType = "variance" | "optimization" | "planning"
export type ScenarioComplexity = "standard" | "advanced" | "expert"

export interface ScenarioField {
  id: string
  label: string
  type: "number" | "percent" | "currency"
}

export interface Scenario {
  id: string
  title: string
  description: string
  type: ScenarioType
  complexity: ScenarioComplexity
  fields: ScenarioField[]
  created_at?: string
  updated_at?: string
}

export interface ScenarioResult {
  title: string
  value: string
  type: "positive" | "negative" | "neutral"
  description?: string
}

export interface ScenarioInput {
  [key: string]: string | number
}

export interface CreateScenarioData {
  id: string
  title: string
  description: string
  type: ScenarioType
  complexity: ScenarioComplexity
  fields: ScenarioField[]
}

export interface ScenarioResultData {
  id?: string
  scenario_id: string
  user_id?: string
  input_data: Record<string, unknown>
  result_data: Record<string, unknown>
  created_at?: string
}
