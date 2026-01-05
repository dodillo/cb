import type { Metadata } from "next"
import { DataImporterEnhanced } from "@/components/analyse-budgetaire/data-importer-enhanced"

export const metadata: Metadata = {
  title: "Data Intake | Financial Performance",
  description: "Import operational datasets for budget intelligence",
}

export default function ImportationPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Intake</h1>
        <p className="text-muted-foreground">Import operational datasets to begin analysis.</p>
      </div>

      <DataImporterEnhanced />
    </div>
  )
}
