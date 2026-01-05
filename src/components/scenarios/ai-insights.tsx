"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Brain, CheckCircle2, Sparkles, Target } from "lucide-react"
import type { Scenario, ScenarioInput } from "@/types/scenarios"
import { useAIInsights } from "@/hooks/useAIInsights"

interface AIInsightsProps {
  scenario: Scenario
  data: ScenarioInput
}

export function AIInsights({ scenario, data }: AIInsightsProps) {
  const { data: analysis, isLoading, error, runAnalysis } = useAIInsights(scenario, data)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Automated intelligence in progress...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-[100px] w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Automation error</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={runAnalysis} className="mt-4" variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Automated Financial Intelligence</CardTitle>
          <CardDescription>
            The Decision Support Engine delivers executive summaries, risk signals, and optimization opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Sparkles className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <p className="text-lg font-medium mb-2">Generate executive insights</p>
            <p className="text-sm text-gray-500 mb-6">
              Use automated intelligence to surface risks, optimization opportunities, and recommended actions.
            </p>
            <Button onClick={runAnalysis} className="bg-blue-600 hover:bg-blue-700">
              <Brain className="h-4 w-4 mr-2" />
              Generate insights
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Executive Intelligence Brief
        </CardTitle>
        <CardDescription>Automated summary for leadership decision-making.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-lg mb-2">Executive summary</h3>
          <p>{analysis.executiveSummary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
              Risk signals
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {analysis.riskSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2 text-emerald-600" />
              Optimization opportunities
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {analysis.optimizationOpportunities.map((opportunity) => (
                <li key={opportunity}>{opportunity}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-slate-600" />
              Recommendations
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {analysis.recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </div>
        </div>

        <Button variant="outline" onClick={runAnalysis} className="w-full">
          Refresh insights
        </Button>
      </CardContent>
    </Card>
  )
}
