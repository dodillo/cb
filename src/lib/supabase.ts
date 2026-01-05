import { createClient as createSupabaseClientInner } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Function to obtain the configuration
export const getSupabaseConfig = () => {
  // Check if we are client-side
  if (typeof window !== "undefined") {
    // Retrieve values from localStorage
    const url = localStorage.getItem("supabase_url")
    const key = localStorage.getItem("supabase_key")

    if (url && key) {
      return { url, key }
    }
  }

  // Fallback to environment variables
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    key: process.env.NEXT_PUBLIC_SUPABASE_KEY || "",
  }
}

const isPlaceholderValue = (value: string) => {
  const normalized = value.trim().toLowerCase()
  return (
    normalized.length === 0 ||
    normalized.includes("your-project-id") ||
    normalized.includes("your-anon-key") ||
    normalized.includes("your-service-role-key") ||
    normalized.includes("placeholder")
  )
}

export const hasSupabaseConfig = () => {
  const { url, key } = getSupabaseConfig()
  if (!url || !key) return false
  if (!url.startsWith("http")) return false
  if (isPlaceholderValue(url) || isPlaceholderValue(key)) return false
  return true
}

let cachedClient: SupabaseClient<Database> | null = null
let cachedAdminClient: SupabaseClient<Database> | null = null

const getValidatedConfig = () => {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase configuration is required. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY.")
  }
  return getSupabaseConfig()
}

export const getSupabaseClient = () => {
  if (cachedClient) return cachedClient
  const { url, key } = getValidatedConfig()
  cachedClient = createSupabaseClientInner<Database>(url, key)
  return cachedClient
}

export const getSupabaseAdminClient = () => {
  if (cachedAdminClient) return cachedAdminClient

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    cachedAdminClient = getSupabaseClient()
    return cachedAdminClient
  }

  if (!hasSupabaseConfig()) {
    throw new Error("Supabase configuration is required. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY.")
  }

  cachedAdminClient = createSupabaseClientInner<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
  return cachedAdminClient
}

// Helper function to get server-side supabase client with auth context
export const createServerSupabaseClient = async () => {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase configuration is required. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY.")
  }

  const { cookies } = await import("next/headers")
  const cookieStore = cookies()

  return createSupabaseClientInner<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_KEY || "",
    {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    },
  )
}
