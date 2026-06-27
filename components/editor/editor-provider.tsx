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
  isPendingEditorLink,
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
import { normalizeUrl } from "@/lib/normalize-url"

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
  persistLiveLink: (title: string, url: string, icon?: string | null) => Promise<{ ok: boolean; error?: string }>
  queueLinkDelete: (id: string) => void
  saveAll: () => Promise<{ ok: boolean; error?: string }>
  dirty: boolean
  refresh: () => Promise<void>
}

const EditorContext = createContext<EditorContextValue | null>(null)

function liveSnapshot(state: EditorState) {
  return JSON.stringify({
    profile: state.profile,
    page_sections: state.page_sections,
    links: state.links,
  })
}

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
  const lastSavedLiveSnapshot = useRef("")
  const pendingDeletes = useRef<string[]>([])
  const [dirty, setDirty] = useState(false)

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
        lastSavedLiveSnapshot.current = liveSnapshot(liveState)
        pendingDeletes.current = []
        setDirty(false)
      } else if (draft) {
        const doc = normalizeTemplateDocument(draft.data_json as Record<string, unknown>)
        const draftState = editorStateFromDocument(draft.template_id, doc)
        setState(draftState)
        setMode("draft")
        lastSavedJson.current = JSON.stringify(doc)
        setDirty(false)
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

  const markDirty = useCallback(() => setDirty(true), [])

  const updateProfile = useCallback(
    (patch: Partial<EditorState["profile"]>) => {
      patchState((s) => ({ ...s, profile: { ...s.profile, ...patch } }))
      markDirty()
    },
    [patchState, markDirty],
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
      markDirty()
    },
    [patchState, markDirty],
  )

  const addLink = useCallback(
    (title = "", url = "", icon?: string | null) => {
      patchState((s) => {
        const link = newLink(s.links.length)
        const resolvedIcon = icon ?? inferLinkIcon(title, url)
        return { ...s, links: [...s.links, { ...link, title, url, icon: resolvedIcon }] }
      })
      markDirty()
    },
    [patchState, markDirty],
  )

  const updateLink = useCallback(
    (id: string, patch: Partial<EditorLink>) => {
      patchState((s) => ({
        ...s,
        links: s.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      }))
      markDirty()
    },
    [patchState, markDirty],
  )

  const removeLink = useCallback(
    (id: string) => {
      patchState((s) => ({
        ...s,
        links: s.links.filter((l) => l.id !== id).map((l, i) => ({ ...l, position: i })),
      }))
      markDirty()
    },
    [patchState, markDirty],
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
      markDirty()
    },
    [patchState, markDirty],
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
      markDirty()
    },
    [patchState, markDirty],
  )

  const updatePageSection = useCallback(
    (id: string, patch: Partial<PageSection>) => {
      patchState((s) => ({
        ...s,
        page_sections: s.page_sections.map((sec) =>
          sec.id === id ? { ...sec, ...patch, content: patch.content ? { ...sec.content, ...patch.content } : sec.content } : sec,
        ),
      }))
      markDirty()
    },
    [patchState, markDirty],
  )

  const removePageSection = useCallback(
    (id: string) => {
      patchState((s) => {
        const target = s.page_sections.find((x) => x.id === id)
        if (!target || target.type === "profile" || target.type === "links") return s
        const page_sections = s.page_sections.filter((x) => x.id !== id)
        return { ...s, page_sections, sections: sectionsToLegacyIds(page_sections) }
      })
      markDirty()
    },
    [patchState, markDirty],
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
      markDirty()
    },
    [patchState, markDirty],
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

  const queueLinkDelete = useCallback(
    (id: string) => {
      if (mode === "live" && !id.startsWith("temp-") && !isPendingEditorLink(id)) {
        pendingDeletes.current.push(id)
      }
      removeLink(id)
    },
    [mode, removeLink],
  )

  const saveAll = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    if (!state) return { ok: false, error: "Nothing to save" }

    setSaving(true)
    try {
      if (mode === "draft") {
        const doc = editorStateToDocument(state)
        const res = await apiFetch<ProfileDraft>("/api/draft", {
          method: "PUT",
          body: JSON.stringify({ data: doc }),
        })
        if (!res.success) return { ok: false, error: res.error ?? "Save failed" }
        lastSavedJson.current = JSON.stringify(doc)
        setDirty(false)
        return { ok: true }
      }

      if (mode === "live") {
        const theme = resolveThemeBackground(state.profile.theme)
        const profileRes = await apiFetch<DbProfile>("/api/profile", {
          method: "PATCH",
          body: JSON.stringify({
            display_name: state.profile.display_name,
            bio: state.profile.bio,
            avatar_url: state.profile.avatar_url,
            theme: { ...theme, page_sections: state.page_sections },
          }),
        })
        if (!profileRes.success) {
          return { ok: false, error: profileRes.error ?? "Could not save profile" }
        }
        if (profileRes.data) setProfile(profileRes.data)

        for (const id of pendingDeletes.current) {
          const del = await apiFetch(`/api/links?id=${id}`, { method: "DELETE" })
          if (!del.success) return { ok: false, error: del.error ?? "Could not delete link" }
        }
        pendingDeletes.current = []

        const idMap = new Map<string, string>()

        async function createLink(title: string, url: string, icon: string | null) {
          return apiFetch<DbLink>("/api/links", {
            method: "POST",
            body: JSON.stringify({ title, url, icon }),
          })
        }

        for (let i = 0; i < state.links.length; i++) {
          const link = state.links[i]
          const title = link.title.trim()
          const url = link.url.trim() ? normalizeUrl(link.url) : ""
          const icon = link.icon ?? (url ? inferLinkIcon(title, url) : null)
          if (!title) continue

          if (isPendingEditorLink(link.id)) {
            if (!url) continue
            const res = await createLink(title, url, icon)
            if (!res.success) return { ok: false, error: res.error ?? `Could not add: ${title}` }
            if (res.data) idMap.set(link.id, res.data.id)
            continue
          }

          const body: Record<string, unknown> = {
            id: link.id,
            title,
            is_active: link.is_active,
            position: i,
          }
          if (url) body.url = url
          if (icon != null) body.icon = icon

          let res = await apiFetch<DbLink>("/api/links", { method: "PATCH", body: JSON.stringify(body) })

          if (!res.success && /link not found/i.test(res.error ?? "")) {
            if (!url) return { ok: false, error: `Add a URL for “${title}” before saving` }
            res = await createLink(title, url, icon)
            if (res.success && res.data) idMap.set(link.id, res.data.id)
          }

          if (!res.success) return { ok: false, error: res.error ?? `Could not update: ${title}` }
        }

        const nextLinks =
          idMap.size > 0
            ? state.links.map((l) => (idMap.has(l.id) ? { ...l, id: idMap.get(l.id)! } : l))
            : state.links

        if (idMap.size > 0) {
          patchState((s) => ({ ...s, links: nextLinks }))
        }

        lastSavedLiveSnapshot.current = liveSnapshot({ ...state, links: nextLinks })
        setDirty(false)
        return { ok: true }
      }

      return { ok: false, error: "Nothing to save" }
    } finally {
      setSaving(false)
    }
  }, [mode, patchState, state])

  const syncLiveLink = useCallback(
    async (id: string) => {
      if (!state) return
      const link = state.links.find((l) => l.id === id)
      if (!link) return

      const title = link.title.trim()
      const url = normalizeUrl(link.url)
      const icon = link.icon ?? inferLinkIcon(title, url)
      if (!title || !url) return

      if (isPendingEditorLink(id)) {
        const res = await apiFetch<DbLink>("/api/links", {
          method: "POST",
          body: JSON.stringify({ title, url, icon }),
        })
        if (res.success && res.data) {
          patchState((s) => ({
            ...s,
            links: s.links.map((l) =>
              l.id === id
                ? {
                    id: res.data!.id,
                    title: res.data!.title,
                    url: res.data!.url,
                    icon: res.data!.icon ?? icon,
                    position: l.position,
                    is_active: res.data!.is_active !== false,
                  }
                : l,
            ),
          }))
        }
        return
      }

      await apiFetch("/api/links", {
        method: "PATCH",
        body: JSON.stringify({
          id,
          title,
          url,
          icon,
          is_active: link.is_active,
        }),
      })
    },
    [patchState, state],
  )

  const deleteLiveLink = useCallback(
    async (id: string) => {
      removeLink(id)
      await apiFetch(`/api/links?id=${id}`, { method: "DELETE" })
    },
    [removeLink],
  )

  const persistLiveLink = useCallback(
    async (title: string, url: string, icon?: string | null) => {
      const trimmedTitle = title.trim()
      const normalizedUrl = normalizeUrl(url)
      const resolvedIcon = icon ?? inferLinkIcon(trimmedTitle, normalizedUrl)
      const tempId = `temp-${crypto.randomUUID()}`

      patchState((s) => ({
        ...s,
        links: [
          ...s.links,
          {
            id: tempId,
            title: trimmedTitle,
            url: normalizedUrl,
            icon: resolvedIcon,
            position: s.links.length,
            is_active: true,
          },
        ],
      }))

      const res = await apiFetch<DbLink>("/api/links", {
        method: "POST",
        body: JSON.stringify({ title: trimmedTitle, url: normalizedUrl, icon: resolvedIcon }),
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
        return { ok: true }
      }

      patchState((s) => ({
        ...s,
        links: s.links.filter((l) => l.id !== tempId),
      }))
      return { ok: false, error: res.error ?? "Could not add link" }
    },
    [patchState],
  )

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
      queueLinkDelete,
      saveAll,
      dirty,
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
      queueLinkDelete,
      saveAll,
      dirty,
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
