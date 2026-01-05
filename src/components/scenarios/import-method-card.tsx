"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"

interface ImportMethodCardProps {
  icon: ReactNode
  title: string
  description: string
  isSelected: boolean
  onClick: () => void
  testId: string
}

export function ImportMethodCard({ icon, title, description, isSelected, onClick, testId }: ImportMethodCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        isSelected ? "border-blue-500 shadow-md" : "hover:border-blue-300"
      }`}
      onClick={onClick}
      data-testid={testId}
    >
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="mb-2">{icon}</div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </CardContent>
    </Card>
  )
}
