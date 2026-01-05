import type { Metadata } from "next"
import { VarianceAnalysisEnhanced } from "@/components/analyse-budgetaire/variance-analysis-enhanced"

export const metadata: Metadata = {
  title: "Variance Intelligence | Financial Performance",
  description: "Compare planned and actual values to surface variance drivers",
}

export default function EcartsPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Variance Intelligence</h1>
        <p className="text-muted-foreground">
          Evaluate planned vs. actual performance and isolate material variances.
        </p>
      </div>

      <VarianceAnalysisEnhanced />
    </div>
  )
}
