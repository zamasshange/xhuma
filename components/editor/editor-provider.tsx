"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useAuth } from "@clerk/nextjs"
import { apiFetch } from "@/lib/api-fetch"
import { getUserId } from "@/lib/temp-user"
import type { DbLink, DbProfile, ProfileDraft, ProfileTheme } from "@/lib/database.types"
import {
  editorStateFromDocument,
  editorStateFromProfile,
  editorStateToDocument,
  normalizeTemplateDocument,
  newLink,
  type EditorLink,
  type EditorState,
} from "@/lib/editor-state"
import { sectionsToLegacyIds, type PageSection } from "@/lib/editor-sections"
import { inferLinkIcon } from "@/lib/infer-link-icon"
import { consumePendingDraft } from "@/lib/client-draft"
import { getStaticTemplate } from "@/data/templates"
import { resolveTemplateForCreate } from "@/lib/templates/catalog"
import { saveUserTemplate } from "@/lib/user-templates"
import { getThemePreset, resolveThemeBackground } from "@/lib/theme-presets"

export type EditorMode = "empty" | "draft" | "live"

type EditorContextValue = {
  mode: EditorMode
  state: EditorState | null
  loading: boolean
  saving: boolean
  userId: string
  profile: DbProfile | null
  setProfile: (p: DbProfile) => void
  updateProfile: (patch: Partial<EditorState["profile"]>) => void
  setTheme: (theme: ProfileTheme) => void
  addLink: (title?: string, url?: string, icon?: string | null) => void
  updateLink: (id: string, patch: Partial<EditorLink>) => void
  removeLink: (id: string) => void
  moveLink: (index: number, dir: -1 | 1) => void
  addPageSection: (section: PageSection) => void
  updatePageSection: (id: string, patch: Partial<PageSection>) => void
  removePageSection: (id: string) => void
  movePageSection: (id: string, dir: -1 | 1) => void
  saveAsTemplate: (name: string) => void
  syncLiveLink: (id: string) => Promise<void>
  deleteLiveLink: (id: string) => Promise<void>
  persistLiveLink: (title: string, url: string, icon?: string | null) => Promise<boolean>
  refresh: () => Promise<void>
}

const EditorContext = createContext<EditorContextValue | null>(null)
const AUTOSAVE_MS = 1000

export function EditorProvider({ children }: { children: ReactNode }) {
  const { userId: clerkId } = useAuth()
  const [anonId] = useState(() => getUserId())
  const userId = clerkId ?? anonId
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<DbProfile | null>(null)
  const [state, setState] = useState<EditorState | null>(null)
  const [mode, setMode] = useState<EditorMode>("empty")
  const lastSavedJson = useRef("")
  const lastSavedLiveProfile = useRef("")
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const liveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hydrate = useCallback(async () => {
    setLoading(true)
    try {
      const [profileRes, linksRes, draftRes] = await Promise.all([
        apiFetch<DbProfile | null>("/api/profile"),
        apiFetch<DbLink[]>("/api/links"),
        apiFetch<ProfileDraft | null>("/api/draft"),
      ])

      const p = profileRes.success ? (profileRes.data ?? null) : null
      const links = linksRes.success ? (linksRes.data ?? []) : []
      const draft = draftRes.success ? (draftRes.data ?? null) : null

      setProfile(p)

      if (p) {
        const liveState = editorStateFromProfile(p, links, p.template_id ?? "creator")
        setState(liveState)
        setMode("live")
        lastSavedJson.current = JSON.stringify(editorStateToDocument(liveState))
        lastSavedLiveProfile.current = JSON.stringify(liveState.profile)
      } else if (draft) {
        const doc = normalizeTemplateDocument(draft.data_json as Record<string, unknown>)
        const draftState = editorStateFromDocument(draft.template_id, doc)
        setState(draftState)
        setMode("draft")
        lastSavedJson.current = JSON.stringify(doc)
      } else {
        const pending = consumePendingDraft()
        if (pending) {
          const resolved =
            pending.document != null
              ? { templateId: pending.template_id, document: pending.document }
              : resolveTemplateForCreate(pending.template_id)

          if (resolved) {
            let draftState = editorStateFromDocument(resolved.templateId, resolved.document)
            if (pending.theme_id) {
              const preset = getThemePreset(pending.theme_id)
              if (preset) {
                draftState = {
                  ...draftState,
                  profile: { ...draftState.profile, theme: resolveThemeBackground(preset.theme) },
                }
              }
            }
            setState(draftState)
            setMode("draft")
            lastSavedJson.current = JSON.stringify(editorStateToDocument(draftState))
            void apiFetch("/api/draft", {
              method: "PUT",
              body: JSON.stringify({
                template_id: resolved.templateId,
                data: editorStateToDocument(draftState),
              }),
            })
          } else {
            const pendingTemplate = getStaticTemplate(pending.template_id)
            if (pendingTemplate) {
              let draftState = editorStateFromDocument(pendingTemplate.id, pendingTemplate.default_data)
              if (pending.theme_id) {
                const preset = getThemePreset(pending.theme_id)
                if (preset) {
                  draftState = {
                    ...draftState,
                    profile: { ...draftState.profile, theme: resolveThemeBackground(preset.theme) },
                  }
                }
              }
              setState(draftState)
              setMode("draft")
              lastSavedJson.current = JSON.stringify(editorStateToDocument(draftState))
              void apiFetch("/api/draft", {
                method: "PUT",
                body: JSON.stringify({
                  template_id: pendingTemplate.id,
                  data: editorStateToDocument(draftState),
                }),
              })
            } else {
              setState(null)
              setMode("empty")
              lastSavedJson.current = ""
            }
          }
        } else {
          setState(null)
          setMode("empty")
          lastSavedJson.current = ""
        }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getUserId()
    hydrate()
  }, [hydrate])

  const patchState = useCallback((updater: (s: EditorState) => EditorState) => {
    setState((prev) => (prev ? updater(prev) : prev))
  }, [])

  const updateProfile = useCallback(
    (patch: Partial<EditorState["profile"]>) => {
      patchState((s) => ({ ...s, profile: { ...s.profile, ...patch } }))
    },
    [patchState],
  )

  const setTheme = useCallback(
    (theme: ProfileTheme) => {
      patchState((s) => {
        const resolved = resolveThemeBackground(theme)
        return {
          ...s,
          profile: {
            ...s.profile,
            theme: {
              ...resolved,
              link_style: theme.link_style ?? s.profile.theme.link_style,
            },
          },
        }
      })
    },
    [patchState],
  )

  const addLink = useCallback(
    (title = "", url = "", icon?: string | null) => {
      patchState((s) => {
        const link = newLink(s.links.length)
        const resolvedIcon = icon ?? inferLinkIcon(title, url)
        return { ...s, links: [...s.links, { ...link, title, url, icon: resolvedIcon }] }
      })
    },
    [patchState],
  )

  const updateLink = useCallback(
    (id: string, patch: Partial<EditorLink>) => {
      patchState((s) => ({
        ...s,
        links: s.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      }))
    },
    [patchState],
  )

  const removeLink = useCallback(
    (id: string) => {
      patchState((s) => ({
        ...s,
        links: s.links.filter((l) => l.id !== id).map((l, i) => ({ ...l, position: i })),
      }))
    },
    [patchState],
  )

  const moveLink = useCallback(
    (index: number, dir: -1 | 1) => {
      patchState((s) => {
        const next = index + dir
        if (next < 0 || next >= s.links.length) return s
        const links = [...s.links]
        ;[links[index], links[next]] = [links[next], links[index]]
        return { ...s, links: links.map((l, i) => ({ ...l, position: i })) }
      })
    },
    [patchState],
  )

  const addPageSection = useCallback(
    (section: PageSection) => {
      patchState((s) => {
        const linksIdx = s.page_sections.findIndex((x) => x.type === "links")
        const insertAt = linksIdx >= 0 ? linksIdx + 1 : s.page_sections.length
        const page_sections = [...s.page_sections]
        page_sections.splice(insertAt, 0, section)
        return { ...s, page_sections, sections: sectionsToLegacyIds(page_sections) }
      })
    },
    [patchState],
  )

  const updatePageSection = useCallback(
    (id: string, patch: Partial<PageSection>) => {
      patchState((s) => ({
        ...s,
        page_sections: s.page_sections.map((sec) =>
          sec.id === id ? { ...sec, ...patch, content: patch.content ? { ...sec.content, ...patch.content } : sec.content } : sec,
        ),
      }))
    },
    [patchState],
  )

  const removePageSection = useCallback(
    (id: string) => {
      patchState((s) => {
        const target = s.page_sections.find((x) => x.id === id)
        if (!target || target.type === "profile" || target.type === "links") return s
        const page_sections = s.page_sections.filter((x) => x.id !== id)
        return { ...s, page_sections, sections: sectionsToLegacyIds(page_sections) }
      })
    },
    [patchState],
  )

  const movePageSection = useCallback(
    (id: string, dir: -1 | 1) => {
      patchState((s) => {
        const sections = [...s.page_sections]
        const idx = sections.findIndex((x) => x.id === id)
        if (idx < 0) return s
        if (sections[idx].type === "profile" || sections[idx].type === "links") return s
        const next = idx + dir
        if (next < 0 || next >= sections.length) return s
        if (sections[next].type === "profile" || sections[next].type === "links") return s
        ;[sections[idx], sections[next]] = [sections[next], sections[idx]]
        return { ...s, page_sections: sections, sections: sectionsToLegacyIds(sections) }
      })
    },
    [patchState],
  )

  const saveAsTemplate = useCallback(
    (name: string) => {
      setState((current) => {
        if (current) saveUserTemplate(name, editorStateToDocument(current), "custom")
        return current
      })
    },
    [],
  )

  // Draft autosave: full JSON → profile_drafts
  useEffect(() => {
    if (mode !== "draft" || !state) return
    const doc = editorStateToDocument(state)
    const json = JSON.stringify(doc)
    if (json === lastSavedJson.current) return

    if (draftTimer.current) clearTimeout(draftTimer.current)
    draftTimer.current = setTimeout(async () => {
      setSaving(true)
      try {
        const res = await apiFetch<ProfileDraft>("/api/draft", {
          method: "PUT",
          body: JSON.stringify({ data: doc }),
        })
        if (res.success) lastSavedJson.current = json
      } finally {
        setSaving(false)
      }
    }, AUTOSAVE_MS)

    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current)
    }
  }, [state, mode])

  // Live autosave: profile fields + page sections → profiles table
  useEffect(() => {
    if (mode !== "live" || !state) return

    const snapshot = JSON.stringify({
      profile: state.profile,
      page_sections: state.page_sections,
    })
    if (snapshot === lastSavedLiveProfile.current) return

    if (liveTimer.current) clearTimeout(liveTimer.current)
    liveTimer.current = setTimeout(async () => {
      setSaving(true)
      try {
        const theme = resolveThemeBackground(state.profile.theme)
        const res = await apiFetch<DbProfile>("/api/profile", {
          method: "PATCH",
          body: JSON.stringify({
            display_name: state.profile.display_name,
            bio: state.profile.bio,
            theme: { ...theme, page_sections: state.page_sections },
            avatar_url: state.profile.avatar_url,
          }),
        })
        if (res.success) lastSavedLiveProfile.current = snapshot
      } finally {
        setSaving(false)
      }
    }, AUTOSAVE_MS)

    return () => {
      if (liveTimer.current) clearTimeout(liveTimer.current)
    }
  }, [state?.profile, state?.page_sections, mode])

  const syncLiveLink = useCallback(
    async (id: string) => {
      if (!state) return
      const link = state.links.find((l) => l.id === id)
      if (!link) return
      await apiFetch("/api/links", {
        method: "PATCH",
        body: JSON.stringify({
          id,
          title: link.title,
          url: link.url || "https://example.com",
          icon: link.icon ?? inferLinkIcon(link.title, link.url),
          is_active: link.is_active,
        }),
      })
    },
    [state],
  )

  const deleteLiveLink = useCallback(
    async (id: string) => {
      removeLink(id)
      await apiFetch(`/api/links?id=${id}`, { method: "DELETE" })
    },
    [removeLink],
  )

  const persistLiveLink = useCallback(async (title: string, url: string, icon?: string | null) => {
    const resolvedIcon = icon ?? inferLinkIcon(title, url)
    const tempId = `temp-${crypto.randomUUID()}`
    patchState((s) => ({
      ...s,
      links: [
        ...s.links,
        {
          id: tempId,
          title,
          url,
          icon: resolvedIcon,
          position: s.links.length,
          is_active: true,
        },
      ],
    }))

    const res = await apiFetch<DbLink>("/api/links", {
      method: "POST",
      body: JSON.stringify({ title, url, icon: resolvedIcon }),
    })

    if (res.success && res.data) {
      patchState((s) => ({
        ...s,
        links: s.links.map((l) =>
          l.id === tempId
            ? {
                id: res.data!.id,
                title: res.data!.title,
                url: res.data!.url,
                icon: res.data!.icon ?? resolvedIcon,
                position: l.position,
                is_active: res.data!.is_active !== false,
              }
            : l,
        ),
      }))
      return true
    }

    // Keep link in editor preview even if save failed — user can edit URL and retry
    return false
  }, [patchState])

  const value = useMemo<EditorContextValue>(
    () => ({
      mode,
      state,
      loading,
      saving,
      userId,
      profile,
      setProfile,
      updateProfile,
      setTheme,
      addLink,
      updateLink,
      removeLink,
      moveLink,
      addPageSection,
      updatePageSection,
      removePageSection,
      movePageSection,
      saveAsTemplate,
      syncLiveLink,
      deleteLiveLink,
      persistLiveLink,
      refresh: hydrate,
    }),
    [
      mode,
      state,
      loading,
      saving,
      userId,
      profile,
      updateProfile,
      setTheme,
      addLink,
      updateLink,
      removeLink,
      moveLink,
      addPageSection,
      updatePageSection,
      removePageSection,
      movePageSection,
      saveAsTemplate,
      syncLiveLink,
      deleteLiveLink,
      persistLiveLink,
      hydrate,
    ],
  )

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

export function useEditor() {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error("useEditor must be used within EditorProvider")
  return ctx
}
