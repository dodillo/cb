"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIUsageStats } from "@/components/scenarios/ai-performance"
import { Brain, Database, Settings, Users } from "lucide-react"

export default function AIAdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>("stats")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Automated Financial Intelligence</h1>
          <p className="text-gray-500">Monitor Decision Support Engine performance across automated intelligence workflows.</p>
        </div>

        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Module settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Total analyses</p>
                <p className="text-2xl font-bold">127</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Active analysts</p>
                <p className="text-2xl font-bold">42</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Workflows analyzed</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Settings className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-gray-500">Accuracy rate</p>
                <p className="text-2xl font-bold">94.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="stats">Usage</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="logs">Audit logs</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-0">
          <AIUsageStats />
        </TabsContent>

        <TabsContent value="models" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>AI model configurations</CardTitle>
              <CardDescription>Manage the models used for automated financial intelligence.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Gemini 1.5 Flash",
                    description: "Primary model for executive summaries and insight extraction.",
                    status: "Active",
                    tone: "success",
                  },
                  {
                    name: "Strategic Advisor",
                    description: "High-accuracy model for optimization and risk detection.",
                    status: "Pilot",
                    tone: "warning",
                  },
                  {
                    name: "Lightweight Analyzer",
                    description: "Fast model for rapid workflow triage.",
                    status: "Standby",
                    tone: "neutral",
                  },
                ].map((model) => (
                  <div key={model.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Brain className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">{model.name}</p>
                        <p className="text-sm text-gray-500">{model.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                          model.tone === "success"
                            ? "bg-emerald-100 text-emerald-800"
                            : model.tone === "warning"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {model.status}
                      </span>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Analyst feedback</CardTitle>
              <CardDescription>Ratings and comments on automated insights.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    role: "FP&A Lead",
                    workflow: "Revenue Variance Run",
                    rating: 5,
                    comment: "Executive summary is concise and aligned with our variance drivers.",
                  },
                  {
                    role: "Revenue Operations",
                    workflow: "Price Optimization Run",
                    rating: 4,
                    comment: "Optimization insights are strong, add more regional pricing context.",
                  },
                  {
                    role: "Strategic Planning",
                    workflow: "Sales Planning Run",
                    rating: 5,
                    comment: "Recommendations are clear and actionable for quarterly planning.",
                  },
                ].map((feedback) => (
                  <div key={feedback.role} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{feedback.role}</p>
                        <p className="text-sm text-gray-500">{feedback.workflow}</p>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={`${feedback.role}-${i}`}
                            className={`h-5 w-5 ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="mt-2">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Audit log</CardTitle>
              <CardDescription>History of automated intelligence requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Date", "Analyst", "Workflow", "Model", "Duration", "Status"].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      {
                        date: "2025-04-14 14:32",
                        analyst: "Finance Ops",
                        workflow: "Revenue Variance Run",
                        model: "Gemini 1.5 Flash",
                        duration: "2.9s",
                        status: "success",
                      },
                      {
                        date: "2025-04-14 11:15",
                        analyst: "Revenue Ops",
                        workflow: "Price Optimization Run",
                        model: "Gemini 1.5 Flash",
                        duration: "2.4s",
                        status: "success",
                      },
                      {
                        date: "2025-04-13 16:47",
                        analyst: "Strategic Planning",
                        workflow: "Sales Planning Run",
                        model: "Strategic Advisor",
                        duration: "3.1s",
                        status: "success",
                      },
                      {
                        date: "2025-04-13 10:22",
                        analyst: "Finance Ops",
                        workflow: "Revenue Variance Run",
                        model: "Strategic Advisor",
                        duration: "4.0s",
                        status: "error",
                      },
                    ].map((log) => (
                      <tr key={`${log.date}-${log.analyst}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{log.analyst}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.workflow}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              log.status === "success" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {log.status === "success" ? "Success" : "Failed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
