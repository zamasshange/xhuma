"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { apiFetch } from "@/lib/api-fetch"
import type { DbLink, DbProfile } from "@/lib/database.types"

type DashboardContextValue = {
  profile: DbProfile | null
  links: DbLink[]
  loading: boolean
  refreshProfile: () => Promise<void>
  refreshLinks: () => Promise<void>
  setProfile: (p: DbProfile) => void
  setLinks: (l: DbLink[]) => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<DbProfile | null>(null)
  const [links, setLinks] = useState<DbLink[]>([])
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    const res = await apiFetch<DbProfile | null>("/api/profile")
    if (res.success) setProfile(res.data ?? null)
  }, [])

  const refreshLinks = useCallback(async () => {
    const res = await apiFetch<DbLink[]>("/api/links")
    if (res.success) setLinks(res.data ?? [])
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const [profileRes, linksRes] = await Promise.all([
        apiFetch<DbProfile | null>("/api/profile"),
        apiFetch<DbLink[]>("/api/links"),
      ])
      if (cancelled) return
      const p = profileRes.success ? (profileRes.data ?? null) : null
      setProfile(p)
      setLinks(linksRes.success ? (linksRes.data ?? []) : [])
      setLoading(false)

      const isOnboarding = pathname === "/dashboard/onboarding"
      if (!p && !isOnboarding) router.replace("/dashboard/onboarding")
      if (p && isOnboarding) router.replace("/dashboard")
    })()
    return () => {
      cancelled = true
    }
  }, [pathname, router])

  return (
    <DashboardContext.Provider
      value={{ profile, links, loading, refreshProfile, refreshLinks, setProfile, setLinks }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider")
  return ctx
}
