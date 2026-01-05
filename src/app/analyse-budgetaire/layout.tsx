import type React from "react"
import type { Metadata } from "next"
import { AnalyseBudgetaireNav } from "@/components/analyse-budgetaire/analyse-budgetaire-nav"

export const metadata: Metadata = {
  title: "Variance Intelligence | Financial Performance",
  description: "Analyze operational datasets and surface variance drivers.",
}

export default function AnalyseBudgetaireLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
          <AnalyseBudgetaireNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
