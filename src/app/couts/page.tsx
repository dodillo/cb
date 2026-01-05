import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CostEntryForm } from "@/components/costs/cost-entry-form"
import { StandardCostsTable } from "@/components/costs/standard-costs-table"
import { CostAnalysis } from "@/components/costs/cost-analysis"

export default function CostsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cost Structure</h1>
        <p className="text-muted-foreground">Track direct and indirect cost drivers across the portfolio.</p>
      </div>

      <Tabs defaultValue="entry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entry">Capture costs</TabsTrigger>
          <TabsTrigger value="standards">Standard costs</TabsTrigger>
          <TabsTrigger value="analysis">Cost intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="entry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost capture</CardTitle>
              <CardDescription>Log operational spend by product or program.</CardDescription>
            </CardHeader>
            <CardContent>
              <CostEntryForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Standard costs</CardTitle>
              <CardDescription>Maintain baseline cost assumptions by category.</CardDescription>
            </CardHeader>
            <CardContent>
              <StandardCostsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost variance</CardTitle>
              <CardDescription>Compare actuals to standard baselines.</CardDescription>
            </CardHeader>
            <CardContent>
              <CostAnalysis />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
