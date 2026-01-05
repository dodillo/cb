import { getSupabaseClient } from "@/lib/supabase"
import type { Scenario, CreateScenarioData, ScenarioResultData } from "@/types/scenarios"

const getClient = () => getSupabaseClient()

export const getScenarios = async (): Promise<Scenario[]> => {
  const supabase = getClient()
  const { data, error } = await supabase.from("scenarios").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching scenarios:", error)
    throw error
  }

  return data || []
}

export const getScenarioById = async (id: string): Promise<Scenario | null> => {
  const supabase = getClient()
  const { data, error } = await supabase.from("scenarios").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching scenario with ID ${id}:`, error)
    throw error
  }

  return data
}

export const createScenario = async (scenarioData: CreateScenarioData): Promise<Scenario> => {
  const supabase = getClient()
  const { data, error } = await supabase.from("scenarios").insert(scenarioData).select().single()

  if (error) {
    console.error("Error creating scenario:", error)
    throw error
  }

  return data
}

export const updateScenario = async (id: string, updates: Partial<CreateScenarioData>): Promise<Scenario> => {
  const supabase = getClient()
  const { data, error } = await supabase.from("scenarios").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating scenario with ID ${id}:`, error)
    throw error
  }

  return data
}

export const deleteScenario = async (id: string): Promise<void> => {
  const supabase = getClient()
  const { error } = await supabase.from("scenarios").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting scenario with ID ${id}:`, error)
    throw error
  }
}

export const saveScenarioResult = async (resultData: ScenarioResultData): Promise<ScenarioResultData> => {
  const supabase = getClient()
  const { data, error } = await supabase.from("scenario_results").insert(resultData).select().single()

  if (error) {
    console.error("Error saving scenario result:", error)
    throw error
  }

  return data
}

export const getScenarioResults = async (scenarioId: string): Promise<ScenarioResultData[]> => {
  const supabase = getClient()
  const { data, error } = await supabase
    .from("scenario_results")
    .select("*")
    .eq("scenario_id", scenarioId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching results for scenario ${scenarioId}:`, error)
    throw error
  }

  return data || []
}
