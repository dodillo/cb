import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VarianceAnalysis } from "@/components/analysis/variance-analysis"
import { BudgetPerformance } from "@/components/analysis/budget-performance"

export default function AnalysisPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Variance Intelligence</h1>
        <p className="text-muted-foreground">Track plan vs. actual performance and surface variance drivers.</p>
      </div>

      <Tabs defaultValue="variance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="variance">Variance analysis</TabsTrigger>
          <TabsTrigger value="performance">Budget performance</TabsTrigger>
        </TabsList>

        <TabsContent value="variance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Variance overview</CardTitle>
              <CardDescription>Detailed variance by category and period.</CardDescription>
            </CardHeader>
            <CardContent>
              <VarianceAnalysis />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget performance</CardTitle>
              <CardDescription>Health signals across active budget portfolios.</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetPerformance />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
