import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart2, Bot, Calculator, CreditCard, FileText } from "lucide-react"

export default function Home() {
  const modules = [
    {
      title: "Cost Structure",
      description: "Monitor spend drivers and unit economics.",
      icon: <Calculator className="h-8 w-8 text-blue-500" />,
      href: "/couts",
    },
    {
      title: "Accounting Intelligence",
      description: "Track ledger performance and analytical allocations.",
      icon: <FileText className="h-8 w-8 text-green-500" />,
      href: "/comptabilite",
    },
    {
      title: "Budget Performance",
      description: "Plan, execute, and reforecast budgets with confidence.",
      icon: <CreditCard className="h-8 w-8 text-amber-500" />,
      href: "/budgets",
    },
    {
      title: "Variance Intelligence",
      description: "Analyze plan vs. actual performance in real time.",
      icon: <BarChart2 className="h-8 w-8 text-orange-500" />,
      href: "/analyse",
    },
    {
      title: "Financial Performance",
      description: "Consolidated insights across operational initiatives.",
      icon: <BarChart2 className="h-8 w-8 text-rose-500" />,
      href: "/analyse-budgetaire",
    },
    {
      title: "Automated Financial Intelligence",
      description: "Autonomous analysis runs with governance-ready outputs.",
      icon: <Bot className="h-8 w-8 text-indigo-500" />,
      href: "/scenarios",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold tracking-tight">Financial Performance Suite</h1>
        <p className="text-xl text-gray-500 mt-4">Enterprise-grade budgeting, variance, and automated intelligence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link href={module.href} key={module.title} className="block">
            <Card className="h-full hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex justify-center">{module.icon}</div>
                <CardTitle className="text-center mt-4">{module.title}</CardTitle>
                <CardDescription className="text-center">{module.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Link href={module.href} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                  Explore <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
