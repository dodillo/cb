"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Cell } from "recharts"
import {
  ArrowDown,
  ArrowUp,
  BarChart2,
  Download,
  FileText,
  Lightbulb,
  Sliders,
  TableIcon,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useVarianceInsights } from "@/hooks/useVarianceInsights"
import type { VarianceRecord } from "@/types/finance"

export function VarianceAnalysisEnhanced() {
  const [activeTab, setActiveTab] = useState("table")
  const [period, setPeriod] = useState("all")
  const [category, setCategory] = useState("all")
  const [threshold, setThreshold] = useState(10)
  const [showPercentage, setShowPercentage] = useState(true)
  const [highlightSignificant, setHighlightSignificant] = useState(true)
  const [showTotals, setShowTotals] = useState(true)
  const [sortBy, setSortBy] = useState<keyof VarianceRecord>("variance")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const { data, kpis, alerts, recommendations, isLoading, error, source } = useVarianceInsights()

  const periods = useMemo(() => {
    const values = Array.from(new Set((data ?? []).map((item) => item.period)))
    return values.sort()
  }, [data])

  const categories = useMemo(() => {
    const values = Array.from(new Set((data ?? []).map((item) => item.category)))
    return values.sort()
  }, [data])

  const filteredData = useMemo(() => {
    const records = (data ?? [])
      .filter((item) => {
        if (period !== "all" && item.period !== period) return false
        if (category !== "all" && item.category !== category) return false
        return true
      })
      .sort((a, b) => {
        const order = sortOrder === "asc" ? 1 : -1
        const aValue = a[sortBy]
        const bValue = b[sortBy]
        if (aValue < bValue) return -1 * order
        if (aValue > bValue) return 1 * order
        return 0
      })

    return records
  }, [data, period, category, sortBy, sortOrder])

  const totals = useMemo(() => {
    const base = filteredData.reduce(
      (acc, item) => {
        acc.planned += item.planned
        acc.actual += item.actual
        acc.variance += item.variance
        return acc
      },
      { planned: 0, actual: 0, variance: 0 },
    )

    return {
      ...base,
      variancePercent: base.planned !== 0 ? (base.variance / base.planned) * 100 : 0,
    }
  }, [filteredData])

  const chartData = useMemo(() => {
    if (!data?.length) return []

    if (period === "all") {
      return data.reduce((acc: Array<{ name: string; planned: number; actual: number; variance: number }>, item) => {
        const existing = acc.find((entry) => entry.name === item.period)
        if (existing) {
          existing.planned += item.planned
          existing.actual += item.actual
          existing.variance += item.variance
        } else {
          acc.push({
            name: item.period,
            planned: item.planned,
            actual: item.actual,
            variance: item.variance,
          })
        }
        return acc
      }, [])
    }

    return data
      .filter((item) => item.period === period)
      .map((item) => ({
        name: item.category,
        planned: item.planned,
        actual: item.actual,
        variance: item.variance,
      }))
  }, [data, period])

  const distributionData = useMemo(() => {
    if (!data?.length) return []

    if (category === "all") {
      return data.reduce((acc: Array<{ name: string; value: number }>, item) => {
        const existing = acc.find((entry) => entry.name === item.category)
        if (existing) {
          existing.value += Math.abs(item.variance)
        } else {
          acc.push({
            name: item.category,
            value: Math.abs(item.variance),
          })
        }
        return acc
      }, [])
    }

    return data
      .filter((item) => item.category === category)
      .map((item) => ({
        name: item.period,
        value: Math.abs(item.variance),
      }))
  }, [data, category])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  const getVarianceColor = (variance: number, variancePercent: number) => {
    if (Math.abs(variancePercent) < threshold) {
      return "text-muted-foreground"
    }
    return variance >= 0 ? "text-emerald-600" : "text-rose-600"
  }

  const getVarianceBgColor = (variance: number, variancePercent: number) => {
    if (!highlightSignificant || Math.abs(variancePercent) < threshold) {
      return ""
    }
    return variance >= 0 ? "bg-emerald-50 dark:bg-emerald-950" : "bg-rose-50 dark:bg-rose-950"
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Analysis controls</CardTitle>
            <CardDescription>Configure filters and thresholds for variance intelligence.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All periods</SelectItem>
                    {periods.map((entry) => (
                      <SelectItem key={entry} value={entry}>
                        {entry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((entry) => (
                      <SelectItem key={entry} value={entry}>
                        {entry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold">Material variance threshold (%)</Label>
                  <span className="text-sm text-muted-foreground">{threshold}%</span>
                </div>
                <Slider
                  id="threshold"
                  value={[threshold]}
                  min={5}
                  max={25}
                  step={1}
                  onValueChange={(value) => setThreshold(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label>Display options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-percentage" checked={showPercentage} onCheckedChange={setShowPercentage} />
                    <label
                      htmlFor="show-percentage"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show percentages
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="highlight-significant"
                      checked={highlightSignificant}
                      onCheckedChange={setHighlightSignificant}
                    />
                    <label
                      htmlFor="highlight-significant"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Highlight material variances
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-totals" checked={showTotals} onCheckedChange={setShowTotals} />
                    <label
                      htmlFor="show-totals"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show totals
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="sort-by" className="whitespace-nowrap">
                  Sort by
                </Label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as keyof VarianceRecord)}>
                  <SelectTrigger id="sort-by" className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="period">Period</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="actual">Actual</SelectItem>
                    <SelectItem value="variance">Variance</SelectItem>
                    <SelectItem value="variancePercent">Variance %</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="h-9 w-9"
                >
                  {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Data source: {source === "supabase" ? "Live" : "Baseline"}
              </div>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Loading variance data...</span>
                  <span className="text-sm">Please wait</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Unable to load variance data</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && (!data || data.length === 0) && (
              <Alert>
                <AlertTitle>No variance data available</AlertTitle>
                <AlertDescription>Connect a dataset or load the baseline feed to continue.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {!isLoading && !error && data && data.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Variance intelligence</CardTitle>
                  <CardDescription>Compare planned vs. actual values and surface material drivers.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Intelligence brief
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Decision support insights</SheetTitle>
                      </SheetHeader>
                      <div className="space-y-4 py-4">
                        {alerts.map((alert) => (
                          <Alert key={alert.id} variant={alert.level === "risk" ? "destructive" : "default"}>
                            <AlertTitle>{alert.title}</AlertTitle>
                            <AlertDescription>{alert.description}</AlertDescription>
                          </Alert>
                        ))}
                        {recommendations.map((rec) => (
                          <Alert key={rec.id}>
                            <AlertTitle>{rec.title}</AlertTitle>
                            <AlertDescription>{rec.description}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button variant="outline" size="sm" disabled>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Export module requires an admin-enabled connector.</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button variant="outline" size="sm" disabled>
                          <FileText className="mr-2 h-4 w-4" />
                          Report
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Reporting module is available in enterprise workspaces.</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                  <Card key={kpi.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {kpi.format === "currency"
                          ? formatCurrency(kpi.value as number)
                          : kpi.format === "percent"
                            ? formatPercentage((kpi.value as number) * 100)
                            : kpi.value}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="table" className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4" />
                    <span>Table</span>
                  </TabsTrigger>
                  <TabsTrigger value="chart" className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    <span>Variance chart</span>
                  </TabsTrigger>
                  <TabsTrigger value="distribution" className="flex items-center gap-2">
                    <Sliders className="h-4 w-4" />
                    <span>Distribution</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="mt-6">
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Period</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Planned</TableHead>
                            <TableHead className="text-right">Actual</TableHead>
                            <TableHead className="text-right">Variance</TableHead>
                            {showPercentage && <TableHead className="text-right">Variance %</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredData.map((item) => (
                            <TableRow key={item.id} className={getVarianceBgColor(item.variance, item.variancePercent)}>
                              <TableCell>{item.period}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.planned)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.actual)}</TableCell>
                              <TableCell className={`text-right ${getVarianceColor(item.variance, item.variancePercent)}`}>
                                {item.variance >= 0 ? "+" : ""}
                                {formatCurrency(item.variance)}
                              </TableCell>
                              {showPercentage && (
                                <TableCell
                                  className={`text-right ${getVarianceColor(item.variance, item.variancePercent)}`}
                                >
                                  {item.variancePercent >= 0 ? "+" : ""}
                                  {formatPercentage(item.variancePercent)}
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                          {showTotals && (
                            <TableRow className="font-bold bg-muted">
                              <TableCell colSpan={2}>Total</TableCell>
                              <TableCell className="text-right">{formatCurrency(totals.planned)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(totals.actual)}</TableCell>
                              <TableCell className={`text-right ${getVarianceColor(totals.variance, totals.variancePercent)}`}>
                                {totals.variance >= 0 ? "+" : ""}
                                {formatCurrency(totals.variance)}
                              </TableCell>
                              {showPercentage && (
                                <TableCell
                                  className={`text-right ${getVarianceColor(totals.variance, totals.variancePercent)}`}
                                >
                                  {totals.variancePercent >= 0 ? "+" : ""}
                                  {formatPercentage(totals.variancePercent)}
                                </TableCell>
                              )}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="chart" className="mt-6">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Legend />
                        <Bar dataKey="planned" name="Planned" fill="#8884d8" />
                        <Bar dataKey="actual" name="Actual" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="distribution" className="mt-6">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={distributionData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Legend />
                        <Bar dataKey="value" name="Absolute variance" fill="#8884d8">
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2" asChild>
                <Link href="/scenarios">
                  <Sliders className="mr-2 h-4 w-4" />
                  Launch automated intelligence
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
