import type { EditorState } from "@/lib/editor-state"
import type { EditorTabId } from "@/components/editor/editor-shell"

export function buildEditorContextPayload(
  state: EditorState | null,
  tab: EditorTabId,
  username?: string,
) {
  if (!state) return { tab, username, empty: true }

  const activeLinks = state.links
    .filter((l) => l.is_active !== false)
    .map((l) => ({ title: l.title, url: l.url, icon: l.icon }))

  return {
    tab,
    username,
    template_id: state.template_id,
    profile: {
      display_name: state.profile.display_name,
      bio: state.profile.bio,
      has_avatar: !!state.profile.avatar_url,
      theme_preset: state.profile.theme.preset_id,
      link_style: state.profile.theme.link_style,
    },
    links: activeLinks,
    link_count: activeLinks.length,
  }
}
