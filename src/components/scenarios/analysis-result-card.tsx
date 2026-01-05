"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AnalysisResultCardProps {
  title: string
  value: string
  type: "positive" | "negative" | "neutral"
  description?: string
  testId?: string
}

export function AnalysisResultCard({ title, value, type, description, testId }: AnalysisResultCardProps) {
  const getColorClass = () => {
    switch (type) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-900"
    }
  }

  return (
    <Card data-testid={testId}>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${getColorClass()}`}>{value}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </CardContent>
    </Card>
  )
}
