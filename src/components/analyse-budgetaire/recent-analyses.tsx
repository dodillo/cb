"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart4, Calculator, LineChart, PieChart, Sliders, Search } from "lucide-react"
import { useAnalyses } from "@/hooks/use-analyses"
import { formatDistanceToNow } from "date-fns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentAnalyses() {
  const [searchTerm, setSearchTerm] = useState("")
  const { analyses, loading, error, refreshAnalyses } = useAnalyses({
    limit: 8,
    search: searchTerm || undefined,
    realtime: true,
  })

  const getIcon = (type: string) => {
    switch (type) {
      case "variance":
        return <Calculator className="h-4 w-4" />
      case "optimization":
        return <Sliders className="h-4 w-4" />
      case "trend":
        return <LineChart className="h-4 w-4" />
      case "distribution":
        return <PieChart className="h-4 w-4" />
      default:
        return <BarChart4 className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date"
    try {
      return `${formatDistanceToNow(new Date(dateString))} ago`
    } catch {
      return "Unknown date"
    }
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        Unable to load analyses. Please try again.
        <Button variant="outline" size="sm" onClick={refreshAnalyses} className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search analyses..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="grid gap-1 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : analyses.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">No analyses found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {searchTerm ? "Try different search terms" : "Run an analysis to populate this view"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {analyses.map((analysis) => (
            <Link href={`/analyse-budgetaire/${analysis.id}`} key={analysis.id}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    {getIcon(analysis.type)}
                  </div>
                  <div className="grid gap-1">
                    <CardTitle className="text-base">{analysis.title}</CardTitle>
                    <CardDescription className="line-clamp-1">{analysis.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={analysis.users?.avatar_url || ""} alt={analysis.users?.name || "User"} />
                        <AvatarFallback>
                          {analysis.users?.name ? getInitials(analysis.users.name) : "AN"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">{analysis.users?.name || "Analyst"}</span>
                    </div>
                    <span className="text-muted-foreground">{formatDate(analysis.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
