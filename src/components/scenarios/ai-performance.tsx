"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function AIUsageStats() {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    workflowTypes: { variance: 0, optimization: 0, planning: 0 },
    accuracyRate: 0,
    weeklyUsage: [0, 0, 0, 0],
  })

  useEffect(() => {
    setStats({
      totalAnalyses: 127,
      workflowTypes: { variance: 68, optimization: 42, planning: 17 },
      accuracyRate: 94.5,
      weeklyUsage: [23, 35, 29, 40],
    })
  }, [])

  const workflowMix = [
    { name: "Variance", value: stats.workflowTypes.variance, color: "#2563eb" },
    { name: "Optimization", value: stats.workflowTypes.optimization, color: "#0ea5e9" },
    { name: "Planning", value: stats.workflowTypes.planning, color: "#22c55e" },
  ]

  const weeklyUsage = stats.weeklyUsage.map((value, index) => ({
    name: `Week ${index + 1}`,
    value,
  }))

  const accuracyByType = [
    { name: "Variance", value: Math.max(88, stats.accuracyRate - 2.1) },
    { name: "Optimization", value: Math.max(88, stats.accuracyRate - 1.2) },
    { name: "Planning", value: Math.max(88, stats.accuracyRate - 3.4) },
  ]

  const varianceShare = stats.totalAnalyses
    ? Math.round((stats.workflowTypes.variance / stats.totalAnalyses) * 100)
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Intelligence Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              <PieChart className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="usage">
              <LineChart className="h-4 w-4 mr-2" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="accuracy">
              <BarChart className="h-4 w-4 mr-2" />
              Accuracy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total analyses</p>
                    <p className="text-3xl font-bold">{stats.totalAnalyses}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Top workflow</p>
                    <p className="text-3xl font-bold">Variance</p>
                    <p className="text-sm text-gray-500">{varianceShare}% of analyses</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Accuracy rate</p>
                    <p className="text-3xl font-bold">{stats.accuracyRate}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Workflow mix</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={workflowMix} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label>
                      {workflowMix.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Weekly usage</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={weeklyUsage}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Analyses" stroke="#2563eb" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Peak activity</h3>
                <div className="grid grid-cols-4 gap-4">
                  {["Morning", "Midday", "Afternoon", "Evening"].map((time, index) => (
                    <Card key={time}>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">{time}</p>
                          <p className="text-2xl font-bold">{Math.round(stats.totalAnalyses * (0.1 + index * 0.15))}</p>
                          <p className="text-sm text-gray-500">analyses</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accuracy" className="mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Accuracy by workflow</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={accuracyByType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Accuracy %" fill="#22c55e" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Continuous improvement</h4>
                <p>
                  The Decision Support Engine improves with analyst feedback. Accuracy increased from 89% to 94.5% in the
                  last 90 days.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
