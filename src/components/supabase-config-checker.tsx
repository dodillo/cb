"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SupabaseConfigChecker({ children }: { children: React.ReactNode }) {
  const [supabaseUrl, setSupabaseUrl] = useState<string>("")
  const [supabaseKey, setSupabaseKey] = useState<string>("")
  const [isConfigured, setIsConfigured] = useState<boolean>(false)
  const [isChecking, setIsChecking] = useState<boolean>(true)

  useEffect(() => {
    const storedUrl = localStorage.getItem("supabase_url")
    const storedKey = localStorage.getItem("supabase_key")

    if (storedUrl && storedKey) {
      setSupabaseUrl(storedUrl)
      setSupabaseKey(storedKey)
      setIsConfigured(true)
    }

    setIsChecking(false)
  }, [])

  const saveConfig = () => {
    if (supabaseUrl && supabaseKey) {
      localStorage.setItem("supabase_url", supabaseUrl)
      localStorage.setItem("supabase_key", supabaseKey)
      setIsConfigured(true)
      window.location.reload()
    }
  }

  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">Checking configuration...</div>
  }

  if (!isConfigured) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Data connector configuration required</CardTitle>
            <CardDescription>Enter your data connector credentials to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTitle>Missing connector variables</AlertTitle>
              <AlertDescription>
                NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY are not configured.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="supabase-url">Connector URL</Label>
              <Input
                id="supabase-url"
                placeholder="https://your-project.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-key">Connector API key</Label>
              <Input
                id="supabase-key"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Find these values in your data provider console under API settings.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveConfig} disabled={!supabaseUrl || !supabaseKey}>
              Save and continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
