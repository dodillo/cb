"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileSpreadsheet, AlertCircle, Database, FileUp } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

type PreviewData = {
  headers: string[]
  data: string[][]
}

type DataStructure = {
  columns: Array<{ name: string; index: number; type: string }>
  rowCount: number
  previewRows: string[][]
}

type DataImporterProps = {
  onDataImported: (data: PreviewData, structure: DataStructure) => void
}

const baselineDataset: PreviewData = {
  headers: ["Date", "Business Unit", "Quantity", "Unit Price", "Amount"],
  data: [
    ["2025-01-15", "Platform", "120", "255.50", "30660"],
    ["2025-01-22", "Services", "85", "327.75", "27858.75"],
    ["2025-02-05", "Platform", "150", "249.90", "37485"],
    ["2025-02-18", "Integrations", "200", "182.50", "36500"],
    ["2025-03-10", "Services", "95", "335.00", "31825"],
  ],
}

export function DataImporter({ onDataImported }: DataImporterProps) {
  const [importMethod, setImportMethod] = useState("upload")
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [csvData, setCsvData] = useState("")
  const [hasHeaders, setHasHeaders] = useState(true)
  const [delimiter, setDelimiter] = useState(",")
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null
    setFile(selectedFile)
    setError("")

    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = String(event.target?.result ?? "")
          setCsvData(content)
          generatePreview(content, delimiter, hasHeaders)
        } catch (err) {
          setError("Unable to read the file.")
        }
      }
      reader.readAsText(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0] ?? null
    setFile(droppedFile)
    setError("")

    if (droppedFile) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = String(event.target?.result ?? "")
          setCsvData(content)
          generatePreview(content, delimiter, hasHeaders)
        } catch (err) {
          setError("Unable to read the file.")
        }
      }
      reader.readAsText(droppedFile)
    }
  }

  const handleCsvDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value
    setCsvData(content)
    generatePreview(content, delimiter, hasHeaders)
  }

  const handleDelimiterChange = (value: string) => {
    setDelimiter(value)
    generatePreview(csvData, value, hasHeaders)
  }

  const handleHeadersChange = (checked: boolean) => {
    setHasHeaders(checked)
    generatePreview(csvData, delimiter, checked)
  }

  const generatePreview = (content: string, delim: string, headers: boolean) => {
    if (!content) {
      setPreviewData(null)
      return
    }

    try {
      const lines = content.split("\n").filter((line) => line.trim())

      if (lines.length === 0) {
        setPreviewData(null)
        return
      }

      const parsedData = lines.map((line) => line.split(delim).map((cell) => cell.trim()))

      let tableHeaders: string[] = []
      let tableData: string[][] = []

      if (headers && parsedData.length > 0) {
        tableHeaders = parsedData[0]
        tableData = parsedData.slice(1)
      } else {
        tableData = parsedData
        tableHeaders = Array.from({ length: parsedData[0].length }, (_, i) => `Column ${i + 1}`)
      }

      setPreviewData({
        headers: tableHeaders,
        data: tableData.slice(0, 5),
      })
    } catch (err) {
      setError("Unable to parse the dataset.")
      setPreviewData(null)
    }
  }

  const detectDataStructure = (data: PreviewData): DataStructure => {
    return {
      columns: data.headers.map((header, index) => ({
        name: header,
        index,
        type: detectColumnType(data.data, index),
      })),
      rowCount: data.data.length,
      previewRows: data.data.slice(0, 5),
    }
  }

  const detectColumnType = (data: string[][], columnIndex: number) => {
    const subsetSize = Math.min(data.length, 10)
    const subset = data.slice(0, subsetSize).map((row) => row[columnIndex])

    const allNumbers = subset.every((value) => !isNaN(Number.parseFloat(value)) && isFinite(Number(value)))
    if (allNumbers) return "number"

    const datePattern = /^\d{1,4}[-/]\d{1,2}[-/]\d{1,4}$/
    const allDates = subset.every((value) => datePattern.test(value))
    if (allDates) return "date"

    return "text"
  }

  const handleImport = () => {
    setIsLoading(true)
    setProgress(0)
    setError("")

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)

      try {
        if (importMethod === "upload" && !file && !csvData) {
          throw new Error("No data available for ingestion.")
        }

        let parsedData: PreviewData

        if (importMethod === "upload" || importMethod === "paste") {
          if (!previewData) {
            throw new Error("We could not interpret the dataset structure.")
          }

          parsedData = {
            headers: previewData.headers,
            data: previewData.data,
          }
        } else {
          parsedData = baselineDataset
        }

        const structure = detectDataStructure(parsedData)
        onDataImported(parsedData, structure)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Dataset ingestion failed.")
      } finally {
        setIsLoading(false)
      }
    }, 1600)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dataset intake</CardTitle>
        <CardDescription>Bring in operational data to begin variance analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={importMethod} onValueChange={setImportMethod}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="paste">Paste</TabsTrigger>
            <TabsTrigger value="baseline">Baseline</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Drop your file here</h3>
              <p className="text-sm text-muted-foreground mb-2">or click to browse</p>
              <p className="text-xs text-muted-foreground">CSV, XLSX, XLS supported</p>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {file && (
              <div className="mt-4 p-3 bg-muted rounded-md flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium flex-1 truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            )}

            {previewData && (
              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Import options</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="delimiter">Delimiter</Label>
                    <Select value={delimiter} onValueChange={handleDelimiterChange}>
                      <SelectTrigger id="delimiter">
                        <SelectValue placeholder="Select a delimiter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=",">Comma (,)</SelectItem>
                        <SelectItem value=";">Semicolon (;)</SelectItem>
                        <SelectItem value="\t">Tab</SelectItem>
                        <SelectItem value="|">Pipe (|)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="headers" checked={hasHeaders} onCheckedChange={handleHeadersChange} />
                    <Label htmlFor="headers">First row contains headers</Label>
                  </div>
                </div>

                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted">
                          {previewData.headers.map((header, index) => (
                            <th key={index} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.data.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-t">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-4 py-2 text-sm">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-data">Paste dataset (CSV format)</Label>
              <Textarea
                id="csv-data"
                placeholder="Date,Business Unit,Quantity,Unit Price,Amount
2025-01-15,Platform,120,255.50,30660
2025-01-22,Services,85,327.75,27858.75"
                className="font-mono text-sm"
                rows={10}
                value={csvData}
                onChange={handleCsvDataChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delimiter-paste">Delimiter</Label>
                <Select value={delimiter} onValueChange={handleDelimiterChange}>
                  <SelectTrigger id="delimiter-paste">
                    <SelectValue placeholder="Select a delimiter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">Comma (,)</SelectItem>
                    <SelectItem value=";">Semicolon (;)</SelectItem>
                    <SelectItem value="\t">Tab</SelectItem>
                    <SelectItem value="|">Pipe (|)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="headers-paste" checked={hasHeaders} onCheckedChange={handleHeadersChange} />
                <Label htmlFor="headers-paste">First row contains headers</Label>
              </div>
            </div>

            {previewData && (
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        {previewData.headers.map((header, index) => (
                          <th key={index} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2 text-sm">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="baseline" className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Database className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-medium">Use baseline dataset</h3>
                <p className="text-sm text-muted-foreground">
                  Load a reference dataset to validate analysis settings.
                </p>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      {baselineDataset.headers.map((header) => (
                        <th key={header} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {baselineDataset.data.slice(0, 3).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 text-sm">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ingestion error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Processing dataset...</span>
              <span className="text-sm">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleImport} disabled={isLoading}>
            {isLoading ? (
              <>
                <FileUp className="mr-2 h-4 w-4 animate-pulse" />
                Processing...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Ingest dataset
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
