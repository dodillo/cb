"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, RefreshCw } from "lucide-react"

type SimulationToolProps = {
  initialParams?: {
    priceChange?: number
    quantityChange?: number
    costChange?: number
  }
  data?: unknown
  results?: unknown
}

export function SimulationTool({ initialParams }: SimulationToolProps) {
  const [simulationParams, setSimulationParams] = useState({
    priceChange: initialParams?.priceChange ?? 0,
    quantityChange: initialParams?.quantityChange ?? 0,
    costChange: initialParams?.costChange ?? 0,
  })
  const [simulationResults, setSimulationResults] = useState<{
    baseValue: number
    newValue: number
    percentChange: number
    breakdown: {
      priceEffect: number
      quantityEffect: number
      costEffect: number
    }
  } | null>(null)
  const [comparisonData, setComparisonData] = useState<Array<{ name: string; value: number }>>([])
  const [optimumFound, setOptimumFound] = useState<{ message: string; improvement: number } | null>(null)

  useEffect(() => {
    runSimulation(simulationParams)
  }, [])

  const runSimulation = (params: { priceChange: number; quantityChange: number; costChange: number }) => {
    const baseValue = 10000
    const priceEffect = baseValue * (params.priceChange / 100) * -1.5
    const quantityEffect = baseValue * (params.quantityChange / 100)
    const costEffect = baseValue * (params.costChange / 100) * -1

    const newValue = baseValue + priceEffect + quantityEffect + costEffect
    const percentChange = (newValue / baseValue - 1) * 100

    const simulatedResults = {
      baseValue,
      newValue,
      percentChange,
      breakdown: {
        priceEffect,
        quantityEffect,
        costEffect,
      },
    }

    setSimulationResults(simulatedResults)

    setComparisonData([
      { name: "Baseline", value: baseValue },
      { name: "Modeled", value: newValue },
    ])

    if (Math.abs(params.priceChange) > 5 && newValue > baseValue * 1.1) {
      setOptimumFound({
        message: `A ${params.priceChange}% price adjustment appears optimal.`,
        improvement: percentChange,
      })
    } else {
      setOptimumFound(null)
    }
  }

  const handleParamChange = (param: "priceChange" | "quantityChange" | "costChange", value: number) => {
    const newParams = { ...simulationParams, [param]: value }
    setSimulationParams(newParams)
    runSimulation(newParams)
  }

  const handleSliderChange = (param: "priceChange" | "quantityChange" | "costChange", value: number[]) => {
    handleParamChange(param, value[0])
  }

  const handleInputChange = (param: "priceChange" | "quantityChange" | "costChange", e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0
    handleParamChange(param, value)
  }

  const handleReset = () => {
    const resetParams = {
      priceChange: 0,
      quantityChange: 0,
      costChange: 0,
    }
    setSimulationParams(resetParams)
    runSimulation(resetParams)
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
    <Card>
      <CardHeader>
        <CardTitle>Decision simulation</CardTitle>
        <CardDescription>Model price, volume, and cost changes to evaluate impact.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Price adjustment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[simulationParams.priceChange]}
                    min={-20}
                    max={20}
                    step={1}
                    onValueChange={(value) => handleSliderChange("priceChange", value)}
                    className="flex-1"
                  />
                  <div className="w-16">
                    <Input
                      type="number"
                      value={simulationParams.priceChange}
                      onChange={(e) => handleInputChange("priceChange", e)}
                      className="text-center"
                    />
                  </div>
                  <div className="w-6 text-sm">%</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {simulationParams.priceChange > 0
                    ? `Increase of ${simulationParams.priceChange}%`
                    : simulationParams.priceChange < 0
                      ? `Decrease of ${Math.abs(simulationParams.priceChange)}%`
                      : "No price change"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Volume adjustment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[simulationParams.quantityChange]}
                    min={-20}
                    max={20}
                    step={1}
                    onValueChange={(value) => handleSliderChange("quantityChange", value)}
                    className="flex-1"
                  />
                  <div className="w-16">
                    <Input
                      type="number"
                      value={simulationParams.quantityChange}
                      onChange={(e) => handleInputChange("quantityChange", e)}
                      className="text-center"
                    />
                  </div>
                  <div className="w-6 text-sm">%</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {simulationParams.quantityChange > 0
                    ? `Increase of ${simulationParams.quantityChange}%`
                    : simulationParams.quantityChange < 0
                      ? `Decrease of ${Math.abs(simulationParams.quantityChange)}%`
                      : "No volume change"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Cost adjustment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[simulationParams.costChange]}
                    min={-20}
                    max={20}
                    step={1}
                    onValueChange={(value) => handleSliderChange("costChange", value)}
                    className="flex-1"
                  />
                  <div className="w-16">
                    <Input
                      type="number"
                      value={simulationParams.costChange}
                      onChange={(e) => handleInputChange("costChange", e)}
                      className="text-center"
                    />
                  </div>
                  <div className="w-6 text-sm">%</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {simulationParams.costChange > 0
                    ? `Increase of ${simulationParams.costChange}%`
                    : simulationParams.costChange < 0
                      ? `Decrease of ${Math.abs(simulationParams.costChange)}%`
                      : "No cost change"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {simulationResults && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Simulation results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Baseline value</TableCell>
                            <TableCell className="text-right">{formatCurrency(simulationResults.baseValue)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Modeled value</TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(simulationResults.newValue)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Change</TableCell>
                            <TableCell
                              className={`text-right font-bold ${simulationResults.percentChange >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {simulationResults.percentChange >= 0 ? "+" : ""}
                              {formatPercentage(simulationResults.percentChange)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Impact breakdown</h3>
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Price impact</TableCell>
                              <TableCell
                                className={`text-right ${simulationResults.breakdown.priceEffect >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {simulationResults.breakdown.priceEffect >= 0 ? "+" : ""}
                                {formatCurrency(simulationResults.breakdown.priceEffect)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Volume impact</TableCell>
                              <TableCell
                                className={`text-right ${simulationResults.breakdown.quantityEffect >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {simulationResults.breakdown.quantityEffect >= 0 ? "+" : ""}
                                {formatCurrency(simulationResults.breakdown.quantityEffect)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Cost impact</TableCell>
                              <TableCell
                                className={`text-right ${simulationResults.breakdown.costEffect >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {simulationResults.breakdown.costEffect >= 0 ? "+" : ""}
                                {formatCurrency(simulationResults.breakdown.costEffect)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Value",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                </CardContent>
              </Card>
            </div>

            {optimumFound && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Optimization signal</AlertTitle>
                <AlertDescription>
                  {optimumFound.message} Estimated upside: {formatPercentage(optimumFound.improvement)}.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={handleReset} className="mr-2">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </CardFooter>
    </Card>
  )
}
