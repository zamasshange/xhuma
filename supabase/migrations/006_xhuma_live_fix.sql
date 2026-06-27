-- Xhuma live fix (www.xhuma.cc)
-- Run once in Supabase → SQL Editor if /create/* shows ON CONFLICT errors.

-- 1) Templates table + seed (required for profile_drafts FK)
create table if not exists public.templates (
  id text primary key,
  name text not null,
  description text not null default '',
  preview_image text,
  default_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into public.templates (id, name, description, preview_image, default_data) values
('creator', 'Creator', 'Big profile, social links', 'https://bio.link/_nuxt/summer._wbdH2hK.png', '{"layout":"creator","sections":["profile","links"],"theme":{"bg":"#0f0f0f","text":"#ffffff","button":"#7c3aed","radius":"14px"},"profile":{"display_name":"","bio":"","avatar_url":null},"links":[]}'::jsonb),
('business', 'Business', 'CTA buttons, WhatsApp', 'https://bio.link/_nuxt/basic.DuPDlgvB.png', '{"layout":"business","sections":["profile","links"],"theme":{"bg":"#ffffff","text":"#111111","button":"#000000","radius":"14px"},"profile":{"display_name":"","bio":"","avatar_url":null},"links":[]}'::jsonb),
('musician', 'Musician', 'Streaming links', 'https://bio.link/_nuxt/retro.tmNX0151.png', '{"layout":"music","sections":["profile","links"],"theme":{"bg":"#050505","text":"#ffffff","button":"#ff0055","radius":"999px"},"profile":{"display_name":"","bio":"","avatar_url":null},"links":[]}'::jsonb),
('portfolio', 'Portfolio', 'Projects + contact', 'https://bio.link/_nuxt/chameleon.C-GjyGpf.png', '{"layout":"portfolio","sections":["profile","links"],"theme":{"bg":"#faf5ff","text":"#4c1d95","button":"#7c3aed","radius":"12px"},"profile":{"display_name":"","bio":"","avatar_url":null},"links":[]}'::jsonb),
('minimal', 'Minimal', 'Clean links only', 'https://bio.link/_nuxt/rainy-night.fNTxc-2o.png', '{"layout":"minimal","sections":["profile","links"],"theme":{"bg":"#f4f4f4","text":"#0d0c22","button":"#ffffff","radius":"999px"},"profile":{"display_name":"","bio":"","avatar_url":null},"links":[]}'::jsonb)
on conflict (id) do nothing;

-- 2) profile_drafts with session_id primary key (no upsert required by app)
create table if not exists public.profile_drafts (
  session_id text primary key,
  template_id text not null references public.templates(id),
  data_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Add PK if table existed without one
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where table_schema = 'public' and table_name = 'profile_drafts' and constraint_type = 'PRIMARY KEY'
  ) then
    alter table public.profile_drafts add primary key (session_id);
  end if;
exception when others then null;
end $$;

create index if not exists profile_drafts_updated_idx on public.profile_drafts (updated_at desc);

alter table public.profile_drafts enable row level security;
alter table public.templates enable row level security;

drop policy if exists "templates_select" on public.templates;
drop policy if exists "drafts_select" on public.profile_drafts;
drop policy if exists "drafts_insert" on public.profile_drafts;
drop policy if exists "drafts_update" on public.profile_drafts;
drop policy if exists "drafts_delete" on public.profile_drafts;

create policy "templates_select" on public.templates for select using (true);
create policy "drafts_select" on public.profile_drafts for select using (true);
create policy "drafts_insert" on public.profile_drafts for insert with check (true);
create policy "drafts_update" on public.profile_drafts for update using (true);
create policy "drafts_delete" on public.profile_drafts for delete using (true);

-- 3) Profile + links columns used by editor / claim
alter table public.profiles add column if not exists template_id text references public.templates(id);
alter table public.links add column if not exists icon text;
