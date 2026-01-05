import { getSupabaseAdminClient } from "@/lib/supabase"

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    await clearExistingData()
    const products = await seedProducts()
    await seedBudgets()
    await seedCosts(products)
    await seedStandardCosts(products)
    await seedAccountingEntries()

    console.log("Database seeding completed successfully!")
    return { success: true }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, error }
  }
}

async function clearExistingData() {
  console.log("Clearing existing data...")

  const supabaseAdmin = getSupabaseAdminClient()
  await supabaseAdmin.from("accounting_entries").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabaseAdmin.from("standard_costs").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabaseAdmin.from("costs").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabaseAdmin.from("budgets").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabaseAdmin.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000")
}

async function seedProducts() {
  console.log("Seeding products...")

  const supabaseAdmin = getSupabaseAdminClient()
  const products = [
    { name: "Core Platform", description: "Primary subscription line" },
    { name: "Managed Services", description: "Operational support services" },
    { name: "Data Integrations", description: "Connector and API access" },
  ]

  const { data, error } = await supabaseAdmin.from("products").insert(products).select()

  if (error) {
    throw error
  }

  return data
}

async function seedBudgets() {
  console.log("Seeding budgets...")

  const supabaseAdmin = getSupabaseAdminClient()
  const currentYear = new Date().getFullYear()

  const budgets = [
    {
      name: "Annual Operating Plan",
      type: "operating",
      period: "annual",
      start_date: `${currentYear}-01-01`,
      end_date: `${currentYear}-12-31`,
      amount: 3200000,
      progress: 18,
      status: "active",
      method: "rolling",
      description: "Enterprise operating plan with quarterly re-forecast",
    },
    {
      name: "Q2 Delivery Plan",
      type: "operations",
      period: "quarterly",
      start_date: `${currentYear}-04-01`,
      end_date: `${currentYear}-06-30`,
      amount: 860000,
      progress: 36,
      status: "active",
      method: "zero-based",
      description: "Delivery cost structure for the quarter",
    },
    {
      name: "Capital Investment Portfolio",
      type: "investment",
      period: "annual",
      start_date: `${currentYear}-01-01`,
      end_date: `${currentYear}-12-31`,
      amount: 1400000,
      progress: 8,
      status: "active",
      method: "strategic",
      description: "Enterprise infrastructure and modernization investments",
    },
  ]

  const { error } = await supabaseAdmin.from("budgets").insert(budgets)

  if (error) {
    throw error
  }
}

async function seedCosts(products: any[]) {
  console.log("Seeding costs...")

  const supabaseAdmin = getSupabaseAdminClient()
  if (!products || products.length === 0) {
    throw new Error("No products available for seeding costs")
  }

  const today = new Date().toISOString().split("T")[0]

  const costs = [
    {
      product_id: products[0].id,
      cost_type: "direct",
      cost_category: "Cloud Infrastructure",
      amount: 184500,
      date: today,
      description: "Compute and storage allocation for core platform workloads",
    },
    {
      product_id: products[1].id,
      cost_type: "direct",
      cost_category: "Delivery Labor",
      amount: 231200,
      date: today,
      description: "Services delivery labor allocation",
    },
    {
      product_id: products[2].id,
      cost_type: "indirect",
      cost_category: "Partner Fees",
      amount: 97200,
      date: today,
      description: "Integration partner platform fees",
    },
  ]

  const { error } = await supabaseAdmin.from("costs").insert(costs)

  if (error) {
    throw error
  }
}

async function seedStandardCosts(products: any[]) {
  console.log("Seeding standard costs...")

  const supabaseAdmin = getSupabaseAdminClient()
  if (!products || products.length === 0) {
    throw new Error("No products available for seeding standard costs")
  }

  const today = new Date().toISOString().split("T")[0]

  const standardCosts = [
    {
      product_id: products[0].id,
      category: "Cloud Infrastructure",
      standard_cost: 12.5,
      unit: "per-tenant",
      last_updated: today,
    },
    {
      product_id: products[1].id,
      category: "Delivery Labor",
      standard_cost: 175.0,
      unit: "per-hour",
      last_updated: today,
    },
    {
      product_id: products[2].id,
      category: "Support Tools",
      standard_cost: 3.25,
      unit: "per-connector",
      last_updated: today,
    },
  ]

  const { error } = await supabaseAdmin.from("standard_costs").insert(standardCosts)

  if (error) {
    throw error
  }
}

async function seedAccountingEntries() {
  console.log("Seeding accounting entries...")

  const supabaseAdmin = getSupabaseAdminClient()
  const today = new Date().toISOString().split("T")[0]

  const entries = [
    {
      date: today,
      account_number: "607",
      account_name: "Technology Procurement",
      description: "Cloud infrastructure invoice",
      debit: 184500,
      credit: 0,
      type: "expense",
      analytical_axis: "Core Platform",
    },
    {
      date: today,
      account_number: "512",
      account_name: "Operating Cash",
      description: "Vendor settlement",
      debit: 0,
      credit: 184500,
      type: "expense",
      analytical_axis: "Core Platform",
    },
    {
      date: today,
      account_number: "701",
      account_name: "Subscription Revenue",
      description: "Enterprise subscription revenue",
      debit: 0,
      credit: 615000,
      type: "revenue",
      analytical_axis: "Managed Services",
    },
  ]

  const { error } = await supabaseAdmin.from("accounting_entries").insert(entries)

  if (error) {
    throw error
  }
}
