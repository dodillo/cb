"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ArrowRight, BarChart2, LineChartIcon, PieChartIcon, TableIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type PreviewData = {
  headers: string[]
  data: string[][]
}

type DataStructure = {
  columns: Array<{ name: string; index: number; type: string }>
}

type DataVisualizerProps = {
  data: PreviewData
  structure: DataStructure
  onContinue: () => void
}

export function DataVisualizer({ data, structure, onContinue }: DataVisualizerProps) {
  const [viewType, setViewType] = useState("table")
  const [selectedColumns, setSelectedColumns] = useState({
    x: structure?.columns[0]?.index || 0,
    y: structure?.columns.find((col) => col.type === "number")?.index || 1,
    category:
      structure?.columns.find((col) => col.type === "text" && col.index !== (structure?.columns[0]?.index || 0))
        ?.index || 0,
  })
  const [chartData, setChartData] = useState<Array<{ name: string; value: number }>>([])
  const [summaryStats, setSummaryStats] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    if (data && structure) {
      prepareChartData()
      calculateSummaryStats()
    }
  }, [data, structure, selectedColumns, viewType])

  const prepareChartData = () => {
    if (!data || !structure) return

    const xIndex = selectedColumns.x
    const yIndex = selectedColumns.y
    const categoryIndex = selectedColumns.category

    if (viewType === "bar" || viewType === "line") {
      const groupedData: Record<string, { name: string; value: number }> = {}

      data.data.forEach((row) => {
        const xValue = row[xIndex]
        const yValue = Number.parseFloat(row[yIndex]) || 0

        if (!groupedData[xValue]) {
          groupedData[xValue] = { name: xValue, value: 0 }
        }

        groupedData[xValue].value += yValue
      })

      setChartData(Object.values(groupedData))
    } else if (viewType === "pie") {
      const groupedData: Record<string, { name: string; value: number }> = {}

      data.data.forEach((row) => {
        const category = row[categoryIndex]
        const value = Number.parseFloat(row[yIndex]) || 0

        if (!groupedData[category]) {
          groupedData[category] = { name: category, value: 0 }
        }

        groupedData[category].value += value
      })

      setChartData(Object.values(groupedData))
    }
  }

  const calculateSummaryStats = () => {
    if (!data || !structure) return

    const numericColumns = structure.columns.filter((col) => col.type === "number")
    const stats: Record<string, any> = {}

    numericColumns.forEach((column) => {
      const values = data.data.map((row) => Number.parseFloat(row[column.index]) || 0)
      const sum = values.reduce((acc, val) => acc + val, 0)
      const avg = sum / values.length
      const min = Math.min(...values)
      const max = Math.max(...values)

      const sortedValues = [...values].sort((a, b) => a - b)
      const middle = Math.floor(sortedValues.length / 2)
      const median =
        sortedValues.length % 2 === 0 ? (sortedValues[middle - 1] + sortedValues[middle]) / 2 : sortedValues[middle]

      stats[column.name] = {
        sum,
        avg,
        min,
        max,
        median,
      }
    })

    setSummaryStats(stats)
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  const formatNumber = (value: number | string) => {
    return new Intl.NumberFormat("en-US").format(Number(value))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data preview</CardTitle>
        <CardDescription>Explore your dataset before configuring analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={viewType} onValueChange={setViewType}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <TableIcon className="h-4 w-4" />
              <span>Table</span>
            </TabsTrigger>
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Bar</span>
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              <span>Line</span>
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span>Pie</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {viewType !== "table" && (
              <>
                {(viewType === "bar" || viewType === "line") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="x-axis">X axis</Label>
                      <Select
                        value={selectedColumns.x.toString()}
                        onValueChange={(value) => setSelectedColumns({ ...selectedColumns, x: Number.parseInt(value) })}
                      >
                        <SelectTrigger id="x-axis">
                          <SelectValue placeholder="Select a column" />
                        </SelectTrigger>
                        <SelectContent>
                          {structure.columns.map((column) => (
                            <SelectItem key={column.index} value={column.index.toString()}>
                              {column.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="y-axis">Y axis (value)</Label>
                      <Select
                        value={selectedColumns.y.toString()}
                        onValueChange={(value) => setSelectedColumns({ ...selectedColumns, y: Number.parseInt(value) })}
                      >
                        <SelectTrigger id="y-axis">
                          <SelectValue placeholder="Select a column" />
                        </SelectTrigger>
                        <SelectContent>
                          {structure.columns
                            .filter((col) => col.type === "number")
                            .map((column) => (
                              <SelectItem key={column.index} value={column.index.toString()}>
                                {column.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {viewType === "pie" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={selectedColumns.category.toString()}
                        onValueChange={(value) =>
                          setSelectedColumns({ ...selectedColumns, category: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a column" />
                        </SelectTrigger>
                        <SelectContent>
                          {structure.columns
                            .filter((col) => col.type === "text")
                            .map((column) => (
                              <SelectItem key={column.index} value={column.index.toString()}>
                                {column.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="value">Value</Label>
                      <Select
                        value={selectedColumns.y.toString()}
                        onValueChange={(value) => setSelectedColumns({ ...selectedColumns, y: Number.parseInt(value) })}
                      >
                        <SelectTrigger id="value">
                          <SelectValue placeholder="Select a column" />
                        </SelectTrigger>
                        <SelectContent>
                          {structure.columns
                            .filter((col) => col.type === "number")
                            .map((column) => (
                              <SelectItem key={column.index} value={column.index.toString()}>
                                {column.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <TabsContent value="table" className="mt-6">
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      {data.headers.map((header) => (
                        <th key={header} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 text-sm">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {summaryStats && (
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">Summary statistics</h3>
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Column</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Sum</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Average</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Min</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Max</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Median</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(summaryStats).map(([column, stats]) => (
                          <tr key={column} className="border-t">
                            <td className="px-4 py-2 text-sm font-medium">{column}</td>
                            <td className="px-4 py-2 text-sm">{formatNumber(stats.sum)}</td>
                            <td className="px-4 py-2 text-sm">{formatNumber(stats.avg.toFixed(2))}</td>
                            <td className="px-4 py-2 text-sm">{formatNumber(stats.min)}</td>
                            <td className="px-4 py-2 text-sm">{formatNumber(stats.max)}</td>
                            <td className="px-4 py-2 text-sm">{formatNumber(stats.median)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bar" className="mt-6">
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  value: {
                    label: data.headers[selectedColumns.y],
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      label={{ value: data.headers[selectedColumns.x], position: "bottom", offset: 0 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis label={{ value: data.headers[selectedColumns.y], angle: -90, position: "left" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" fill="var(--color-value)" name={data.headers[selectedColumns.y]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="line" className="mt-6">
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  value: {
                    label: data.headers[selectedColumns.y],
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      label={{ value: data.headers[selectedColumns.x], position: "bottom", offset: 0 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis label={{ value: data.headers[selectedColumns.y], angle: -90, position: "left" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-value)"
                      name={data.headers[selectedColumns.y]}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="pie" className="mt-6">
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  value: {
                    label: data.headers[selectedColumns.y],
                    color: "hsl(var(--chart-3))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onContinue}>
          Continue to configuration
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
