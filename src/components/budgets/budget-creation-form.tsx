"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Budget name must be at least 3 characters.",
  }),
  type: z.string({
    required_error: "Select a budget type.",
  }),
  period: z.string({
    required_error: "Select a planning period.",
  }),
  startDate: z.string({
    required_error: "Select a start date.",
  }),
  endDate: z.string({
    required_error: "Select an end date.",
  }),
  amount: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  method: z.enum(["incremental", "zero", "flexible"], {
    required_error: "Select a budgeting method.",
  }),
  description: z.string().optional(),
})

export function BudgetCreationForm() {
  const [selectedType, setSelectedType] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method: "incremental",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Budget created",
      description: `${values.name} has been added to the portfolio.`,
    })
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget name</FormLabel>
                <FormControl>
                  <Input placeholder="Enterprise Operating Plan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedType(value)
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sales">Revenue</SelectItem>
                    <SelectItem value="procurement">Procurement</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="treasury">Treasury</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="general">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Type selection controls available planning inputs.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total allocation (USD)</FormLabel>
              <FormControl>
                <Input placeholder="0.00" {...field} />
              </FormControl>
              <FormDescription>Enter the total planned budget.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Budgeting method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="incremental" />
                    </FormControl>
                    <FormLabel className="font-normal">Incremental planning</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="zero" />
                    </FormControl>
                    <FormLabel className="font-normal">Zero-based planning</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="flexible" />
                    </FormControl>
                    <FormLabel className="font-normal">Flexible planning</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add strategic context for this budget..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Planning inputs - {getBudgetTypeName(selectedType)}</CardTitle>
              <CardDescription>Configure metrics specific to this budget type.</CardDescription>
            </CardHeader>
            <CardContent>{renderSpecificBudgetFields(selectedType)}</CardContent>
          </Card>
        )}

        <Button type="submit" className="w-full md:w-auto">
          Create budget
        </Button>
      </form>
    </Form>
  )
}

function getBudgetTypeName(type: string): string {
  const types: Record<string, string> = {
    sales: "Revenue",
    procurement: "Procurement",
    production: "Production",
    treasury: "Treasury",
    investment: "Investment",
    general: "Enterprise",
  }
  return types[type] || type
}

function renderSpecificBudgetFields(type: string) {
  switch (type) {
    case "sales":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="forecast-method">Forecast method</Label>
              <Select defaultValue="historical">
                <SelectTrigger id="forecast-method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="historical">Historical average</SelectItem>
                  <SelectItem value="trend">Trend analysis</SelectItem>
                  <SelectItem value="market">Market intelligence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sales-growth">Expected growth (%)</Label>
              <Input id="sales-growth" type="number" placeholder="5" />
            </div>
          </div>
        </div>
      )
    case "procurement":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplier-count">Supplier coverage</Label>
              <Input id="supplier-count" type="number" placeholder="3" />
            </div>
            <div>
              <Label htmlFor="stock-policy">Inventory policy</Label>
              <Select defaultValue="jit">
                <SelectTrigger id="stock-policy">
                  <SelectValue placeholder="Select policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jit">Just-in-time</SelectItem>
                  <SelectItem value="safety">Safety stock</SelectItem>
                  <SelectItem value="seasonal">Seasonal buffer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )
    case "production":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="production-capacity">Capacity target</Label>
              <Input id="production-capacity" type="number" placeholder="1000" />
            </div>
            <div>
              <Label htmlFor="production-unit">Output unit</Label>
              <Select defaultValue="unit">
                <SelectTrigger id="production-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unit">Units</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="batch">Batches</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )
    case "treasury":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="initial-balance">Opening balance (USD)</Label>
              <Input id="initial-balance" type="number" placeholder="10000" />
            </div>
            <div>
              <Label htmlFor="min-balance">Minimum balance (USD)</Label>
              <Input id="min-balance" type="number" placeholder="5000" />
            </div>
          </div>
        </div>
      )
    case "investment":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roi-target">ROI target (%)</Label>
              <Input id="roi-target" type="number" placeholder="15" />
            </div>
            <div>
              <Label htmlFor="investment-type">Investment focus</Label>
              <Select defaultValue="equipment">
                <SelectTrigger id="investment-type">
                  <SelectValue placeholder="Select focus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="research">Research & development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )
    case "general":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="include-subbudgets">Include budgets</Label>
              <Select defaultValue="all">
                <SelectTrigger id="include-subbudgets">
                  <SelectValue placeholder="Select inclusion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All portfolios</SelectItem>
                  <SelectItem value="operational">Operational only</SelectItem>
                  <SelectItem value="custom">Custom selection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="consolidation-method">Consolidation method</Label>
              <Select defaultValue="sum">
                <SelectTrigger id="consolidation-method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sum">Straight sum</SelectItem>
                  <SelectItem value="weighted">Weighted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )
    default:
      return null
  }
}
