import { getSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type Analysis = Database["public"]["Tables"]["analyses"]["Row"]
export type AnalysisInsert = Database["public"]["Tables"]["analyses"]["Insert"]
export type AnalysisUpdate = Database["public"]["Tables"]["analyses"]["Update"]
export type AnalysisTag = Database["public"]["Tables"]["analyses_tags"]["Row"]

const getClient = () => getSupabaseClient()

export const analysisService = {
  // Fetch all analyses with optional filters
  async getAnalyses(options?: {
    userId?: string
    type?: string
    limit?: number
    offset?: number
    isPublic?: boolean
    tags?: string[]
    search?: string
  }) {
    const supabase = getClient()
    let query = supabase.from("analyses").select(`
        *,
        users (
          id,
          name,
          email,
          avatar_url
        ),
        analyses_tags (
          tag
        )
      `)

    if (options?.userId) {
      query = query.eq("user_id", options.userId)
    }

    if (options?.type) {
      query = query.eq("type", options.type)
    }

    if (options?.isPublic !== undefined) {
      query = query.eq("is_public", options.isPublic)
    }

    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`)
    }

    if (options?.tags && options.tags.length > 0) {
      query = query.in("analyses_tags.tag", options.tags)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Error fetching analyses:", error)
      throw error
    }

    return data
  },

  // Fetch a single analysis by ID
  async getAnalysisById(id: string) {
    const supabase = getClient()
    const { data, error } = await supabase
      .from("analyses")
      .select(`
        *,
        users (
          id,
          name,
          email,
          avatar_url
        ),
        analyses_tags (
          tag
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error(`Error fetching analysis with ID ${id}:`, error)
      throw error
    }

    return data
  },

  // Create a new analysis
  async createAnalysis(analysis: AnalysisInsert) {
    const supabase = getClient()
    const { data, error } = await supabase.from("analyses").insert(analysis).select().single()

    if (error) {
      console.error("Error creating analysis:", error)
      throw error
    }

    return data
  },

  // Update an existing analysis
  async updateAnalysis(id: string, updates: AnalysisUpdate) {
    const supabase = getClient()
    const { data, error } = await supabase.from("analyses").update(updates).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating analysis with ID ${id}:`, error)
      throw error
    }

    return data
  },

  // Delete an analysis
  async deleteAnalysis(id: string) {
    const supabase = getClient()
    const { error } = await supabase.from("analyses").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting analysis with ID ${id}:`, error)
      throw error
    }

    return true
  },

  // Add tags to an analysis
  async addTagsToAnalysis(analysisId: string, tags: string[]) {
    const supabase = getClient()
    const tagsToInsert = tags.map((tag) => ({
      analysis_id: analysisId,
      tag,
    }))

    const { error } = await supabase.from("analyses_tags").insert(tagsToInsert)

    if (error) {
      console.error(`Error adding tags to analysis with ID ${analysisId}:`, error)
      throw error
    }

    return true
  },

  // Remove tags from an analysis
  async removeTagsFromAnalysis(analysisId: string, tags: string[]) {
    const supabase = getClient()
    const { error } = await supabase.from("analyses_tags").delete().eq("analysis_id", analysisId).in("tag", tags)

    if (error) {
      console.error(`Error removing tags from analysis with ID ${analysisId}:`, error)
      throw error
    }

    return true
  },

  // Subscribe to real-time updates for analyses
  subscribeToAnalyses(callback: (payload: any) => void) {
    const supabase = getClient()
    return supabase
      .channel("analyses-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "analyses" }, callback)
      .subscribe()
  },
}
