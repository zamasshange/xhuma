import { inferLinkIcon } from "@/lib/infer-link-icon"
import { DEFAULT_THEME, themeForRender } from "@/lib/database.types"
import type { DbLink, DbProfile, ProfileTheme } from "@/lib/database.types"
import { normalizePageSections, pageSectionsFromDocument, sectionsToLegacyIds, type PageSection } from "@/lib/editor-sections"

/** Single source of truth for the editor */
export type EditorLink = {
  id: string
  title: string
  url: string
  icon?: string | null
  position: number
  is_active: boolean
}

export type EditorState = {
  template_id: string
  layout: string
  sections: string[]
  page_sections: PageSection[]
  profile: {
    display_name: string
    bio: string
    avatar_url: string | null
    theme: ProfileTheme
  }
  links: EditorLink[]
}

/** Template JSON stored in DB `templates.default_data` and `profile_drafts.data_json` */
export type TemplateDocument = {
  layout: string
  sections: string[]
  page_sections?: PageSection[]
  theme: ProfileTheme
  profile: {
    display_name: string
    bio: string
    avatar_url: string | null
  }
  links: Array<{
    id?: string
    title: string
    url: string
    icon?: string | null
    position?: number
    is_active?: boolean
  }>
}

export function normalizeTemplateDocument(
  raw: Record<string, unknown> | null | undefined,
): TemplateDocument {
  const theme = {
    ...DEFAULT_THEME,
    ...((raw?.theme as ProfileTheme | undefined) ??
      (raw?.profile as { theme?: ProfileTheme } | undefined)?.theme ??
      {}),
  }

  const profileRaw = (raw?.profile as TemplateDocument["profile"] | undefined) ?? raw

  const linksRaw = (raw?.links as TemplateDocument["links"] | undefined) ?? []
  const links = linksRaw.map((l, i) => ({
    id: String(l.id ?? `link-${i}`),
    title: String(l.title ?? "Link"),
    url: String(l.url ?? ""),
    icon: l.icon ?? inferLinkIcon(l.title, l.url),
    position: typeof l.position === "number" ? l.position : i,
    is_active: l.is_active !== false,
  }))
  links.sort((a, b) => a.position - b.position)

  const pageSections = normalizePageSections(raw?.page_sections)
  const sections = Array.isArray(raw?.sections)
    ? (raw!.sections as string[])
    : pageSections.length
      ? sectionsToLegacyIds(pageSections)
      : ["profile", "links"]

  return {
    layout: String(raw?.layout ?? "creator"),
    sections,
    page_sections: pageSections.length ? pageSections : undefined,
    theme,
    profile: {
      display_name: String(
        (profileRaw as { display_name?: string }).display_name ?? raw?.display_name ?? "",
      ),
      bio: String((profileRaw as { bio?: string }).bio ?? raw?.bio ?? ""),
      avatar_url:
        (profileRaw as { avatar_url?: string | null }).avatar_url ??
        (raw?.avatar_url as string | null) ??
        null,
    },
    links,
  }
}

export function editorStateFromDocument(templateId: string, doc: TemplateDocument): EditorState {
  const pageSections = pageSectionsFromDocument(doc)
  return {
    template_id: templateId,
    layout: doc.layout,
    sections: doc.sections.length ? doc.sections : sectionsToLegacyIds(pageSections),
    page_sections: pageSections,
    profile: {
      display_name: doc.profile.display_name,
      bio: doc.profile.bio,
      avatar_url: doc.profile.avatar_url,
      theme: themeForRender({ ...DEFAULT_THEME, ...doc.theme }),
    },
    links: doc.links.map((l, i) => ({
      id: l.id ?? `link-${i}`,
      title: l.title,
      url: l.url,
      icon: l.icon ?? inferLinkIcon(l.title, l.url),
      position: l.position ?? i,
      is_active: l.is_active !== false,
    })),
  }
}

export function editorStateToDocument(state: EditorState): TemplateDocument {
  return {
    layout: state.layout,
    sections: sectionsToLegacyIds(state.page_sections),
    page_sections: state.page_sections,
    theme: state.profile.theme,
    profile: {
      display_name: state.profile.display_name,
      bio: state.profile.bio,
      avatar_url: state.profile.avatar_url,
    },
    links: state.links.map((l) => ({
      id: l.id,
      title: l.title,
      url: l.url,
      icon: l.icon,
      position: l.position,
      is_active: l.is_active,
    })),
  }
}

export function editorStateFromProfile(
  profile: DbProfile,
  links: DbLink[],
  templateId = profile.template_id ?? "creator",
): EditorState {
  const sorted = [...links].sort((a, b) => a.position - b.position)
  const theme = themeForRender({ ...DEFAULT_THEME, ...profile.theme_json })
  const fromTheme = theme.page_sections
  const page_sections = fromTheme?.length
    ? normalizePageSections(fromTheme)
    : normalizePageSections([
        { id: "profile", type: "profile", content: {} },
        { id: "links", type: "links", content: {} },
      ])
  return {
    template_id: templateId,
    layout: templateId,
    sections: sectionsToLegacyIds(page_sections),
    page_sections,
    profile: {
      display_name: profile.display_name,
      bio: profile.bio ?? "",
      avatar_url: profile.avatar_url,
      theme,
    },
    links: sorted.map((l) => ({
      id: l.id,
      title: l.title,
      url: l.url,
      icon: l.icon ?? inferLinkIcon(l.title, l.url),
      position: l.position,
      is_active: l.is_active !== false,
    })),
  }
}

export function newLink(position: number): EditorLink {
  return {
    id: `temp-${crypto.randomUUID()}`,
    title: "",
    url: "",
    icon: null,
    position,
    is_active: true,
  }
}

/** True for links that only exist in the editor until saved via POST */
export function isPendingEditorLink(id: string): boolean {
  return id.startsWith("temp-") || id.startsWith("link-")
}
