"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAnalysis } from "@/hooks/use-analyses"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Download, Share, Trash } from "lucide-react"
import { analysisService } from "@/lib/services/analysis-service"
import { useToast } from "@/hooks/use-toast"
import { hasSupabaseConfig } from "@/lib/supabase"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AnalysisDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { analysis, loading, error } = useAnalysis(params.id as string, { realtime: true })
  const isLive = hasSupabaseConfig()

  const formatDate = (dateString: string) => {
    try {
      return `${formatDistanceToNow(new Date(dateString))} ago`
    } catch (e) {
      return "Unknown date"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleDelete = async () => {
    try {
      await analysisService.deleteAnalysis(params.id as string)
      toast({
        title: "Analysis removed",
        description: "The analysis has been deleted successfully.",
      })
      router.push("/analyse-budgetaire")
    } catch (deleteError) {
      console.error("Error deleting analysis:", deleteError)
      toast({
        title: "Delete failed",
        description: "We could not delete the analysis. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Analysis not found</h2>
          <p className="text-muted-foreground">
            The analysis you are looking for does not exist or has been removed.
          </p>
        </div>
        <Button onClick={() => router.push("/analyse-budgetaire")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to analyses
        </Button>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{analysis.title}</h1>
            <p className="text-muted-foreground">{analysis.description}</p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button variant="outline" size="icon" disabled>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Exports require an admin-enabled connector.</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button variant="outline" size="icon" disabled>
                    <Share className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Sharing is restricted to enterprise workspaces.</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={!isLive}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {isLive ? "Remove this analysis from the live workspace." : "Connect a live data source to delete."}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={analysis.users?.avatar_url || ""} alt={analysis.users?.name || "User"} />
            <AvatarFallback>{analysis.users?.name ? getInitials(analysis.users.name) : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
            <span>{analysis.users?.name || "Unknown analyst"}</span>
            <span className="hidden sm:inline text-muted-foreground">|</span>
            <span className="text-muted-foreground">{formatDate(analysis.created_at)}</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analysis output</CardTitle>
            <CardDescription>Review the dataset and intelligence layers captured for this run.</CardDescription>
          </CardHeader>
          <CardContent>
            {analysis.data ? (
              <div>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96">
                  {JSON.stringify(analysis.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-center p-12 border rounded-lg bg-muted/50">
                <p className="text-muted-foreground">No analysis data available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this analysis?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The analysis will be permanently removed from your workspace.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
