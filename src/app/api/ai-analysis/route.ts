import { NextResponse } from "next/server"
import type { AIInsightRequest, AIInsightResponse } from "@/lib/ai-service"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

const toNumber = (value: unknown) => {
  if (typeof value === "number") return value
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value)
  }
  return 0
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)

const formatPercent = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(value)

const buildFallbackInsights = (request: AIInsightRequest): AIInsightResponse => {
  const { scenarioType, inputs, scenarioTitle } = request

  if (scenarioType === "variance") {
    const plannedVolume = toNumber(inputs.plannedVolume)
    const plannedPrice = toNumber(inputs.plannedPrice)
    const actualVolume = toNumber(inputs.actualVolume)
    const actualPrice = toNumber(inputs.actualPrice)
    const unitCost = toNumber(inputs.unitCost)

    const plannedRevenue = plannedVolume * plannedPrice
    const actualRevenue = actualVolume * actualPrice
    const variance = actualRevenue - plannedRevenue
    const marginVariance = actualRevenue - actualVolume * unitCost - (plannedRevenue - plannedVolume * unitCost)

    return {
      executiveSummary: `${scenarioTitle} highlights a ${variance >= 0 ? "positive" : "negative"} revenue variance of ${formatCurrency(Math.abs(variance))}.`,
      riskSignals: [
        variance < 0 ? "Revenue shortfall versus plan." : "Revenue uplift driven by pricing or volume.",
        marginVariance < 0 ? "Gross margin compression detected." : "Margin resilience maintained.",
      ],
      optimizationOpportunities: [
        "Identify the primary driver between pricing and volume effects.",
        "Isolate cost drivers with elevated variance exposure.",
      ],
      recommendations: [
        "Reinforce pricing governance for high-variance segments.",
        "Prioritize demand recovery actions in underperforming regions.",
        "Launch a margin protection review with procurement and finance.",
      ],
    }
  }

  if (scenarioType === "optimization") {
    const currentPrice = toNumber(inputs.currentPrice)
    const currentVolume = toNumber(inputs.currentVolume)
    const elasticityRaw = toNumber(inputs.elasticity)
    const elasticity = elasticityRaw > 0 ? -elasticityRaw : elasticityRaw || -2.2
    const unitCost = toNumber(inputs.unitCost)
    const fixedCost = toNumber(inputs.fixedCost)

    const rawOptimalPrice = unitCost * (elasticity / (1 + elasticity))
    const optimalPrice = Number.isFinite(rawOptimalPrice)
      ? Math.max(unitCost * 1.05, Math.min(rawOptimalPrice, unitCost * 2.5))
      : currentPrice
    const optimalVolume = currentPrice > 0 ? currentVolume * Math.pow(optimalPrice / currentPrice, elasticity) : currentVolume
    const currentProfit = currentPrice * currentVolume - unitCost * currentVolume - fixedCost
    const optimalProfit = optimalPrice * optimalVolume - unitCost * optimalVolume - fixedCost
    const uplift = optimalProfit - currentProfit

    return {
      executiveSummary: `${scenarioTitle} indicates a modeled profit uplift of ${formatCurrency(Math.abs(uplift))} at the optimized price point.`,
      riskSignals: [
        optimalPrice > currentPrice ? "Higher price points may reduce volume if elasticity is underestimated." : "Discounting risks margin erosion.",
        "Demand elasticity assumptions require validation against recent sales data.",
      ],
      optimizationOpportunities: [
        `Target price band around ${formatCurrency(optimalPrice)} for margin optimization.`,
        "Segment pricing by channel to reduce volume volatility.",
      ],
      recommendations: [
        "Run controlled price experiments with short feedback loops.",
        "Align sales incentives to margin outcomes.",
        "Monitor win-rate and churn signals during pricing transitions.",
      ],
    }
  }

  const currentRevenue = toNumber(inputs.currentRevenue)
  const growthRate = toNumber(inputs.growthRate)
  const grossMargin = toNumber(inputs.grossMargin)
  const forecastRevenue = currentRevenue * (1 + growthRate)

  return {
    executiveSummary: `${scenarioTitle} projects ${formatPercent(growthRate)} revenue growth to ${formatCurrency(forecastRevenue)}.`,
    riskSignals: [
      grossMargin < 0.35 ? "Gross margin target is below enterprise thresholds." : "Margin discipline remains within target range.",
      "Growth assumptions require quarterly validation against pipeline coverage.",
    ],
    optimizationOpportunities: [
      "Align capacity planning with projected demand growth.",
      "Balance pricing and channel mix to protect margin.",
    ],
    recommendations: [
      "Establish a quarterly re-forecast cadence.",
      "Track pipeline velocity and conversion rates against the plan.",
      "Coordinate with operations to secure supply for forecasted volume.",
    ],
  }
}

const buildPrompt = (request: AIInsightRequest) => {
  const { scenarioTitle, scenarioType, scenarioDescription, inputs } = request
  const inputText = Object.entries(inputs)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")

  return `
You are the Decision Support Engine for an enterprise finance platform.
Evaluate the scenario and return actionable insights in a consulting tone.
Use verbs like identify, evaluate, optimize, recommend. Avoid "exercise", "student", "classroom", "explain", "calculate".
Return JSON only with the following keys:
executiveSummary (string),
riskSignals (array of strings),
optimizationOpportunities (array of strings),
recommendations (array of strings).

SCENARIO TITLE: ${scenarioTitle}
SCENARIO TYPE: ${scenarioType}
DESCRIPTION: ${scenarioDescription}

INPUTS:
${inputText}
`
}

const parseJsonResponse = (text: string): AIInsightResponse | null => {
  const cleaned = text.trim().replace(/```json|```/g, "").trim()
  try {
    const parsed = JSON.parse(cleaned) as AIInsightResponse
    return {
      executiveSummary: parsed.executiveSummary || "Executive summary not available.",
      riskSignals: Array.isArray(parsed.riskSignals) ? parsed.riskSignals : [],
      optimizationOpportunities: Array.isArray(parsed.optimizationOpportunities) ? parsed.optimizationOpportunities : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      rawResponse: text,
    }
  } catch (error) {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AIInsightRequest

    if (!body.scenarioType || !body.inputs) {
      return NextResponse.json({ error: "Scenario inputs are required." }, { status: 400 })
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(buildFallbackInsights(body))
    }

    const prompt = buildPrompt(body)

    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1200,
        },
      }),
    })

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json()
      console.error("Gemini error:", errorData)
      return NextResponse.json(buildFallbackInsights(body))
    }

    const geminiData = await geminiResponse.json()
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""
    const parsed = parseJsonResponse(text)

    if (!parsed) {
      return NextResponse.json(buildFallbackInsights(body))
    }

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error("AI analysis error:", error)
    return NextResponse.json({ error: "Unable to generate automated insights." }, { status: 500 })
  }
}
