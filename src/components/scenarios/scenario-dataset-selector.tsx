"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import type { ScenarioInput } from "@/types/scenarios"

interface ScenarioDatasetSelectorProps {
  scenarioId: string
  onDataSelected: (data: ScenarioInput) => void
}

const datasetCatalog: Record<string, Record<string, ScenarioInput>> = {
  "scenario-variance-001": {
    "Baseline Q3": {
      plannedVolume: 5200,
      plannedPrice: 120,
      actualVolume: 4900,
      actualPrice: 128,
      unitCost: 68,
    },
    "Expansion Q3": {
      plannedVolume: 6000,
      plannedPrice: 118,
      actualVolume: 6400,
      actualPrice: 121,
      unitCost: 70,
    },
  },
  "scenario-optimization-001": {
    "North America": {
      currentPrice: 110,
      currentVolume: 3200,
      elasticity: -2.2,
      unitCost: 62,
      fixedCost: 180000,
    },
    "EMEA": {
      currentPrice: 95,
      currentVolume: 4200,
      elasticity: -2.8,
      unitCost: 58,
      fixedCost: 150000,
    },
  },
  "scenario-planning-001": {
    "FY24 Baseline": {
      currentRevenue: 8600000,
      averagePrice: 120,
      growthRate: 0.08,
      grossMargin: 0.42,
    },
    "FY24 Stretch": {
      currentRevenue: 8600000,
      averagePrice: 122,
      growthRate: 0.12,
      grossMargin: 0.44,
    },
  },
}

export function ScenarioDatasetSelector({ scenarioId, onDataSelected }: ScenarioDatasetSelectorProps) {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)
  const [isApplied, setIsApplied] = useState(false)

  const datasets = datasetCatalog[scenarioId] || {}
  const datasetNames = Object.keys(datasets)

  const handleSelectDataset = (datasetName: string) => {
    setSelectedDataset(datasetName)
    setIsApplied(false)
  }

  const handleApply = () => {
    if (selectedDataset && datasets[selectedDataset]) {
      onDataSelected(datasets[selectedDataset])
      setIsApplied(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {datasetNames.length > 0 ? (
          datasetNames.map((datasetName) => (
            <Card
              key={datasetName}
              className={`cursor-pointer transition-all ${
                selectedDataset === datasetName ? "border-blue-500 ring-2 ring-blue-200" : "hover:border-gray-300"
              }`}
              onClick={() => handleSelectDataset(datasetName)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{datasetName}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {Object.entries(datasets[datasetName] || {}).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-2">
            <CardContent className="py-6 text-center text-gray-500">
              No reference datasets are available for this scenario.
            </CardContent>
          </Card>
        )}
      </div>

      {selectedDataset && (
        <div className="flex justify-end space-x-2">
          <Button onClick={handleApply} disabled={isApplied} className="w-full">
            {isApplied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Dataset applied
              </>
            ) : (
              "Use dataset"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
