"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useFinancialOverview } from "@/hooks/useFinancialOverview"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

const getMonthLabel = (date: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(date))

export function AccountingReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [selectedAxis, setSelectedAxis] = useState("axis")
  const { data, isLoading } = useFinancialOverview()

  const { expensesByAxis, revenueByAxis, expensesByAccount, revenueByAccount, monthlyData } = useMemo(() => {
    const expensesByAxisMap = new Map<string, number>()
    const revenueByAxisMap = new Map<string, number>()
    const expensesByAccountMap = new Map<string, number>()
    const revenueByAccountMap = new Map<string, number>()
    const monthlyMap = new Map<string, { expenses: number; revenue: number }>()

    data.entries.forEach((entry) => {
      const axisKey = entry.analyticalAxis || "Unassigned"
      const accountKey = entry.accountName || entry.accountNumber
      const monthKey = getMonthLabel(entry.date)

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { expenses: 0, revenue: 0 })
      }

      if (entry.type === "expense") {
        expensesByAxisMap.set(axisKey, (expensesByAxisMap.get(axisKey) || 0) + entry.debit)
        expensesByAccountMap.set(accountKey, (expensesByAccountMap.get(accountKey) || 0) + entry.debit)
        monthlyMap.get(monthKey)!.expenses += entry.debit
      } else {
        revenueByAxisMap.set(axisKey, (revenueByAxisMap.get(axisKey) || 0) + entry.credit)
        revenueByAccountMap.set(accountKey, (revenueByAccountMap.get(accountKey) || 0) + entry.credit)
        monthlyMap.get(monthKey)!.revenue += entry.credit
      }
    })

    return {
      expensesByAxis: Array.from(expensesByAxisMap.entries()).map(([name, value]) => ({ name, value })),
      revenueByAxis: Array.from(revenueByAxisMap.entries()).map(([name, value]) => ({ name, value })),
      expensesByAccount: Array.from(expensesByAccountMap.entries()).map(([name, value]) => ({ name, value })),
      revenueByAccount: Array.from(revenueByAccountMap.entries()).map(([name, value]) => ({ name, value })),
      monthlyData: Array.from(monthlyMap.entries()).map(([name, values]) => ({
        name,
        expenses: values.expenses,
        revenue: values.revenue,
      })),
    }
  }, [data.entries])

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading analytical reports...</div>
  }

  if (!data.entries.length) {
    return (
      <Alert>
        <AlertDescription>No accounting data available.</AlertDescription>
      </Alert>
    )
  }

  const totalExpenses = expensesByAxis.reduce((sum, item) => sum + item.value, 0)
  const totalRevenue = revenueByAxis.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current quarter</SelectItem>
              <SelectItem value="previous">Previous quarter</SelectItem>
              <SelectItem value="year">Year-to-date</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAxis} onValueChange={setSelectedAxis}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Axis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="axis">By analytical axis</SelectItem>
              <SelectItem value="account">By account</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="w-full md:w-auto" disabled title="Export available in enterprise tier">
          <Download className="mr-2 h-4 w-4" />
          Export reports
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Monthly movement</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                    <Bar name="Expenses" dataKey="expenses" fill="#FF8042" />
                    <Bar name="Revenue" dataKey="revenue" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Operating result by axis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={revenueByAxis.map((item) => ({
                      name: item.name,
                      value: item.value - (expensesByAxis.find((expense) => expense.name === item.name)?.value || 0),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Bar name="Operating result" dataKey="value" fill="#82ca9d">
                      {revenueByAxis.map((item, index) => {
                        const value = item.value - (expensesByAxis.find((expense) => expense.name === item.name)?.value || 0)
                        return <Cell key={`cell-${index}`} fill={value >= 0 ? "#82ca9d" : "#ff8042"} />
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Analytical summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Total expenses</div>
                  <div className="text-2xl font-bold">
                    {totalExpenses.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="border rounded-md p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Total revenue</div>
                  <div className="text-2xl font-bold">
                    {totalRevenue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="border rounded-md p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Operating result</div>
                  <div
                    className={`text-2xl font-bold ${totalRevenue - totalExpenses >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {(totalRevenue - totalExpenses).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Expenses by axis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expensesByAxis}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expensesByAxis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Expenses by account</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expensesByAccount}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expensesByAccount.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Revenue by axis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueByAxis}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueByAxis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Revenue by account</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueByAccount}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueByAccount.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
