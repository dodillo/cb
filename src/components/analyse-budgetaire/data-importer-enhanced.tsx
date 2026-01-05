"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileSpreadsheet, AlertCircle, Database, FileUp, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

type PreviewData = {
  headers: string[]
  data: string[][]
}

type ImportSummary = {
  rows: number
  columns: number
  datasetType: string
}

const datasetTypes = [
  { value: "operational", label: "Operational Dataset" },
  { value: "budget", label: "Budget Ledger" },
  { value: "variance", label: "Variance Feed" },
]

const baselineDataset: PreviewData = {
  headers: ["Period", "Region", "BusinessUnit", "Budget", "Actual", "Variance"],
  data: [
    ["2025-01", "North America", "Platform", "520000", "501200", "-18800"],
    ["2025-02", "EMEA", "Services", "312000", "338400", "26400"],
    ["2025-03", "APAC", "Integrations", "164000", "150900", "-13100"],
    ["2025-04", "North America", "Platform", "540000", "552300", "12300"],
    ["2025-05", "EMEA", "Services", "329000", "321100", "-7900"],
  ],
}

export function DataImporterEnhanced() {
  const [importMethod, setImportMethod] = useState("upload")
  const [datasetType, setDatasetType] = useState(datasetTypes[0].value)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [csvData, setCsvData] = useState("")
  const [hasHeaders, setHasHeaders] = useState(true)
  const [delimiter, setDelimiter] = useState(",")
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [summary, setSummary] = useState<ImportSummary | null>(null)

  const selectedDatasetLabel = useMemo(() => {
    return datasetTypes.find((dataset) => dataset.value === datasetType)?.label ?? "Operational Dataset"
  }, [datasetType])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null
    setFile(selectedFile)
    setError("")
    setSummary(null)

    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = String(event.target?.result ?? "")
          setCsvData(content)
          generatePreview(content, delimiter, hasHeaders)
        } catch (err) {
          setError("Unable to read the selected file.")
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
    setSummary(null)

    if (droppedFile) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = String(event.target?.result ?? "")
          setCsvData(content)
          generatePreview(content, delimiter, hasHeaders)
        } catch (err) {
          setError("Unable to read the selected file.")
        }
      }
      reader.readAsText(droppedFile)
    }
  }

  const handleCsvDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value
    setCsvData(content)
    setSummary(null)
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

  const handleDatasetChange = (value: string) => {
    setDatasetType(value)
    setSummary(null)
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

  const handleImport = () => {
    setIsLoading(true)
    setProgress(0)
    setError("")
    setSummary(null)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 12
      })
    }, 160)

    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)

      try {
        if (importMethod === "upload" && !file && !csvData) {
          throw new Error("Select a file or paste data before ingestion.")
        }

        let parsedData: PreviewData | null = null

        if (importMethod === "upload" || importMethod === "paste") {
          if (!previewData) {
            throw new Error("We could not interpret the dataset structure.")
          }
          parsedData = previewData
        } else if (importMethod === "baseline") {
          parsedData = baselineDataset
        }

        if (!parsedData) {
          throw new Error("Dataset ingestion failed.")
        }

        setSummary({
          rows: parsedData.data.length,
          columns: parsedData.headers.length,
          datasetType: selectedDatasetLabel,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Dataset ingestion failed.")
      } finally {
        setIsLoading(false)
      }
    }, 1400)
  }

  const displayedPreview = importMethod === "baseline" ? baselineDataset : previewData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operational Data Intake</CardTitle>
        <CardDescription>Stage structured datasets for variance intelligence and reporting.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dataset-type">Dataset classification</Label>
            <Select value={datasetType} onValueChange={handleDatasetChange}>
              <SelectTrigger id="dataset-type">
                <SelectValue placeholder="Select dataset type" />
              </SelectTrigger>
              <SelectContent>
                {datasetTypes.map((dataset) => (
                  <SelectItem key={dataset.value} value={dataset.value}>
                    {dataset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ingestion mode</Label>
            <Tabs value={importMethod} onValueChange={setImportMethod}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="paste">Paste</TabsTrigger>
                <TabsTrigger value="baseline">Baseline</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Tabs value={importMethod} onValueChange={setImportMethod}>
          <TabsContent value="upload" className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload-enhanced")?.click()}
            >
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Drop your dataset here</h3>
              <p className="text-sm text-muted-foreground mb-2">or click to browse</p>
              <p className="text-xs text-muted-foreground">Accepted: CSV, XLSX, XLS</p>
              <Input
                id="file-upload-enhanced"
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
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-data-enhanced">Paste data (CSV format)</Label>
              <Textarea
                id="csv-data-enhanced"
                placeholder="Period,Region,BusinessUnit,Budget,Actual,Variance
2025-01,North America,Platform,520000,501200,-18800"
                className="font-mono text-sm"
                rows={8}
                value={csvData}
                onChange={handleCsvDataChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="baseline" className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Database className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-medium">Use baseline operational dataset</h3>
                <p className="text-sm text-muted-foreground">
                  Load a reference dataset to explore variance insights instantly.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="delimiter-enhanced">Delimiter</Label>
            <Select value={delimiter} onValueChange={handleDelimiterChange}>
              <SelectTrigger id="delimiter-enhanced">
                <SelectValue placeholder="Select delimiter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=",">Comma (,)</SelectItem>
                <SelectItem value=";">Semicolon (;)</SelectItem>
                <SelectItem value="\t">Tab</SelectItem>
                <SelectItem value="|">Pipe (|)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Switch id="headers-enhanced" checked={hasHeaders} onCheckedChange={handleHeadersChange} />
            <Label htmlFor="headers-enhanced">First row contains headers</Label>
          </div>
        </div>

        {displayedPreview && (
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    {displayedPreview.headers.map((header, index) => (
                      <th key={index} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayedPreview.data.map((row, rowIndex) => (
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

        {summary && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Dataset staged</AlertTitle>
            <AlertDescription>
              {summary.datasetType} intake complete. {summary.rows} rows, {summary.columns} columns ready for analysis.
            </AlertDescription>
          </Alert>
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
