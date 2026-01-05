import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SeedDatabase } from "@/components/admin/seed-database"

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
        <p className="text-muted-foreground">Manage platform configuration and seed data.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database</CardTitle>
          <CardDescription>Initialize or reset the data workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="mb-2">
                Use the action below to seed the database with baseline operational data. This will overwrite existing
                records.
              </p>
              <SeedDatabase />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
