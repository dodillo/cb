"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Filter, Search } from "lucide-react"
import { format } from "date-fns"
import { SectionLoading } from "@/components/accounting/section-loading"
import { useFinancialOverview } from "@/hooks/useFinancialOverview"

export function AccountingJournal() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedType, setSelectedType] = useState<string>("all")
  const { data, isLoading } = useFinancialOverview()

  const filteredEntries = useMemo(() => {
    return data.entries.filter((entry) => {
      const matchesSearch =
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.accountNumber.includes(searchTerm) ||
        entry.accountName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDate = selectedDate ? entry.date === format(selectedDate, "yyyy-MM-dd") : true

      const matchesType = selectedType === "all" ? true : selectedType === entry.type

      return matchesSearch && matchesDate && matchesType
    })
  }, [data.entries, searchTerm, selectedDate, selectedType])

  if (isLoading) {
    return (
      <SectionLoading
        title="Loading accounting journal"
        description="Retrieving ledger entries and analytical mappings."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Entry type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="expense">Expenses</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSearchTerm("")
              setSelectedDate(undefined)
              setSelectedType("all")
            }}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" className="w-full md:w-auto" disabled title="Export available in enterprise tier">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead>Analytical axis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.date), "dd/MM/yyyy")}</TableCell>
                <TableCell>
                  <div className="font-medium">{entry.accountNumber}</div>
                  <div className="text-xs text-muted-foreground">{entry.accountName}</div>
                </TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell className="text-right">
                  {entry.debit > 0 ? entry.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {entry.credit > 0 ? entry.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{entry.analyticalAxis}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        <div>
          <span className="text-sm font-medium">Total debit: </span>
          <span>
            {filteredEntries
              .reduce((sum, entry) => sum + entry.debit, 0)
              .toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="text-sm font-medium">Total credit: </span>
          <span>
            {filteredEntries
              .reduce((sum, entry) => sum + entry.credit, 0)
              .toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  )
}
