import { getProducts, createProduct } from "@/lib/services/product-service"
import { baselineProducts } from "@/lib/baseline-data"
import { hasSupabaseConfig } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json(baselineProducts)
    }
    const products = await getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 })
    }
    const data = await request.json()
    const newProduct = await createProduct(data)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
