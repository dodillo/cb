"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, FileUp, ArrowRight } from "lucide-react"
import { AnalyseBudgetaireStats } from "@/components/analyse-budgetaire/analyse-budgetaire-stats"
import { RecentAnalyses } from "@/components/analyse-budgetaire/recent-analyses"

export default function BudgetAnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial Performance</h1>
        <p className="text-muted-foreground">Operational datasets and automated insights for budget performance.</p>
      </div>

      <AnalyseBudgetaireStats />

      <Tabs defaultValue="analyses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analyses">Recent intelligence</TabsTrigger>
          <TabsTrigger value="modules">Core modules</TabsTrigger>
        </TabsList>
        <TabsContent value="analyses" className="space-y-4">
          <RecentAnalyses />
        </TabsContent>
        <TabsContent value="modules" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data intake</CardTitle>
                <FileUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Import operational datasets from CSV or spreadsheet sources.
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/analyse-budgetaire/importation" passHref>
                  <Button variant="outline" size="sm" className="w-full">
                    <span>Import data</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Variance intelligence</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Compare planned and actual values to surface variance drivers.
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/analyse-budgetaire/ecarts" passHref>
                  <Button variant="outline" size="sm" className="w-full">
                    <span>Review variance</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
