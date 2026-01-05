import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountingEntryForm } from "@/components/accounting/accounting-entry-form"
import { AccountingJournal } from "@/components/accounting/accounting-journal"
import { AccountingReports } from "@/components/accounting/accounting-reports"
import { SectionLoading } from "@/components/accounting/section-loading"
import { Suspense } from "react"

export default function AccountingPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Accounting Intelligence</h1>
        <p className="text-muted-foreground">Record, categorize, and analyze enterprise ledger activity.</p>
      </div>

      <Tabs defaultValue="entry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entry">Record entry</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="entry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New ledger entry</CardTitle>
              <CardDescription>Capture expenses and revenue with analytical context.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={<SectionLoading title="Loading entry form" description="Preparing accounts and dimensions..." />}
              >
                <AccountingEntryForm />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accounting journal</CardTitle>
              <CardDescription>Review and filter ledger activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <SectionLoading title="Loading journal" description="Retrieving ledger entries and analytics..." />
                }
              >
                <AccountingJournal />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytical reports</CardTitle>
              <CardDescription>Track performance by axis, account, and period.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={<SectionLoading title="Generating reports" description="Building financial insights..." />}
              >
                <AccountingReports />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
