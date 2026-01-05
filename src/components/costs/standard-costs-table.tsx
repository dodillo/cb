"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCostBreakdown } from "@/hooks/useCostBreakdown"

export function StandardCostsTable() {
  const { data, isLoading, error } = useCostBreakdown()

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading standard costs...</div>
  }

  if (!data.standardCosts.length) {
    return (
      <Alert>
        <AlertDescription>No standard costs defined yet.</AlertDescription>
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

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Standard cost baselines</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" disabled title="Requires write access">
              <Plus className="h-4 w-4 mr-2" />
              Add baseline
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add standard cost</DialogTitle>
              <DialogDescription>Baseline management requires write access.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Standard cost</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Last updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.standardCosts.map((cost) => (
              <TableRow key={cost.id}>
                <TableCell>{cost.productName}</TableCell>
                <TableCell>{cost.category}</TableCell>
                <TableCell>{cost.standardCost.toLocaleString("en-US", { maximumFractionDigits: 2 })}</TableCell>
                <TableCell>{cost.unit}</TableCell>
                <TableCell>{cost.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" disabled title="Requires write access">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
