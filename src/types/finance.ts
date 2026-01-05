export type BudgetSummary = {
  id: string
  name: string
  type: string
  period: string
  startDate: string
  endDate: string
  amount: number
  progress: number
  status: "active" | "draft" | "closed" | "completed"
  method: string
  description?: string
  createdAt?: string
}

export type CostItem = {
  id: string
  productId: string
  productName: string
  costType: "direct" | "indirect"
  costCategory: string
  amount: number
  date: string
  description?: string
}

export type StandardCostItem = {
  id: string
  productId: string
  productName: string
  category: string
  standardCost: number
  unit: string
  lastUpdated: string
}

export type AccountingEntry = {
  id: string
  date: string
  accountNumber: string
  accountName: string
  description: string
  debit: number
  credit: number
  type: "expense" | "revenue"
  analyticalAxis: string
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
