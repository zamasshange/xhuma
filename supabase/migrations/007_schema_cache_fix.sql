-- Schema cache fix: adds columns PostgREST expects (links.icon, profiles.template_id).
-- Safe to run multiple times. Reloads API schema cache when finished.

-- 1) Templates (FK target for template_id)
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

-- 2) Profile drafts
create table if not exists public.profile_drafts (
  session_id text primary key,
  template_id text not null references public.templates(id),
  data_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

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

-- 3) Missing columns on live tables (fixes "schema cache" errors)
alter table public.profiles add column if not exists template_id text;
alter table public.links add column if not exists icon text;

-- Add FK only when not already present
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'profiles'
      and constraint_name = 'profiles_template_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_template_id_fkey
      foreign key (template_id) references public.templates(id);
  end if;
exception when others then null;
end $$;

-- 4) Reload PostgREST schema cache
notify pgrst, 'reload schema';
