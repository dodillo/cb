"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import type { ScenarioField, ScenarioInput } from "@/types/scenarios"

interface ScenarioInputFormProps {
  fields: ScenarioField[]
  onDataCaptured: (data: ScenarioInput) => void
}

const fieldStep: Record<ScenarioField["type"], string | undefined> = {
  number: "any",
  percent: "any",
  currency: "any",
}

export function ScenarioInputForm({ fields, onDataCaptured }: ScenarioInputFormProps) {
  const [formData, setFormData] = useState<Record<string, string | number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const hasFields = useMemo(() => fields.length > 0, [fields.length])

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    setIsSubmitted(false)
  }

  const buildPayload = () => {
    const processedData: ScenarioInput = {}
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
        processedData[key] = Number(value)
      } else {
        processedData[key] = value
      }
    })
    return processedData
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onDataCaptured(buildPayload())
    setIsSubmitted(true)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type="number"
                value={formData[field.id] ?? ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required
                step={fieldStep[field.type]}
                min="0"
              />
            </div>
          ))}

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="submit" disabled={!hasFields || isSubmitted} className="w-full">
              {isSubmitted ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Inputs saved
                </>
              ) : (
                "Save inputs"
              )}
            </Button>
          </div>

          {isSubmitted && (
            <div className="flex justify-end mt-4">
              <Button
                variant="default"
                onClick={() => onDataCaptured(buildPayload())}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Continue to insights
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
