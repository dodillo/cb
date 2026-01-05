"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, X, Check } from "lucide-react"
import type { ScenarioField, ScenarioInput } from "@/types/scenarios"

interface ScenarioFileImportProps {
  expectedFields?: ScenarioField[]
  onDataImported: (data: ScenarioInput) => void
}

const normalizeKey = (value: string) => value.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")

export function ScenarioFileImport({ expectedFields, onDataImported }: ScenarioFileImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<Record<string, string>[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError(null)
    parseFile(selectedFile)
  }

  const parseFile = async (upload: File) => {
    setIsLoading(true)
    setError(null)

    try {
      if (!upload.name.endsWith(".csv") && !upload.name.endsWith(".txt")) {
        throw new Error("Unsupported format. Upload a CSV (.csv) or text (.txt) file.")
      }

      const text = await readFileAsText(upload)
      const { headers, data } = parseCSV(text)

      if (data.length === 0) {
        throw new Error("The file does not contain any data rows.")
      }

      const mappedRow = mapRowToInputs(headers, data[0])
      setPreview([mappedRow])
      onDataImported(mapValues(mappedRow))
    } catch (err: any) {
      setError(err.message || "Unable to import the file.")
      console.error("File import error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const readFileAsText = (upload: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(upload)
    })

  const parseCSV = (text: string): { headers: string[]; data: string[][] } => {
    const lines = text.split(/\r\n|\n/).filter((line) => line.trim().length > 0)
    if (lines.length === 0) {
      throw new Error("The file is empty.")
    }

    const separator = lines[0].includes(";") ? ";" : ","
    const headers = lines[0].split(separator).map((h) => h.trim())
    const data = lines.slice(1).map((line) => line.split(separator).map((cell) => cell.trim()))

    return { headers, data }
  }

  const mapRowToInputs = (headers: string[], row: string[]): Record<string, string> => {
    const rowData: Record<string, string> = {}
    const fieldLookup = new Map<string, string>()

    expectedFields?.forEach((field) => {
      fieldLookup.set(normalizeKey(field.id), field.id)
      fieldLookup.set(normalizeKey(field.label), field.id)
    })

    headers.forEach((header, index) => {
      const normalized = normalizeKey(header)
      const fieldId = fieldLookup.get(normalized)
      rowData[fieldId || header] = row[index]
    })

    return rowData
  }

  const mapValues = (rowData: Record<string, string>): ScenarioInput => {
    const result: ScenarioInput = {}
    Object.entries(rowData).forEach(([key, value]) => {
      const parsed = Number(value)
      result[key] = Number.isNaN(parsed) ? value : parsed
    })
    return result
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
      parseFile(droppedFile)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview([])
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.txt"
        className="hidden"
        data-testid="file-input"
      />

      {!file ? (
        <Card
          className="border-dashed border-2 cursor-pointer hover:border-blue-500 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-1">Drop a file or click to upload</p>
            <p className="text-sm text-gray-500">Accepted formats: CSV (.csv), Text (.txt)</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-emerald-500 mr-2" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Remove file">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2">Parsing file...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : preview.length > 0 ? (
              <div className="space-y-2">
                <p className="font-medium">Data preview</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(preview[0] || {}).map((key) => (
                          <th
                            key={key}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {preview.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((value, colIndex) => (
                            <td key={colIndex} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center text-emerald-600">
                  <Check className="h-4 w-4 mr-1" />
                  <span className="text-sm">Dataset imported successfully</span>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
