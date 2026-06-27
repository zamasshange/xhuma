-- Allow anonymous link click tracking via security definer function
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

  insert into public.link_clicks (link_id, user_id) values (v_link.id, v_link.user_id);
  update public.links set clicks = clicks + 1 where id = v_link.id returning * into v_link;

  return query select v_link.url, v_link.clicks;
end;
$$;

grant execute on function public.track_link_click(uuid) to anon, authenticated;
