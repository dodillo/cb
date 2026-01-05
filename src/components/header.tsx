"use client"

import { useState } from "react"
import { Bell, Search, User, Menu } from "lucide-react"
import { usePathname } from "next/navigation"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const getPageTitle = () => {
    if (pathname === "/") return "Operational Overview"
    if (pathname === "/couts") return "Cost Structure"
    if (pathname === "/comptabilite") return "Accounting Intelligence"
    if (pathname === "/budgets") return "Budget Performance"
    if (pathname === "/analyse") return "Variance Intelligence"
    if (pathname === "/analyse-budgetaire") return "Financial Performance"
    if (pathname.includes("/scenarios")) return "Automated Financial Intelligence"
    if (pathname.includes("/admin")) return "Administration"
    return "Financial Performance Suite"
  }

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <button className="mr-4 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle sidebar">
          <Menu className="h-5 w-5 text-gray-500" />
        </button>
        <div className="hidden md:block">
          <h2 className="text-lg font-medium">{getPageTitle()}</h2>
        </div>
        <div className={`relative ${isSearchOpen ? "w-64" : "w-auto"} ml-4`}>
          <button
            className={`flex items-center text-gray-500 ${isSearchOpen ? "hidden" : "block"}`}
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
            <span className="ml-2 text-sm hidden md:inline">Search...</span>
          </button>
          {isSearchOpen && (
            <div className="absolute inset-0 flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border rounded-md py-1 px-3 text-sm"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
                aria-label="Search input"
              />
              <Search className="h-4 w-4 text-gray-400 absolute right-3" />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative text-gray-500" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </button>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <User className="h-4 w-4" />
          </div>
          <span className="ml-2 text-sm font-medium hidden md:block">Analyst</span>
        </div>
      </div>
    </header>
  )
}
