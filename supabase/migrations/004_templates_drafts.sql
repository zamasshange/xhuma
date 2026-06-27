-- Templates + profile drafts (edit before claim)

create table if not exists public.templates (
  id text primary key,
  name text not null,
  description text not null default '',
  preview_image text,
  default_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.profile_drafts (
  session_id text primary key,
  template_id text not null references public.templates(id),
  data_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists profile_drafts_updated_idx on public.profile_drafts (updated_at desc);

alter table public.profiles
  add column if not exists template_id text references public.templates(id);

alter table public.links
  add column if not exists icon text;

alter table public.profile_drafts enable row level security;
alter table public.templates enable row level security;

create policy "templates_select" on public.templates for select using (true);
create policy "drafts_select" on public.profile_drafts for select using (true);
create policy "drafts_insert" on public.profile_drafts for insert with check (true);
create policy "drafts_update" on public.profile_drafts for update using (true);
create policy "drafts_delete" on public.profile_drafts for delete using (true);

-- Seed MVP templates
insert into public.templates (id, name, description, preview_image, default_data) values
(
  'creator',
  'Creator',
  'Big profile, social links, and video-ready layout',
  'https://bio.link/_nuxt/summer._wbdH2hK.png',
  '{
    "layout": "creator",
    "sections": ["profile", "links", "socials"],
    "display_name": "Your Name",
    "bio": "Creator · Content · Community",
    "avatar_url": null,
    "theme": {"bg":"#38bdf8","text":"#ffffff","button":"#facc15","button_text":"#0d0c22","radius":"0","button_style":"wavy"},
    "links": [
      {"id":"1","title":"Follow on Instagram","url":"https://instagram.com","icon":"instagram","position":0,"is_active":true},
      {"id":"2","title":"Watch my latest video","url":"https://youtube.com","icon":"youtube","position":1,"is_active":true},
      {"id":"3","title":"Join my newsletter","url":"https://example.com","icon":null,"position":2,"is_active":true}
    ]
  }'::jsonb
),
(
  'business',
  'Business',
  'CTA buttons, WhatsApp, and services focus',
  'https://bio.link/_nuxt/basic.DuPDlgvB.png',
  '{
    "layout": "business",
    "sections": ["profile", "links", "cta"],
    "display_name": "Your Business",
    "bio": "We help you grow — book a call today.",
    "avatar_url": null,
    "theme": {"bg":"#ffffff","text":"#0d0c22","button":"#0d0c22","button_text":"#ffffff","radius":"14px","button_style":"rounded"},
    "links": [
      {"id":"1","title":"Book a consultation","url":"https://calendly.com","icon":null,"position":0,"is_active":true},
      {"id":"2","title":"WhatsApp us","url":"https://wa.me/","icon":"whatsapp","position":1,"is_active":true},
      {"id":"3","title":"Our services","url":"https://example.com","icon":null,"position":2,"is_active":true}
    ]
  }'::jsonb
),
(
  'musician',
  'Musician',
  'Spotify embed style and streaming links',
  'https://bio.link/_nuxt/retro.tmNX0151.png',
  '{
    "layout": "musician",
    "sections": ["profile", "links", "music"],
    "display_name": "Artist Name",
    "bio": "New music out now — stream everywhere.",
    "avatar_url": null,
    "theme": {"bg":"#0f0f0f","text":"#ffffff","button":"#1db954","button_text":"#ffffff","radius":"999px","button_style":"pill"},
    "links": [
      {"id":"1","title":"Listen on Spotify","url":"https://open.spotify.com","icon":"spotify","position":0,"is_active":true},
      {"id":"2","title":"Apple Music","url":"https://music.apple.com","icon":null,"position":1,"is_active":true},
      {"id":"3","title":"Tour dates","url":"https://example.com","icon":null,"position":2,"is_active":true}
    ]
  }'::jsonb
),
(
  'portfolio',
  'Portfolio',
  'Projects grid and contact button',
  'https://bio.link/_nuxt/chameleon.C-GjyGpf.png',
  '{
    "layout": "portfolio",
    "sections": ["profile", "projects", "links"],
    "display_name": "Designer Name",
    "bio": "Portfolio · Branding · Web design",
    "avatar_url": null,
    "theme": {"bg":"#faf5ff","text":"#4c1d95","button":"#7c3aed","button_text":"#ffffff","radius":"12px","button_style":"rounded"},
    "links": [
      {"id":"1","title":"View projects","url":"https://behance.net","icon":null,"position":0,"is_active":true},
      {"id":"2","title":"Hire me","url":"https://example.com","icon":null,"position":1,"is_active":true},
      {"id":"3","title":"Contact","url":"mailto:hello@example.com","icon":null,"position":2,"is_active":true}
    ]
  }'::jsonb
),
(
  'minimal',
  'Minimal',
  'Clean links only — nothing extra',
  'https://bio.link/_nuxt/rainy-night.fNTxc-2o.png',
  '{
    "layout": "minimal",
    "sections": ["profile", "links"],
    "display_name": "Your Name",
    "bio": "",
    "avatar_url": null,
    "theme": {"bg":"#f4f4f4","text":"#0d0c22","button":"#ffffff","button_text":"#0d0c22","radius":"999px","button_style":"pill"},
    "links": [
      {"id":"1","title":"Website","url":"https://example.com","icon":null,"position":0,"is_active":true},
      {"id":"2","title":"Email me","url":"mailto:hello@example.com","icon":null,"position":1,"is_active":true}
    ]
  }'::jsonb
)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  preview_image = excluded.preview_image,
  default_data = excluded.default_data;
