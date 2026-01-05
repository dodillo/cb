"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useActivityFeed } from "@/hooks/useActivityFeed"

export function RecentActivity() {
  const { data: activities, isLoading, error, source } = useActivityFeed()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Operational actions recorded across the workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="text-sm text-muted-foreground">Loading activity feed...</div>}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Activity feed unavailable</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && (!activities || activities.length === 0) && (
          <Alert>
            <AlertTitle>No activity available</AlertTitle>
            <AlertDescription>Connect a data source to populate workspace activity.</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && activities && activities.length > 0 && (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.initials}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <span className="font-semibold">{activity.user.name}</span> {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.target}
                    {typeof activity.amount === "number" && (
                      <span className="font-medium"> - ${activity.amount.toLocaleString()}</span>
                    )}
                  </p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">{activity.date}</div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground">Data source: {source === "supabase" ? "Live" : "Baseline"}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
