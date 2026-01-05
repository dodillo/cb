"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, FileDown, Pencil, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useBudgets } from "@/hooks/useBudgets"
import type { BudgetSummary } from "@/types/finance"

const getBudgetTypeName = (type: string) => {
  const types: Record<string, string> = {
    sales: "Revenue",
    procurement: "Procurement",
    production: "Production",
    treasury: "Treasury",
    investment: "Investment",
    general: "Enterprise",
    operating: "Operating",
  }
  return types[type] || type
}

const getPeriodName = (period: string) => {
  const periods: Record<string, string> = {
    monthly: "Monthly",
    quarterly: "Quarterly",
    annual: "Annual",
  }
  return periods[period] || period
}

const getStatusBadge = (status: BudgetSummary["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-emerald-500">Active</Badge>
    case "completed":
      return <Badge className="bg-blue-500">Closed</Badge>
    case "draft":
      return <Badge className="bg-amber-500">Draft</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export function BudgetList() {
  const { data: budgets, isLoading, error, source } = useBudgets()
  const [selectedBudget, setSelectedBudget] = useState<BudgetSummary | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const formattedBudgets = useMemo(
    () =>
      budgets.map((budget) => ({
        ...budget,
        displayAmount: budget.amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
      })),
    [budgets],
  )

  const viewDetails = (budget: BudgetSummary) => {
    setSelectedBudget(budget)
    setIsDetailsOpen(true)
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading budgets...</div>
  }

  if (!formattedBudgets.length) {
    return (
      <Alert>
        <AlertDescription>No budgets available yet.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formattedBudgets.map((budget) => (
          <Card key={budget.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium truncate" title={budget.name}>
                    {budget.name}
                  </h3>
                  {getStatusBadge(budget.status)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  <div>Type: {getBudgetTypeName(budget.type)}</div>
                  <div>Period: {getPeriodName(budget.period)}</div>
                  <div>Amount: {budget.displayAmount}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Execution</span>
                    <span>{budget.progress}%</span>
                  </div>
                  <Progress value={budget.progress} className="h-2" />
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {source === "baseline" ? "Baseline mode" : "Live data"}
                </div>
              </div>
              <div className="border-t p-3 bg-muted/50 flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => viewDetails(budget)}>
                  <Eye className="h-4 w-4 mr-1" />
                  Details
                </Button>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" disabled title="Requires write access">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" disabled title="Requires write access">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" disabled title="Export available in enterprise tier">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedBudget && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedBudget.name}</DialogTitle>
                <DialogDescription>Budget detail view</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="allocation">Allocation</TabsTrigger>
                  <TabsTrigger value="progress">Execution</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Budget type</h4>
                      <p>{getBudgetTypeName(selectedBudget.type)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Period</h4>
                      <p>{getPeriodName(selectedBudget.period)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Start date</h4>
                      <p>{new Date(selectedBudget.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">End date</h4>
                      <p>{new Date(selectedBudget.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Total allocation</h4>
                      <p>{selectedBudget.amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Status</h4>
                      <p>{getStatusBadge(selectedBudget.status)}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="allocation">
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-3">Allocation overview</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Core operations</span>
                        <span>45% allocation</span>
                      </div>
                      <Progress value={45} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span>Growth initiatives</span>
                        <span>30% allocation</span>
                      </div>
                      <Progress value={30} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span>Enablement</span>
                        <span>25% allocation</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="progress">
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-3">Execution status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall execution</span>
                        <span>{selectedBudget.progress}%</span>
                      </div>
                      <Progress value={selectedBudget.progress} className="h-2" />
                    </div>

                    <div className="mt-6 space-y-4">
                      <h4 className="text-sm font-medium">Execution detail</h4>

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Allocated</span>
                          <span>{selectedBudget.amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Committed</span>
                          <span>
                            {Math.round((selectedBudget.amount * selectedBudget.progress) / 100).toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Remaining</span>
                          <span>
                            {Math.round(
                              (selectedBudget.amount * (100 - selectedBudget.progress)) / 100,
                            ).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
