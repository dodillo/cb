import { getSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type AccountingEntry = Database["public"]["Tables"]["accounting_entries"]["Row"]
export type AccountingEntryInsert = Database["public"]["Tables"]["accounting_entries"]["Insert"]
export type AccountingEntryUpdate = Database["public"]["Tables"]["accounting_entries"]["Update"]

const getClient = () => getSupabaseClient()

export async function getAccountingEntries(): Promise<AccountingEntry[]> {
  const supabase = getClient()
  const { data, error } = await supabase.from("accounting_entries").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching accounting entries:", error)
    throw error
  }

  return data || []
}

export async function getAccountingEntriesByType(type: string): Promise<AccountingEntry[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from("accounting_entries")
    .select("*")
    .eq("type", type)
    .order("date", { ascending: false })

  if (error) {
    console.error(`Error fetching accounting entries of type ${type}:`, error)
    throw error
  }

  return data || []
}

export async function createAccountingEntry(entry: AccountingEntryInsert): Promise<AccountingEntry> {
  const supabase = getClient()
  const { data, error } = await supabase.from("accounting_entries").insert([entry]).select().single()

  if (error) {
    console.error("Error creating accounting entry:", error)
    throw error
  }

  return data
}

export async function updateAccountingEntry(id: string, updates: AccountingEntryUpdate): Promise<AccountingEntry> {
  const supabase = getClient()
  const { data, error } = await supabase.from("accounting_entries").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating accounting entry with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteAccountingEntry(id: string): Promise<void> {
  const supabase = getClient()
  const { error } = await supabase.from("accounting_entries").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting accounting entry with id ${id}:`, error)
    throw error
  }
}
