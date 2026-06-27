-- Repair profile_drafts if created without session_id primary key
-- Run in Supabase SQL Editor if draft save fails with ON CONFLICT errors.

-- Ensure templates exist first (required for template_id FK)
create table if not exists public.templates (
  id text primary key,
  name text not null,
  description text not null default '',
  preview_image text,
  default_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Recreate profile_drafts with correct PK if missing
do $$
begin
  if not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'profile_drafts'
  ) then
    create table public.profile_drafts (
      session_id text primary key,
      template_id text not null references public.templates(id),
      data_json jsonb not null default '{}'::jsonb,
      updated_at timestamptz not null default now()
    );
  elsif not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'profile_drafts'
      and constraint_type = 'PRIMARY KEY'
  ) then
    alter table public.profile_drafts add primary key (session_id);
  end if;
exception
  when others then
    -- Table exists with wrong shape — backup and recreate (safe for draft-only data)
    create table if not exists public.profile_drafts_new (
      session_id text primary key,
      template_id text not null references public.templates(id),
      data_json jsonb not null default '{}'::jsonb,
      updated_at timestamptz not null default now()
    );
    insert into public.profile_drafts_new (session_id, template_id, data_json, updated_at)
    select session_id, template_id, data_json, updated_at
    from public.profile_drafts
    on conflict (session_id) do nothing;
    drop table public.profile_drafts;
    alter table public.profile_drafts_new rename to profile_drafts;
end $$;

create index if not exists profile_drafts_updated_idx on public.profile_drafts (updated_at desc);

alter table public.profile_drafts enable row level security;

drop policy if exists "drafts_select" on public.profile_drafts;
drop policy if exists "drafts_insert" on public.profile_drafts;
drop policy if exists "drafts_update" on public.profile_drafts;
drop policy if exists "drafts_delete" on public.profile_drafts;

create policy "drafts_select" on public.profile_drafts for select using (true);
create policy "drafts_insert" on public.profile_drafts for insert with check (true);
create policy "drafts_update" on public.profile_drafts for update using (true);
create policy "drafts_delete" on public.profile_drafts for delete using (true);

-- Seed templates if missing (minimal set for FK)
insert into public.templates (id, name, description, preview_image, default_data) values
(
  'creator',
  'Creator',
  'Big profile, social links, and video-ready layout',
  'https://bio.link/_nuxt/summer._wbdH2hK.png',
  '{"layout":"creator","sections":["profile","links","socials"],"theme":{"bg":"#0f0f0f","text":"#ffffff","button":"#7c3aed","radius":"14px"},"profile":{"display_name":"","bio":"","avatar_url":null},"links":[{"title":"Instagram","url":""},{"title":"YouTube","url":""}]}'::jsonb
),
(
  'business',
  'Business',
  'CTA buttons, WhatsApp, and services focus',
  'https://bio.link/_nuxt/basic.DuPDlgvB.png',
  '{"layout":"business","sections":["profile","services","links","contact"],"theme":{"bg":"#ffffff","text":"#111111","button":"#000000","radius":"14px"},"profile":{"display_name":"","bio":"","avatar_url":null},"links":[]}'::jsonb
),
(
  'musician',
  'Musician',
  'Spotify embed style and streaming links',
  'https://bio.link/_nuxt/retro.tmNX0151.png',
  '{"layout":"music","sections":["profile","spotify_embed","links"],"theme":{"bg":"#050505","text":"#ffffff","button":"#ff0055","radius":"999px"},"profile":{"display_name":"","bio":"","avatar_url":null},"links":[]}'::jsonb
),
(
  'portfolio',
  'Portfolio',
  'Projects grid and contact button',
  'https://bio.link/_nuxt/chameleon.C-GjyGpf.png',
  '{"layout":"portfolio","sections":["profile","projects","links"],"theme":{"bg":"#faf5ff","text":"#4c1d95","button":"#7c3aed","radius":"12px"},"profile":{"display_name":"","bio":"","avatar_url":null},"links":[]}'::jsonb
),
(
  'minimal',
  'Minimal',
  'Clean links only',
  'https://bio.link/_nuxt/rainy-night.fNTxc-2o.png',
  '{"layout":"minimal","sections":["profile","links"],"theme":{"bg":"#f4f4f4","text":"#0d0c22","button":"#ffffff","radius":"999px"},"profile":{"display_name":"","bio":"","avatar_url":null},"links":[]}'::jsonb
)
on conflict (id) do nothing;

alter table public.profiles add column if not exists template_id text references public.templates(id);
alter table public.links add column if not exists icon text;
