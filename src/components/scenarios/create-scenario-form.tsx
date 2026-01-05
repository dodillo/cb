"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PlusCircle, Save } from "lucide-react"
import { createScenario } from "@/lib/services/scenario-service"
import type { CreateScenarioData, ScenarioField } from "@/types/scenarios"

const fieldTypes: ScenarioField["type"][] = ["number", "percent", "currency"]

export function CreateScenarioForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<CreateScenarioData>({
    id: "",
    title: "",
    description: "",
    type: "variance",
    complexity: "standard",
    fields: [],
  })
  const [newField, setNewField] = useState<ScenarioField>({
    id: "",
    label: "",
    type: "number",
  })

  const handleChange = (field: keyof CreateScenarioData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddField = () => {
    if (newField.id && newField.label) {
      setFormData((prev) => ({
        ...prev,
        fields: [...prev.fields, { ...newField }],
      }))
      setNewField({ id: "", label: "", type: "number" })
    }
  }

  const handleRemoveField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!formData.id || !formData.title || !formData.description || formData.fields.length === 0) {
        throw new Error("Complete all required fields and add at least one input field.")
      }

      await createScenario(formData)
      setSuccess(true)

      setTimeout(() => {
        router.push("/scenarios")
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Unable to create the scenario. Please try again.")
      console.error("Scenario creation failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create a new scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">Scenario ID</Label>
            <Input
              id="id"
              value={formData.id}
              onChange={(e) => handleChange("id", e.target.value)}
              placeholder="scenario-variance-q3"
              required
            />
            <p className="text-xs text-gray-500">Use a unique ID with lowercase letters, numbers, and hyphens.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Scenario title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Revenue variance model"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the decision model and its primary use cases."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Scenario type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="variance">Variance Intelligence</SelectItem>
                  <SelectItem value="optimization">Optimization Model</SelectItem>
                  <SelectItem value="planning">Planning Model</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Complexity</Label>
              <Select value={formData.complexity} onValueChange={(value) => handleChange("complexity", value)}>
                <SelectTrigger id="complexity">
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <Label>Scenario inputs</Label>
            </div>

            {formData.fields.length > 0 && (
              <div className="space-y-2">
                {formData.fields.map((field, index) => (
                  <div key={field.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div>
                      <span className="font-medium">{field.label}</span>
                      <span className="text-sm text-gray-500 ml-2">({field.id})</span>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveField(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fieldId">Field ID</Label>
                <Input
                  id="fieldId"
                  value={newField.id}
                  onChange={(e) => setNewField({ ...newField, id: e.target.value })}
                  placeholder="plannedVolume"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fieldLabel">Label</Label>
                <Input
                  id="fieldLabel"
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  placeholder="Planned Volume"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fieldType">Type</Label>
                <Select
                  value={newField.type}
                  onValueChange={(value) => setNewField({ ...newField, type: value as ScenarioField["type"] })}
                >
                  <SelectTrigger id="fieldType">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" onClick={handleAddField} disabled={!newField.id || !newField.label}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Add field
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200">
              <AlertDescription>Scenario created successfully. Redirecting...</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Create scenario
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
