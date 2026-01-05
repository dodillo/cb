import { getSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type Cost = Database["public"]["Tables"]["costs"]["Row"]
export type CostInsert = Database["public"]["Tables"]["costs"]["Insert"]
export type CostUpdate = Database["public"]["Tables"]["costs"]["Update"]

export type StandardCost = Database["public"]["Tables"]["standard_costs"]["Row"]
export type StandardCostInsert = Database["public"]["Tables"]["standard_costs"]["Insert"]
export type StandardCostUpdate = Database["public"]["Tables"]["standard_costs"]["Update"]

const getClient = () => getSupabaseClient()

// Regular costs
export async function getCosts(): Promise<Cost[]> {
  const supabase = getClient()
  const { data, error } = await supabase.from("costs").select("*, products(name)").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching costs:", error)
    throw error
  }

  return data || []
}

export async function getCostsByProduct(productId: string): Promise<Cost[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from("costs")
    .select("*, products(name)")
    .eq("product_id", productId)
    .order("date", { ascending: false })

  if (error) {
    console.error(`Error fetching costs for product ${productId}:`, error)
    throw error
  }

  return data || []
}

export async function createCost(cost: CostInsert): Promise<Cost> {
  const supabase = getClient()
  const { data, error } = await supabase.from("costs").insert([cost]).select("*, products(name)").single()

  if (error) {
    console.error("Error creating cost:", error)
    throw error
  }

  return data
}

export async function updateCost(id: string, updates: CostUpdate): Promise<Cost> {
  const supabase = getClient()
  const { data, error } = await supabase.from("costs").update(updates).eq("id", id).select("*, products(name)").single()

  if (error) {
    console.error(`Error updating cost with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteCost(id: string): Promise<void> {
  const supabase = getClient()
  const { error } = await supabase.from("costs").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting cost with id ${id}:`, error)
    throw error
  }
}

// Standard costs
export async function getStandardCosts(): Promise<StandardCost[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from("standard_costs")
    .select("*, products(name)")
    .order("last_updated", { ascending: false })

  if (error) {
    console.error("Error fetching standard costs:", error)
    throw error
  }

  return data || []
}

export async function createStandardCost(standardCost: StandardCostInsert): Promise<StandardCost> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from("standard_costs")
    .insert([standardCost])
    .select("*, products(name)")
    .single()

  if (error) {
    console.error("Error creating standard cost:", error)
    throw error
  }

  return data
}

export async function updateStandardCost(id: string, updates: StandardCostUpdate): Promise<StandardCost> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from("standard_costs")
    .update(updates)
    .eq("id", id)
    .select("*, products(name)")
    .single()

  if (error) {
    console.error(`Error updating standard cost with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteStandardCost(id: string): Promise<void> {
  const supabase = getClient()
  const { error } = await supabase.from("standard_costs").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting standard cost with id ${id}:`, error)
    throw error
  }
}
