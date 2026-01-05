import type { Scenario, ScenarioResultData } from "@/types/scenarios"
import type { KPI, TrendPoint, AlertSignal, Recommendation } from "@/types/analytics"

export type BaselineProduct = {
  id: string
  name: string
  description?: string
}

export type BaselineBudget = {
  id: string
  name: string
  type: string
  period: string
  start_date: string
  end_date: string
  amount: number
  progress: number
  status: "active" | "draft" | "closed"
  method: string
  description?: string
  created_at: string
}

export type BaselineCost = {
  id: string
  product_id: string
  product_name: string
  cost_type: "direct" | "indirect"
  cost_category: string
  amount: number
  date: string
  description?: string
}

export type BaselineStandardCost = {
  id: string
  product_id: string
  product_name: string
  category: string
  standard_cost: number
  unit: string
  last_updated: string
}

export type BaselineAccountingEntry = {
  id: string
  date: string
  account_number: string
  account_name: string
  description: string
  debit: number
  credit: number
  type: "expense" | "revenue"
  analytical_axis: string
}

export type VarianceRecord = {
  id: string
  period: string
  category: string
  planned: number
  actual: number
  variance: number
  variancePercent: number
}

export type BaselineAnalysis = {
  id: string
  title: string
  description: string
  type: string
  created_at: string
  updated_at: string
  user_id: string
  data: Record<string, unknown>
  status: string
  is_public: boolean
  users?: {
    id: string
    name: string
    email: string
    avatar_url?: string
  }
  analyses_tags?: Array<{ tag: string }>
}

export type BaselineActivity = {
  id: string
  user: {
    name: string
    initials: string
  }
  action: string
  target: string
  amount?: number
  date: string
}

const now = new Date()
const iso = (value: Date) => value.toISOString()
const dateOnly = (value: Date) => value.toISOString().split("T")[0]

const monthOffset = (months: number) => {
  const date = new Date(now)
  date.setMonth(date.getMonth() - months)
  return date
}

export const baselineProducts: BaselineProduct[] = [
  { id: "prod-001", name: "Core Platform", description: "Primary subscription line" },
  { id: "prod-002", name: "Managed Services", description: "Operational support services" },
  { id: "prod-003", name: "Data Integrations", description: "Connector and API access" },
]

export const baselineBudgets: BaselineBudget[] = [
  {
    id: "bud-001",
    name: "Annual Operating Plan",
    type: "operating",
    period: "annual",
    start_date: `${now.getFullYear()}-01-01`,
    end_date: `${now.getFullYear()}-12-31`,
    amount: 3200000,
    progress: 42,
    status: "active",
    method: "rolling",
    description: "Enterprise operating budget with quarterly re-forecast",
    created_at: iso(monthOffset(8)),
  },
  {
    id: "bud-002",
    name: "Supply Chain Optimization",
    type: "procurement",
    period: "quarterly",
    start_date: `${now.getFullYear()}-04-01`,
    end_date: `${now.getFullYear()}-06-30`,
    amount: 860000,
    progress: 58,
    status: "active",
    method: "zero-based",
    description: "Category spend modernization program",
    created_at: iso(monthOffset(5)),
  },
  {
    id: "bud-003",
    name: "Growth Investment Portfolio",
    type: "investment",
    period: "annual",
    start_date: `${now.getFullYear()}-01-01`,
    end_date: `${now.getFullYear()}-12-31`,
    amount: 1400000,
    progress: 22,
    status: "active",
    method: "strategic",
    description: "Product expansion and market entry initiatives",
    created_at: iso(monthOffset(7)),
  },
]

export const baselineCosts: BaselineCost[] = [
  {
    id: "cost-001",
    product_id: "prod-001",
    product_name: "Core Platform",
    cost_type: "direct",
    cost_category: "Cloud Infrastructure",
    amount: 184500,
    date: dateOnly(monthOffset(1)),
    description: "Compute, storage, and data pipeline spend",
  },
  {
    id: "cost-002",
    product_id: "prod-002",
    product_name: "Managed Services",
    cost_type: "direct",
    cost_category: "Delivery Labor",
    amount: 231200,
    date: dateOnly(monthOffset(2)),
    description: "Professional services delivery allocation",
  },
  {
    id: "cost-003",
    product_id: "prod-003",
    product_name: "Data Integrations",
    cost_type: "indirect",
    cost_category: "Partner Fees",
    amount: 97200,
    date: dateOnly(monthOffset(1)),
    description: "Connector marketplace fees",
  },
  {
    id: "cost-004",
    product_id: "prod-001",
    product_name: "Core Platform",
    cost_type: "indirect",
    cost_category: "Security & Compliance",
    amount: 68400,
    date: dateOnly(monthOffset(3)),
    description: "Compliance audits and monitoring tools",
  },
]

export const baselineStandardCosts: BaselineStandardCost[] = [
  {
    id: "std-001",
    product_id: "prod-001",
    product_name: "Core Platform",
    category: "Cloud Infrastructure",
    standard_cost: 12.8,
    unit: "per-tenant",
    last_updated: dateOnly(monthOffset(2)),
  },
  {
    id: "std-002",
    product_id: "prod-002",
    product_name: "Managed Services",
    category: "Delivery Labor",
    standard_cost: 145.5,
    unit: "per-hour",
    last_updated: dateOnly(monthOffset(1)),
  },
  {
    id: "std-003",
    product_id: "prod-003",
    product_name: "Data Integrations",
    category: "Partner Fees",
    standard_cost: 8.2,
    unit: "per-connector",
    last_updated: dateOnly(monthOffset(3)),
  },
]

export const baselineAccountingEntries: BaselineAccountingEntry[] = [
  {
    id: "entry-001",
    date: dateOnly(monthOffset(1)),
    account_number: "601",
    account_name: "Technology Services",
    description: "Infrastructure services - cloud provider",
    debit: 184500,
    credit: 0,
    type: "expense",
    analytical_axis: "Core Platform",
  },
  {
    id: "entry-002",
    date: dateOnly(monthOffset(1)),
    account_number: "701",
    account_name: "Subscription Revenue",
    description: "Enterprise subscriptions",
    debit: 0,
    credit: 615000,
    type: "revenue",
    analytical_axis: "Core Platform",
  },
  {
    id: "entry-003",
    date: dateOnly(monthOffset(2)),
    account_number: "621",
    account_name: "Professional Services",
    description: "Managed services delivery",
    debit: 231200,
    credit: 0,
    type: "expense",
    analytical_axis: "Managed Services",
  },
]

export const baselineVarianceRecords: VarianceRecord[] = [
  {
    id: "var-001",
    period: "Jan",
    category: "Core Platform",
    planned: 520000,
    actual: 501200,
    variance: -18800,
    variancePercent: -3.6,
  },
  {
    id: "var-002",
    period: "Feb",
    category: "Managed Services",
    planned: 312000,
    actual: 338400,
    variance: 26400,
    variancePercent: 8.5,
  },
  {
    id: "var-003",
    period: "Mar",
    category: "Data Integrations",
    planned: 164000,
    actual: 150900,
    variance: -13100,
    variancePercent: -8.0,
  },
]

export const baselineScenarios: Scenario[] = [
  {
    id: "scenario-variance-001",
    title: "Revenue Variance Model",
    description: "Assess pricing and volume deviations versus plan.",
    type: "variance",
    complexity: "standard",
    fields: [
      { id: "plannedVolume", label: "Planned Volume", type: "number" },
      { id: "plannedPrice", label: "Planned Price", type: "currency" },
      { id: "actualVolume", label: "Actual Volume", type: "number" },
      { id: "actualPrice", label: "Actual Price", type: "currency" },
      { id: "unitCost", label: "Unit Cost", type: "currency" },
    ],
  },
  {
    id: "scenario-optimization-001",
    title: "Price Optimization Model",
    description: "Identify optimal price points under demand elasticity.",
    type: "optimization",
    complexity: "advanced",
    fields: [
      { id: "currentPrice", label: "Current Price", type: "currency" },
      { id: "currentVolume", label: "Current Volume", type: "number" },
      { id: "elasticity", label: "Demand Elasticity", type: "percent" },
      { id: "unitCost", label: "Unit Cost", type: "currency" },
      { id: "fixedCost", label: "Fixed Cost Base", type: "currency" },
    ],
  },
  {
    id: "scenario-planning-001",
    title: "Sales Planning Model",
    description: "Forecast revenue impact across growth scenarios.",
    type: "planning",
    complexity: "standard",
    fields: [
      { id: "currentRevenue", label: "Current Revenue", type: "currency" },
      { id: "averagePrice", label: "Average Price", type: "currency" },
      { id: "growthRate", label: "Growth Rate", type: "percent" },
      { id: "grossMargin", label: "Gross Margin", type: "percent" },
    ],
  },
]

export const baselineScenarioResults: ScenarioResultData[] = [
  {
    scenario_id: "scenario-variance-001",
    input_data: {
      plannedVolume: 5200,
      plannedPrice: 120,
      actualVolume: 4900,
      actualPrice: 128,
      unitCost: 68,
    },
    result_data: {
      revenueVariance: -18400,
      priceEffect: 39200,
      volumeEffect: -57600,
    },
    created_at: iso(monthOffset(1)),
  },
]

export const baselineKpis: KPI[] = [
  {
    id: "kpi-001",
    label: "Net Operating Margin",
    value: 18.4,
    format: "percent",
    delta: 1.8,
    trend: "up",
    status: "success",
  },
  {
    id: "kpi-002",
    label: "Cash Conversion Cycle",
    value: 42,
    format: "number",
    delta: -3,
    trend: "down",
    status: "success",
  },
  {
    id: "kpi-003",
    label: "Forecast Accuracy",
    value: 92.6,
    format: "percent",
    delta: 0.6,
    trend: "up",
    status: "success",
  },
  {
    id: "kpi-004",
    label: "Cost Variance Exposure",
    value: 4.7,
    format: "percent",
    delta: 0.9,
    trend: "up",
    status: "warning",
  },
]

export const baselineTrends: TrendPoint[] = [
  { label: "Jan", value: 820000 },
  { label: "Feb", value: 790000 },
  { label: "Mar", value: 855000 },
  { label: "Apr", value: 910000 },
  { label: "May", value: 975000 },
  { label: "Jun", value: 1010000 },
]

export const baselineAlerts: AlertSignal[] = [
  {
    id: "alert-001",
    level: "warning",
    title: "Margin Compression Risk",
    description: "Indirect costs rose 6.2% month-over-month.",
  },
  {
    id: "alert-002",
    level: "risk",
    title: "Pricing Drift",
    description: "Average realized price fell below plan in two regions.",
  },
]

export const baselineRecommendations: Recommendation[] = [
  {
    id: "rec-001",
    title: "Rebalance acquisition spend",
    description: "Shift 8-10% of acquisition budget to higher LTV segments.",
    impact: "medium",
  },
  {
    id: "rec-002",
    title: "Negotiate vendor renewal",
    description: "Target 5% reductions across infrastructure vendors.",
    impact: "high",
  },
]

export const baselineAnalyses: BaselineAnalysis[] = [
  {
    id: "analysis-variance-001",
    title: "Q1 Variance Review",
    description: "Plan vs. actual variance review for the first quarter.",
    type: "variance",
    created_at: iso(monthOffset(2)),
    updated_at: iso(monthOffset(2)),
    user_id: "user-ops-lead",
    data: {
      summary: {
        totalBudget: 120000,
        totalActual: 115000,
        variance: -5000,
        variancePercent: -4.17,
      },
    },
    status: "completed",
    is_public: true,
    users: {
      id: "user-ops-lead",
      name: "Operations Lead",
      email: "ops-lead@example.com",
    },
    analyses_tags: [{ tag: "variance" }, { tag: "budget" }, { tag: "quarter" }],
  },
  {
    id: "analysis-optimization-001",
    title: "Price Optimization Sprint",
    description: "Modeled pricing adjustments to maximize contribution margin.",
    type: "optimization",
    created_at: iso(monthOffset(4)),
    updated_at: iso(monthOffset(4)),
    user_id: "user-finance",
    data: {
      summary: {
        totalCurrentRevenue: 247500,
        totalProjectedRevenue: 251550,
        totalRevenueChange: 4050,
        totalRevenueChangePercent: 1.64,
      },
    },
    status: "completed",
    is_public: true,
    users: {
      id: "user-finance",
      name: "Finance Partner",
      email: "finance@example.com",
    },
    analyses_tags: [{ tag: "pricing" }, { tag: "optimization" }, { tag: "margin" }],
  },
  {
    id: "analysis-trend-001",
    title: "Cost Trend Analysis",
    description: "Twelve-month cost trend analysis across operating categories.",
    type: "trend",
    created_at: iso(monthOffset(6)),
    updated_at: iso(monthOffset(6)),
    user_id: "user-strategy",
    data: {
      summary: {
        growthRate: 12.8,
      },
    },
    status: "completed",
    is_public: true,
    users: {
      id: "user-strategy",
      name: "Strategy Director",
      email: "strategy@example.com",
    },
    analyses_tags: [{ tag: "costs" }, { tag: "trends" }, { tag: "operations" }],
  },
]

export const baselineActivityFeed: BaselineActivity[] = [
  {
    id: "activity-001",
    user: { name: "Operations Lead", initials: "OL" },
    action: "published a variance report",
    target: "Q1 variance review",
    amount: 120000,
    date: dateOnly(monthOffset(1)),
  },
  {
    id: "activity-002",
    user: { name: "Finance Partner", initials: "FP" },
    action: "approved budget release",
    target: "Delivery plan",
    amount: 860000,
    date: dateOnly(monthOffset(2)),
  },
  {
    id: "activity-003",
    user: { name: "Strategy Director", initials: "SD" },
    action: "updated forecast assumptions",
    target: "Growth portfolio",
    date: dateOnly(monthOffset(3)),
  },
]
