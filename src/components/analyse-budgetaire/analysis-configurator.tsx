"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowRight, Calculator, TrendingUp, BarChart4, PieChart } from "lucide-react"

type Column = {
  name: string
  index: number
  type: string
}

type DataStructure = {
  columns: Column[]
}

type AnalysisConfiguratorProps = {
  data: unknown
  structure: DataStructure
  onAnalysisConfigured: (config: {
    type: string
    columns: Record<string, string>
    parameters: Record<string, string>
    options: Record<string, boolean | string>
  }) => void
}

export function AnalysisConfigurator({ data: _data, structure, onAnalysisConfigured }: AnalysisConfiguratorProps) {
  const [analysisType, setAnalysisType] = useState("variance")
  const [config, setConfig] = useState({
    type: "variance",
    columns: {},
    parameters: {},
    options: {},
  })

  const handleColumnSelect = (key: string, value: string) => {
    setConfig({
      ...config,
      columns: {
        ...config.columns,
        [key]: value,
      },
    })
  }

  const handleParameterChange = (key: string, value: string) => {
    setConfig({
      ...config,
      parameters: {
        ...config.parameters,
        [key]: value,
      },
    })
  }

  const handleOptionChange = (key: string, value: boolean | string) => {
    setConfig({
      ...config,
      options: {
        ...config.options,
        [key]: value,
      },
    })
  }

  const handleAnalysisTypeChange = (type: string) => {
    setAnalysisType(type)
    setConfig({
      ...config,
      type,
      columns: {},
      parameters: {},
      options: {},
    })
  }

  const handleSubmit = () => {
    onAnalysisConfigured({
      ...config,
      type: analysisType,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis configuration</CardTitle>
        <CardDescription>Define the analysis parameters for your operational dataset.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={analysisType} onValueChange={handleAnalysisTypeChange}>
          <div className="space-y-2">
            <Label>Analysis type</Label>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="variance" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>Variance</span>
              </TabsTrigger>
              <TabsTrigger value="optimization" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Optimization</span>
              </TabsTrigger>
              <TabsTrigger value="distribution" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span>Distribution</span>
              </TabsTrigger>
              <TabsTrigger value="trend" className="flex items-center gap-2">
                <BarChart4 className="h-4 w-4" />
                <span>Trend</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="variance" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Variance analysis settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="actual-column">Actual values column</Label>
                  <Select
                    value={config.columns.actual || ""}
                    onValueChange={(value) => handleColumnSelect("actual", value)}
                  >
                    <SelectTrigger id="actual-column">
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

                <div className="space-y-2">
                  <Label htmlFor="budget-column">Budget values column</Label>
                  <Select
                    value={config.columns.budget || ""}
                    onValueChange={(value) => handleColumnSelect("budget", value)}
                  >
                    <SelectTrigger id="budget-column">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category-column">Category column</Label>
                  <Select
                    value={config.columns.category || ""}
                    onValueChange={(value) => handleColumnSelect("category", value)}
                  >
                    <SelectTrigger id="category-column">
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
                  <Label htmlFor="date-column">Date column (optional)</Label>
                  <Select value={config.columns.date || ""} onValueChange={(value) => handleColumnSelect("date", value)}>
                    <SelectTrigger id="date-column">
                      <SelectValue placeholder="Select a column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {structure.columns
                        .filter((col) => col.type === "date")
                        .map((column) => (
                          <SelectItem key={column.index} value={column.index.toString()}>
                            {column.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Analysis options</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-percentage"
                      checked={config.options.showPercentage || false}
                      onCheckedChange={(checked) => handleOptionChange("showPercentage", checked as boolean)}
                    />
                    <label
                      htmlFor="show-percentage"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show variance as percentage
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="highlight-significant"
                      checked={config.options.highlightSignificant || false}
                      onCheckedChange={(checked) => handleOptionChange("highlightSignificant", checked as boolean)}
                    />
                    <label
                      htmlFor="highlight-significant"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Highlight material variances
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="calculate-totals"
                      checked={config.options.calculateTotals || false}
                      onCheckedChange={(checked) => handleOptionChange("calculateTotals", checked as boolean)}
                    />
                    <label
                      htmlFor="calculate-totals"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Calculate totals
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="threshold">Material variance threshold (%)</Label>
                <Input
                  id="threshold"
                  type="number"
                  placeholder="10"
                  value={config.parameters.threshold || ""}
                  onChange={(e) => handleParameterChange("threshold", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Optimization settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price-column">Price column</Label>
                  <Select
                    value={config.columns.price || ""}
                    onValueChange={(value) => handleColumnSelect("price", value)}
                  >
                    <SelectTrigger id="price-column">
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

                <div className="space-y-2">
                  <Label htmlFor="quantity-column">Quantity column</Label>
                  <Select
                    value={config.columns.quantity || ""}
                    onValueChange={(value) => handleColumnSelect("quantity", value)}
                  >
                    <SelectTrigger id="quantity-column">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost-column">Cost column</Label>
                  <Select value={config.columns.cost || ""} onValueChange={(value) => handleColumnSelect("cost", value)}>
                    <SelectTrigger id="cost-column">
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

                <div className="space-y-2">
                  <Label htmlFor="product-column">Product column</Label>
                  <Select
                    value={config.columns.product || ""}
                    onValueChange={(value) => handleColumnSelect("product", value)}
                  >
                    <SelectTrigger id="product-column">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="elasticity">Price elasticity (optional)</Label>
                <Input
                  id="elasticity"
                  type="number"
                  step="0.1"
                  placeholder="-1.5"
                  value={config.parameters.elasticity || ""}
                  onChange={(e) => handleParameterChange("elasticity", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fixed-costs">Fixed costs (optional)</Label>
                <Input
                  id="fixed-costs"
                  type="number"
                  placeholder="10000"
                  value={config.parameters.fixedCosts || ""}
                  onChange={(e) => handleParameterChange("fixedCosts", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Optimization objective</Label>
                <RadioGroup
                  value={config.parameters.objective || "profit"}
                  onValueChange={(value) => handleParameterChange("objective", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="profit" id="profit" />
                    <Label htmlFor="profit">Maximize margin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="revenue" id="revenue" />
                    <Label htmlFor="revenue">Maximize revenue</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quantity" id="quantity" />
                    <Label htmlFor="quantity">Maximize volume</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Distribution settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value-column">Value column</Label>
                  <Select
                    value={config.columns.value || ""}
                    onValueChange={(value) => handleColumnSelect("value", value)}
                  >
                    <SelectTrigger id="value-column">
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

                <div className="space-y-2">
                  <Label htmlFor="category-column-dist">Category column</Label>
                  <Select
                    value={config.columns.categoryDist || ""}
                    onValueChange={(value) => handleColumnSelect("categoryDist", value)}
                  >
                    <SelectTrigger id="category-column-dist">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary-category">Secondary category (optional)</Label>
                <Select
                  value={config.columns.secondaryCategory || ""}
                  onValueChange={(value) => handleColumnSelect("secondaryCategory", value)}
                >
                  <SelectTrigger id="secondary-category">
                    <SelectValue placeholder="Select a column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
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
                <Label>Visualization options</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-percentages"
                      checked={config.options.showPercentages || false}
                      onCheckedChange={(checked) => handleOptionChange("showPercentages", checked as boolean)}
                    />
                    <label
                      htmlFor="show-percentages"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show percentages
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sort-by-value"
                      checked={config.options.sortByValue || false}
                      onCheckedChange={(checked) => handleOptionChange("sortByValue", checked as boolean)}
                    />
                    <label
                      htmlFor="sort-by-value"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sort by value
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="group-small-values"
                      checked={config.options.groupSmallValues || false}
                      onCheckedChange={(checked) => handleOptionChange("groupSmallValues", checked as boolean)}
                    />
                    <label
                      htmlFor="group-small-values"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Group small values
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="small-value-threshold">Small value threshold (%)</Label>
                <Input
                  id="small-value-threshold"
                  type="number"
                  placeholder="5"
                  value={config.parameters.smallValueThreshold || ""}
                  onChange={(e) => handleParameterChange("smallValueThreshold", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trend" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Trend analysis settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time-column">Time column</Label>
                  <Select value={config.columns.time || ""} onValueChange={(value) => handleColumnSelect("time", value)}>
                    <SelectTrigger id="time-column">
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
                  <Label htmlFor="metric-column">Metric column</Label>
                  <Select
                    value={config.columns.metric || ""}
                    onValueChange={(value) => handleColumnSelect("metric", value)}
                  >
                    <SelectTrigger id="metric-column">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="segment-column">Segment column (optional)</Label>
                  <Select
                    value={config.columns.segment || ""}
                    onValueChange={(value) => handleColumnSelect("segment", value)}
                  >
                    <SelectTrigger id="segment-column">
                      <SelectValue placeholder="Select a column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
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
                  <Label htmlFor="comparison-column">Comparison column (optional)</Label>
                  <Select
                    value={config.columns.comparison || ""}
                    onValueChange={(value) => handleColumnSelect("comparison", value)}
                  >
                    <SelectTrigger id="comparison-column">
                      <SelectValue placeholder="Select a column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
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
              </div>

              <div className="space-y-2">
                <Label>Analysis options</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-trend-line"
                      checked={config.options.showTrendLine || false}
                      onCheckedChange={(checked) => handleOptionChange("showTrendLine", checked as boolean)}
                    />
                    <label
                      htmlFor="show-trend-line"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show trend line
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-forecast"
                      checked={config.options.showForecast || false}
                      onCheckedChange={(checked) => handleOptionChange("showForecast", checked as boolean)}
                    />
                    <label
                      htmlFor="show-forecast"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show forecast
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="calculate-growth"
                      checked={config.options.calculateGrowth || false}
                      onCheckedChange={(checked) => handleOptionChange("calculateGrowth", checked as boolean)}
                    />
                    <label
                      htmlFor="calculate-growth"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Calculate growth rate
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="forecast-periods">Forecast periods</Label>
                <Input
                  id="forecast-periods"
                  type="number"
                  placeholder="3"
                  value={config.parameters.forecastPeriods || ""}
                  onChange={(e) => handleParameterChange("forecastPeriods", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit}>
          Run analysis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
