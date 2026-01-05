"use client"

import { useEffect, useState } from "react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SectionLoading } from "@/components/accounting/section-loading"
import { baselineProducts } from "@/lib/baseline-data"

const formSchema = z.object({
  date: z.string({
    required_error: "Select a date",
  }),
  type: z.enum(["expense", "revenue"], {
    required_error: "Select a transaction type",
  }),
  accountNumber: z.string().min(1, {
    message: "Enter an account number",
  }),
  amount: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters",
  }),
  analyticalAxis: z.string({
    required_error: "Select an allocation axis",
  }),
  productId: z.string().optional(),
})

const expenseAccounts = [
  { number: "600", name: "Procurement" },
  { number: "610", name: "External Services" },
  { number: "620", name: "Professional Services" },
  { number: "630", name: "Taxes and Fees" },
  { number: "640", name: "People Operations" },
  { number: "650", name: "General & Administrative" },
  { number: "660", name: "Finance Costs" },
  { number: "670", name: "Non-Operating Expenses" },
  { number: "680", name: "Depreciation & Amortization" },
]

const revenueAccounts = [
  { number: "700", name: "Product Revenue" },
  { number: "710", name: "Services Revenue" },
  { number: "720", name: "Subscription Revenue" },
  { number: "740", name: "Operating Grants" },
  { number: "750", name: "Other Operating Income" },
  { number: "760", name: "Finance Income" },
  { number: "770", name: "Non-Operating Income" },
  { number: "780", name: "Provision Reversals" },
  { number: "790", name: "Cost Reallocations" },
]

const analyticalAxes = [
  { id: "product", name: "By product" },
  { id: "department", name: "By department" },
  { id: "project", name: "By initiative" },
  { id: "activity", name: "By activity" },
]

const departments = [
  { id: "ops", name: "Operations" },
  { id: "finance", name: "Finance" },
  { id: "sales", name: "Commercial" },
  { id: "admin", name: "Shared Services" },
]

const projects = [
  { id: "proj1", name: "Efficiency Program" },
  { id: "proj2", name: "Market Expansion" },
  { id: "proj3", name: "Data Modernization" },
]

const activities = [
  { id: "act1", name: "Delivery" },
  { id: "act2", name: "Enablement" },
  { id: "act3", name: "Marketing" },
  { id: "act4", name: "Support" },
]

export function AccountingEntryForm() {
  const [entryType, setEntryType] = useState<"expense" | "revenue">("expense")
  const [analyticalAxis, setAnalyticalAxis] = useState<string>("product")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("simple")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      description: "",
      analyticalAxis: "product",
    },
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    setTimeout(() => {
      toast({
        title: "Entry saved",
        description: `A ${values.type} entry for $${values.amount} has been recorded.`,
      })
      form.reset({
        type: entryType,
        analyticalAxis: analyticalAxis,
        date: "",
        accountNumber: "",
        amount: "",
        description: "",
        productId: "",
      })
      setLoading(false)
    }, 800)
  }

  if (loading) {
    return <SectionLoading title="Preparing form" description="Loading accounts and allocation axes..." />
  }

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="simple"
        className="w-full"
        value={activeTab}
        onValueChange={(value) => {
          setLoading(true)
          setTimeout(() => {
            setActiveTab(value)
            setLoading(false)
          }, 600)
        }}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple">Quick entry</TabsTrigger>
          <TabsTrigger value="advanced">Detailed journal</TabsTrigger>
        </TabsList>

        <TabsContent value="simple">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Transaction type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value: "expense" | "revenue") => {
                            field.onChange(value)
                            setEntryType(value)
                            form.setValue("accountNumber", "")
                          }}
                          defaultValue={field.value}
                          className="flex flex-row space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="expense" />
                            </FormControl>
                            <FormLabel className="font-normal">Expense</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="revenue" />
                            </FormControl>
                            <FormLabel className="font-normal">Revenue</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(entryType === "expense" ? expenseAccounts : revenueAccounts).map((account) => (
                          <SelectItem key={account.number} value={account.number}>
                            {account.number} - {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the account aligned to your chart of accounts.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (USD)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="analyticalAxis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allocation axis</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setAnalyticalAxis(value)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an axis" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {analyticalAxes.map((axis) => (
                            <SelectItem key={axis.id} value={axis.id}>
                              {axis.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Allocate the entry by the chosen dimension.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {analyticalAxis === "product" && (
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {baselineProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {analyticalAxis === "department" && (
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {analyticalAxis === "project" && (
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initiative</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an initiative" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {analyticalAxis === "activity" && (
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an activity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activities.map((activity) => (
                            <SelectItem key={activity.id} value={activity.id}>
                              {activity.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the transaction..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full md:w-auto">
                Save entry
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Journal entry builder</h3>
                <p className="text-sm text-muted-foreground">
                  Capture multi-line debit and credit lines for a complete journal entry.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reference</label>
                    <Input placeholder="Invoice, receipt, or memo ID" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Entry description</label>
                  <Input placeholder="Vendor services for April" />
                </div>

                <div className="border rounded-md p-4 space-y-4">
                  <h4 className="font-medium">Entry lines</h4>

                  <div className="border-b pb-4">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-4">
                        <label className="text-xs font-medium">Account</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="601">601 - Procurement</SelectItem>
                            <SelectItem value="607">607 - Supplies</SelectItem>
                            <SelectItem value="512">512 - Bank</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs font-medium">Debit</label>
                        <Input placeholder="0.00" />
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs font-medium">Credit</label>
                        <Input placeholder="0.00" />
                      </div>
                      <div className="col-span-2 flex items-end">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Axis" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="department">Department</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="border-b pb-4">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-4">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="401">401 - Vendors</SelectItem>
                            <SelectItem value="44566">44566 - Tax</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <Input placeholder="0.00" />
                      </div>
                      <div className="col-span-3">
                        <Input placeholder="0.00" />
                      </div>
                      <div className="col-span-2">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Axis" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="department">Department</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    + Add line
                  </Button>
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <div>
                    <span className="text-sm font-medium">Total debit: </span>
                    <span>$0.00</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Total credit: </span>
                    <span>$0.00</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Difference: </span>
                    <span className="text-rose-500">$0.00</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="w-full md:w-auto">Save journal entry</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
