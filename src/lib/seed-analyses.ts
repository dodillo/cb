import { getSupabaseAdminClient } from "./supabase"
import { v4 as uuidv4 } from "uuid"

export async function seedAnalyses() {
  const supabaseAdmin = getSupabaseAdminClient()
  const { data: users, error: usersError } = await supabaseAdmin.from("users").select("id").limit(4)

  if (usersError) {
    console.error("Error fetching users:", usersError)
    return
  }

  if (!users || users.length === 0) {
    console.error("No users found to associate with analyses")
    return
  }

  const analyses = [
    {
      id: uuidv4(),
      title: "Q1 Variance Review",
      description: "Plan vs. actual variance review for the first quarter.",
      type: "variance",
      user_id: users[0].id,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      data: {
        summary: {
          totalBudget: 120000,
          totalActual: 115000,
          variance: -5000,
          variancePercent: -4.17,
        },
        details: [
          { category: "Revenue", budget: 50000, actual: 48000, variance: -2000, variancePercent: -4 },
          { category: "Marketing", budget: 20000, actual: 22000, variance: 2000, variancePercent: 10 },
          { category: "Operations", budget: 35000, actual: 32000, variance: -3000, variancePercent: -8.57 },
          { category: "Administration", budget: 15000, actual: 13000, variance: -2000, variancePercent: -13.33 },
        ],
      },
      status: "completed",
      is_public: true,
    },
    {
      id: uuidv4(),
      title: "Price Optimization Sprint",
      description: "Modeling optimized pricing to maximize contribution margin.",
      type: "optimization",
      user_id: users[1].id,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      data: {
        products: [
          {
            name: "Segment A",
            currentPrice: 120,
            optimalPrice: 135,
            elasticity: -1.2,
            currentDemand: 1000,
            projectedDemand: 880,
            currentRevenue: 120000,
            projectedRevenue: 118800,
            revenueChange: -1.0,
          },
          {
            name: "Segment B",
            currentPrice: 85,
            optimalPrice: 75,
            elasticity: -1.8,
            currentDemand: 1500,
            projectedDemand: 1770,
            currentRevenue: 127500,
            projectedRevenue: 132750,
            revenueChange: 4.1,
          },
        ],
        summary: {
          totalCurrentRevenue: 247500,
          totalProjectedRevenue: 251550,
          totalRevenueChange: 4050,
          totalRevenueChangePercent: 1.64,
        },
      },
      status: "completed",
      is_public: true,
    },
    {
      id: uuidv4(),
      title: "Cost Trend Analysis",
      description: "Twelve-month cost trend analysis across operating categories.",
      type: "trend",
      user_id: users[2].id,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      data: {
        timeSeries: [
          { month: "Jan 2024", materials: 12000, labor: 18000, overhead: 8000 },
          { month: "Feb 2024", materials: 12500, labor: 18200, overhead: 8100 },
          { month: "Mar 2024", materials: 13000, labor: 18500, overhead: 8200 },
          { month: "Apr 2024", materials: 13200, labor: 18800, overhead: 8300 },
          { month: "May 2024", materials: 13500, labor: 19000, overhead: 8400 },
          { month: "Jun 2024", materials: 14000, labor: 19200, overhead: 8500 },
          { month: "Jul 2024", materials: 14500, labor: 19500, overhead: 8600 },
          { month: "Aug 2024", materials: 15000, labor: 19800, overhead: 8700 },
          { month: "Sep 2024", materials: 15500, labor: 20000, overhead: 8800 },
          { month: "Oct 2024", materials: 16000, labor: 20200, overhead: 8900 },
          { month: "Nov 2024", materials: 16500, labor: 20500, overhead: 9000 },
          { month: "Dec 2024", materials: 17000, labor: 21000, overhead: 9100 },
        ],
        trends: {
          materials: {
            growthRate: 41.67,
            averageMonthlyGrowth: 3.47,
            trend: "increasing",
          },
          labor: {
            growthRate: 16.67,
            averageMonthlyGrowth: 1.39,
            trend: "increasing",
          },
          overhead: {
            growthRate: 13.75,
            averageMonthlyGrowth: 1.15,
            trend: "increasing",
          },
        },
      },
      status: "completed",
      is_public: true,
    },
    {
      id: uuidv4(),
      title: "Regional Revenue Mix",
      description: "Revenue distribution by region and product category.",
      type: "distribution",
      user_id: users[3].id,
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      data: {
        regions: [
          { name: "North", value: 125000, percent: 25 },
          { name: "South", value: 150000, percent: 30 },
          { name: "East", value: 100000, percent: 20 },
          { name: "West", value: 125000, percent: 25 },
        ],
        categories: [
          { name: "Software", value: 200000, percent: 40 },
          { name: "Services", value: 150000, percent: 30 },
          { name: "Analytics", value: 100000, percent: 20 },
          { name: "Enablement", value: 50000, percent: 10 },
        ],
        crossAnalysis: [
          { region: "North", software: 50000, services: 37500, analytics: 25000, enablement: 12500 },
          { region: "South", software: 60000, services: 45000, analytics: 30000, enablement: 15000 },
          { region: "East", software: 40000, services: 30000, analytics: 20000, enablement: 10000 },
          { region: "West", software: 50000, services: 37500, analytics: 25000, enablement: 12500 },
        ],
      },
      status: "completed",
      is_public: true,
    },
  ]

  const { error: analysesError } = await supabaseAdmin.from("analyses").upsert(analyses)

  if (analysesError) {
    console.error("Error seeding analyses:", analysesError)
    return
  }

  const analysesTags = [
    { analysis_id: analyses[0].id, tag: "variance" },
    { analysis_id: analyses[0].id, tag: "budget" },
    { analysis_id: analyses[0].id, tag: "quarter" },
    { analysis_id: analyses[1].id, tag: "pricing" },
    { analysis_id: analyses[1].id, tag: "optimization" },
    { analysis_id: analyses[1].id, tag: "margin" },
    { analysis_id: analyses[2].id, tag: "costs" },
    { analysis_id: analyses[2].id, tag: "trends" },
    { analysis_id: analyses[2].id, tag: "operations" },
    { analysis_id: analyses[3].id, tag: "revenue" },
    { analysis_id: analyses[3].id, tag: "regions" },
    { analysis_id: analyses[3].id, tag: "distribution" },
  ]

  const { error: tagsError } = await supabaseAdmin.from("analyses_tags").upsert(analysesTags)

  if (tagsError) {
    console.error("Error seeding analyses tags:", tagsError)
    return
  }

  console.log("Successfully seeded analyses data")
}
