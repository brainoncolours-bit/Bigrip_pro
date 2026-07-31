-- Categories, Artists (with category FK), and Artist Works
-- Run this in Supabase SQL Editor. Safe to run multiple times (idempotent).
-- Self-contained: also creates the artists table if it is missing, so this
-- migration never fails partway and rolls back.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_published_sort_order_idx
  on public.categories (published, sort_order, created_at);

-- Ensure artists exists before linking categories to it
create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  name text not null,
  role text not null,
  bio text not null,
  image_url text,
  website_url text,
  instagram_url text,
  category_id uuid references public.categories(id) on delete set null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artists_published_sort_order_idx
  on public.artists (published, sort_order, created_at);

-- Link artists to a category (no-op if artists was just created above)
alter table public.artists
  add column if not exists category_id uuid references public.categories(id) on delete set null;

create index if not exists artists_category_id_idx
  on public.artists (category_id);

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

create table if not exists public.artist_works (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  year text,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  media_url text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artist_works_artist_sort_order_idx
  on public.artist_works (artist_id, sort_order, created_at);

create index if not exists artist_works_published_idx
  on public.artist_works (published);

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

drop trigger if exists set_artist_works_updated_at on public.artist_works;
create trigger set_artist_works_updated_at
before update on public.artist_works
for each row
execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.artist_works enable row level security;

-- Categories: public reads published, authenticated admins full access
drop policy if exists "Published categories are publicly readable" on public.categories;
create policy "Published categories are publicly readable"
on public.categories
for select
to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert categories" on public.categories;
create policy "Authenticated admins can insert categories"
on public.categories
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update categories" on public.categories;
create policy "Authenticated admins can update categories"
on public.categories
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can delete categories" on public.categories;
create policy "Authenticated admins can delete categories"
on public.categories
for delete
to authenticated
using (true);

-- Artist works: public reads published, authenticated admins full access
drop policy if exists "Published artist works are publicly readable" on public.artist_works;
create policy "Published artist works are publicly readable"
on public.artist_works
for select
to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert artist works" on public.artist_works;
create policy "Authenticated admins can insert artist works"
on public.artist_works
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update artist works" on public.artist_works;
create policy "Authenticated admins can update artist works"
on public.artist_works
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can delete artist works" on public.artist_works;
create policy "Authenticated admins can delete artist works"
on public.artist_works
for delete
to authenticated
using (true);

-- Storage bucket for artist works media (reuses artists-media bucket)
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

-- Seed a default category so artists have something to select before real ones exist
insert into public.categories (name, sort_order, published) values
  ('Direction & Motion', 1, true)
on conflict (name) do nothing;

-- Force PostgREST to reload its schema cache so the API sees the new tables immediately
notify pgrst, 'reload schema';
