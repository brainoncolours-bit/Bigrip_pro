create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  name text not null,
  role text not null,
  bio text not null,
  image_url text,
  website_url text,
  instagram_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artists_published_sort_order_idx
  on public.artists (published, sort_order, created_at);

drop trigger if exists set_artists_updated_at on public.artists;
create trigger set_artists_updated_at
before update on public.artists
for each row
execute function public.set_updated_at();

alter table public.artists enable row level security;

drop policy if exists "Published artists are publicly readable" on public.artists;
create policy "Published artists are publicly readable"
on public.artists
for select
to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert artists" on public.artists;
create policy "Authenticated admins can insert artists"
on public.artists
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update artists" on public.artists;
create policy "Authenticated admins can update artists"
on public.artists
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can delete artists" on public.artists;
create policy "Authenticated admins can delete artists"
on public.artists
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('artists-media', 'artists-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Artists media is publicly readable" on storage.objects;
create policy "Artists media is publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'artists-media');

drop policy if exists "Authenticated admins can upload artists media" on storage.objects;
create policy "Authenticated admins can upload artists media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'artists-media');

drop policy if exists "Authenticated admins can update artists media" on storage.objects;
create policy "Authenticated admins can update artists media"
on storage.objects
for update
to authenticated
using (bucket_id = 'artists-media')
with check (bucket_id = 'artists-media');

drop policy if exists "Authenticated admins can delete artists media" on storage.objects;
create policy "Authenticated admins can delete artists media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'artists-media');
