import { getBudgets, createBudget } from "@/lib/services/budget-service"
import { baselineBudgets } from "@/lib/baseline-data"
import { hasSupabaseConfig } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json(baselineBudgets)
    }
    const budgets = await getBudgets()
    return NextResponse.json(budgets)
  } catch (error) {
    console.error("Error fetching budgets:", error)
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 })
    }
    const data = await request.json()
    const newBudget = await createBudget(data)
    return NextResponse.json(newBudget, { status: 201 })
  } catch (error) {
    console.error("Error creating budget:", error)
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 })
  }
}
