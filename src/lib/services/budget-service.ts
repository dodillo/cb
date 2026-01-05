import { getSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type Budget = Database["public"]["Tables"]["budgets"]["Row"]
export type BudgetInsert = Database["public"]["Tables"]["budgets"]["Insert"]
export type BudgetUpdate = Database["public"]["Tables"]["budgets"]["Update"]

export async function getBudgets(): Promise<Budget[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("budgets").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching budgets:", error)
    throw error
  }

  return data || []
}

export async function getBudgetById(id: string): Promise<Budget | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("budgets").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching budget with id ${id}:`, error)
    throw error
  }

  return data
}

export async function createBudget(budget: BudgetInsert): Promise<Budget> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("budgets").insert([budget]).select().single()

  if (error) {
    console.error("Error creating budget:", error)
    throw error
  }

  return data
}

export async function updateBudget(id: string, updates: BudgetUpdate): Promise<Budget> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("budgets").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating budget with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteBudget(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("budgets").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting budget with id ${id}:`, error)
    throw error
  }
}
