"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { apiFetch } from "@/lib/api-fetch"
import { getUserId } from "@/lib/temp-user"
import type { DbLink, DbProfile, ProfileDraft } from "@/lib/database.types"

type DashboardContextValue = {
  userId: string
  profile: DbProfile | null
  links: DbLink[]
  draft: ProfileDraft | null
  loading: boolean
  refreshProfile: () => Promise<void>
  refreshLinks: () => Promise<void>
  refreshDraft: () => Promise<void>
  setProfile: (p: DbProfile) => void
  setLinks: (l: DbLink[]) => void
  setDraft: (d: ProfileDraft | null) => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [userId] = useState(() => getUserId())
  const [profile, setProfile] = useState<DbProfile | null>(null)
  const [links, setLinks] = useState<DbLink[]>([])
  const [draft, setDraft] = useState<ProfileDraft | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    const res = await apiFetch<DbProfile | null>("/api/profile")
    if (res.success) setProfile(res.data ?? null)
  }, [])

  const refreshLinks = useCallback(async () => {
    const res = await apiFetch<DbLink[]>("/api/links")
    if (res.success) setLinks(res.data ?? [])
  }, [])

  const refreshDraft = useCallback(async () => {
    const res = await apiFetch<ProfileDraft | null>("/api/draft")
    if (res.success) setDraft(res.data ?? null)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [profileRes, linksRes, draftRes] = await Promise.all([
          apiFetch<DbProfile | null>("/api/profile"),
          apiFetch<DbLink[]>("/api/links"),
          apiFetch<ProfileDraft | null>("/api/draft"),
        ])
        if (cancelled) return
        setProfile(profileRes.success ? (profileRes.data ?? null) : null)
        setLinks(linksRes.success ? (linksRes.data ?? []) : [])
        setDraft(draftRes.success ? (draftRes.data ?? null) : null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <DashboardContext.Provider
      value={{
        userId,
        profile,
        links,
        draft,
        loading,
        refreshProfile,
        refreshLinks,
        refreshDraft,
        setProfile,
        setLinks,
        setDraft,
      }}
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
