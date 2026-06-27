-- Temp-user MVP schema (no Supabase Auth)
-- Run this in SQL Editor if migrating from auth-based schema.

drop function if exists public.track_link_click(uuid);
drop table if exists public.link_clicks cascade;
drop table if exists public.profile_views cascade;
drop table if exists public.analytics cascade;
drop table if exists public.links cascade;
drop table if exists public.profiles cascade;

create table public.profiles (
  id text primary key,
  username text unique not null,
  display_name text not null default '',
  bio text default '',
  avatar_url text,
  theme_json jsonb not null default '{"bg":"#0f0f0f","text":"#ffffff","button":"#7c3aed","radius":"14px"}'::jsonb,
  created_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9_-]{3,20}$')
);

create index profiles_username_idx on public.profiles (username);

create table public.links (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  title text not null,
  url text not null,
  position integer not null default 0,
  clicks integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index links_user_id_idx on public.links (user_id);
create index links_user_position_idx on public.links (user_id, position);

create table public.analytics (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('view', 'click')),
  link_id uuid references public.links(id) on delete set null,
  created_at timestamptz not null default now()
);

create index analytics_user_id_idx on public.analytics (user_id);
create index analytics_type_idx on public.analytics (user_id, type);

-- Click tracking (public, no auth)
create or replace function public.track_link_click(p_link_id uuid)
returns table (url text, clicks integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_link public.links%rowtype;
begin
  select * into v_link from public.links where id = p_link_id and is_active = true;
  if not found then
    raise exception 'Link not found';
  end if;

  insert into public.analytics (user_id, type, link_id) values (v_link.user_id, 'click', v_link.id);
  update public.links set clicks = clicks + 1 where id = v_link.id returning * into v_link;

  return query select v_link.url, v_link.clicks;
end;
$$;

grant execute on function public.track_link_click(uuid) to anon, authenticated;

-- RLS: public read, open writes for temp-user MVP (API validates user_id)
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.analytics enable row level security;

create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (true);
create policy "profiles_update" on public.profiles for update using (true);
create policy "profiles_delete" on public.profiles for delete using (true);

create policy "links_select" on public.links for select using (true);
create policy "links_insert" on public.links for insert with check (true);
create policy "links_update" on public.links for update using (true);
create policy "links_delete" on public.links for delete using (true);

create policy "analytics_select" on public.analytics for select using (true);
create policy "analytics_insert" on public.analytics for insert with check (true);

-- Avatars bucket (open upload for temp users — path: {user_id}/avatar.ext)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
drop policy if exists "avatars_owner_upload" on storage.objects;
drop policy if exists "avatars_owner_update" on storage.objects;
drop policy if exists "avatars_owner_delete" on storage.objects;

create policy "avatars_public_read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_upload" on storage.objects for insert with check (bucket_id = 'avatars');
create policy "avatars_update" on storage.objects for update using (bucket_id = 'avatars');
create policy "avatars_delete" on storage.objects for delete using (bucket_id = 'avatars');
