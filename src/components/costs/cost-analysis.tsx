"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { useCostBreakdown } from "@/hooks/useCostBreakdown"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useMemo, useState } from "react"

export function CostAnalysis() {
  const { data, isLoading, error } = useCostBreakdown()
  const [selectedProduct, setSelectedProduct] = useState("portfolio")

  const varianceData = data.varianceByCategory
  const trendData = useMemo(
    () =>
      data.varianceByCategory.map((row, index) => ({
        month: `M${index + 1}`,
        standard: row.standard,
        actual: row.actual,
      })),
    [data.varianceByCategory],
  )

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading cost analysis...</div>
  }

  if (!varianceData.length) {
    return (
      <Alert>
        <AlertDescription>No cost variance data available.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Cost variance comparison</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Scope:</span>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portfolio">Portfolio</SelectItem>
              <SelectItem value="core-platform">Core Platform</SelectItem>
              <SelectItem value="managed-services">Managed Services</SelectItem>
              <SelectItem value="integrations">Data Integrations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="variance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="variance">Variance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="variance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Standard vs. actual costs</CardTitle>
              <CardDescription>Variance by category for the selected scope.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={varianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Bar name="Standard" dataKey="standard" fill="#8884d8" />
                  <Bar name="Actual" dataKey="actual" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Standard
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actual
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variance %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {varianceData.map((item) => (
                      <tr key={item.category}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.standard.toLocaleString("en-US")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.actual.toLocaleString("en-US")}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${item.variance >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                        >
                          {item.variance >= 0 ? "+" : ""}
                          {item.variance.toLocaleString("en-US")}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${item.variancePercent >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                        >
                          {item.variancePercent >= 0 ? "+" : ""}
                          {item.variancePercent.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Six-period trend</CardTitle>
              <CardDescription>Standard vs. actual cost movement.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="standard" name="Standard" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="actual" name="Actual" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
