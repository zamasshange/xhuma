-- Linkly MVP schema

create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null default '',
  bio text default '',
  avatar_url text,
  theme jsonb not null default '{"bg":"#0d0c22","text":"#ffffff","button":"#7c3aed","style":"rounded"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (
    username ~ '^[a-z0-9_-]{3,20}$'
  )
);

create index if not exists profiles_username_idx on public.profiles (username);

-- Links
create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  url text not null,
  position integer not null default 0,
  clicks integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists links_user_id_idx on public.links (user_id);
create index if not exists links_user_position_idx on public.links (user_id, position);

-- Analytics
create table if not exists public.profile_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists profile_views_user_id_idx on public.profile_views (user_id);

create table if not exists public.link_clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.links(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists link_clicks_user_id_idx on public.link_clicks (user_id);
create index if not exists link_clicks_link_id_idx on public.link_clicks (link_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.profile_views enable row level security;
alter table public.link_clicks enable row level security;

-- Profiles: public read, owner write
create policy "profiles_public_read" on public.profiles
  for select using (true);

create policy "profiles_owner_insert" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_owner_update" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_owner_delete" on public.profiles
  for delete using (auth.uid() = id);

-- Links: public read active, owner full control
create policy "links_public_read" on public.links
  for select using (is_active = true or auth.uid() = user_id);

create policy "links_owner_insert" on public.links
  for insert with check (auth.uid() = user_id);

create policy "links_owner_update" on public.links
  for update using (auth.uid() = user_id);

create policy "links_owner_delete" on public.links
  for delete using (auth.uid() = user_id);

-- Analytics: anyone can insert (tracking), owner reads
create policy "profile_views_insert" on public.profile_views
  for insert with check (true);

create policy "profile_views_owner_read" on public.profile_views
  for select using (auth.uid() = user_id);

create policy "link_clicks_insert" on public.link_clicks
  for insert with check (true);

create policy "link_clicks_owner_read" on public.link_clicks
  for select using (auth.uid() = user_id);

-- Storage bucket for avatars
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_owner_upload" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_owner_update" on storage.objects
  for update using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );
