import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BudgetCreationForm } from "@/components/budgets/budget-creation-form"
import { BudgetList } from "@/components/budgets/budget-list"

export default function BudgetsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Performance</h1>
        <p className="text-muted-foreground">Plan, govern, and track enterprise budgets end to end.</p>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create budget</TabsTrigger>
          <TabsTrigger value="list">Portfolio view</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New budget</CardTitle>
              <CardDescription>Define targets and guardrails for the next cycle.</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetCreationForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active budgets</CardTitle>
              <CardDescription>Review execution status and allocation posture.</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
