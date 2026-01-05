"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { FileSpreadsheet, FileIcon as FilePdf, Lightbulb, Sliders } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type AnalysisResultsProps = {
  results: {
    type: string
    summary: {
      title: string
      description: string
      metrics: Array<{ name: string; value: number; unit?: string }>
    }
    chartData: Array<{ name: string; value: number }>
  }
  onSimulate: (payload: { type: string; baseData: unknown }) => void
}

export function AnalysisResults({ results, onSimulate }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState("summary")

  const handleSimulate = () => {
    onSimulate({
      type: results.type,
      baseData: results,
    })
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{results.summary.title}</CardTitle>
            <CardDescription>{results.summary.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button variant="outline" size="sm" disabled>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Enable the export connector to download spreadsheets.</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button variant="outline" size="sm" disabled>
                    <FilePdf className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>PDF exports are available in enterprise workspaces.</TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.summary.metrics.map((metric) => (
              <Card key={metric.name}>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground">{metric.name}</div>
                  <div className="text-2xl font-bold mt-1">
                    {metric.unit === "currency"
                      ? formatCurrency(metric.value)
                      : metric.unit === "percent"
                        ? formatPercentage(metric.value)
                        : formatNumber(metric.value)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6 space-y-6">
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Key observations</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Positive momentum holds across the current reporting window.</li>
                    <li>Material variances cluster in March and April.</li>
                    <li>Performance remains 5.2% above plan.</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Indicator</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Interpretation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Total</TableCell>
                      <TableCell className="text-right">{formatCurrency(10000)}</TableCell>
                      <TableCell>Total amount analyzed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Variance</TableCell>
                      <TableCell className="text-right text-emerald-600">+{formatPercentage(5.2)}</TableCell>
                      <TableCell>Above-plan performance</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Delta</TableCell>
                      <TableCell className="text-right text-emerald-600">+{formatCurrency(520)}</TableCell>
                      <TableCell>Favorable variance</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Planned</TableHead>
                      <TableHead className="text-right">Actual</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead className="text-right">Variance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { period: "Jan", planned: 1000, actual: 950, variance: -50, variancePercent: -5 },
                      { period: "Feb", planned: 1200, actual: 1150, variance: -50, variancePercent: -4.2 },
                      { period: "Mar", planned: 900, actual: 1100, variance: 200, variancePercent: 22.2 },
                      { period: "Apr", planned: 1500, actual: 1700, variance: 200, variancePercent: 13.3 },
                      { period: "May", planned: 1800, actual: 1900, variance: 100, variancePercent: 5.6 },
                      { period: "Jun", planned: 1200, actual: 1320, variance: 120, variancePercent: 10 },
                    ].map((row) => (
                      <TableRow key={row.period}>
                        <TableCell className="font-medium">{row.period}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.planned)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.actual)}</TableCell>
                        <TableCell className={`text-right ${row.variance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {row.variance >= 0 ? "+" : ""}
                          {formatCurrency(row.variance)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${row.variancePercent >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                        >
                          {row.variancePercent >= 0 ? "+" : ""}
                          {formatPercentage(row.variancePercent)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(7600)}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(8120)}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">+{formatCurrency(520)}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">+{formatPercentage(6.8)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="chart" className="mt-6">
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    value: {
                      label: "Value",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="value" fill="var(--color-value)" name="Value" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSimulate}>
            <Sliders className="mr-2 h-4 w-4" />
            Launch decision simulation
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
