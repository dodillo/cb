"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { FileUp, BarChart4, Calculator } from "lucide-react"

interface AnalyseBudgetaireNavProps extends React.HTMLAttributes<HTMLElement> {}

export function AnalyseBudgetaireNav({ className, ...props }: AnalyseBudgetaireNavProps) {
  const pathname = usePathname()

  const items = [
    {
      title: "Overview",
      href: "/analyse-budgetaire",
      icon: BarChart4,
    },
    {
      title: "Data intake",
      href: "/analyse-budgetaire/importation",
      icon: FileUp,
    },
    {
      title: "Variance intelligence",
      href: "/analyse-budgetaire/ecarts",
      icon: Calculator,
    },
  ]

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
            "justify-start gap-2",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
