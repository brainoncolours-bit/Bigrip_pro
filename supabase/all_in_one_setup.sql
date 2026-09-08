-- ================================================================
-- SEKRICK COMPLETE ALL-IN-ONE SUPABASE DATABASE SETUP
-- Paste this entire script into the Supabase SQL Editor and click "Run".
-- ================================================================

-- 1. Enable UUID extension and helper trigger
create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ================================================================
-- 2. WORKS TABLE & STORAGE
-- ================================================================
create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  display_id text,
  sort_order integer not null default 0,
  title text not null,
  category text not null,
  year text not null,
  tag text not null,
  size text not null default 'small' check (size in ('large', 'medium', 'small')),
  accent boolean not null default false,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  media_url text,
  "desc" text not null,
  details text[] not null default '{}',
  color text not null default 'from-[#1a0a05] via-[#0f0a08] to-[#0a0a0a]',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists works_published_sort_order_idx
  on public.works (published, sort_order, created_at);

drop trigger if exists set_works_updated_at on public.works;
create trigger set_works_updated_at
before update on public.works
for each row execute function public.set_updated_at();

alter table public.works enable row level security;

drop policy if exists "Published works are publicly readable" on public.works;
create policy "Published works are publicly readable"
on public.works for select to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert works" on public.works;
create policy "Authenticated admins can insert works"
on public.works for insert to authenticated with check (true);

drop policy if exists "Authenticated admins can update works" on public.works;
create policy "Authenticated admins can update works"
on public.works for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated admins can delete works" on public.works;
create policy "Authenticated admins can delete works"
on public.works for delete to authenticated using (true);

insert into storage.buckets (id, name, public)
values ('works-media', 'works-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Works media is publicly readable" on storage.objects;
create policy "Works media is publicly readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'works-media');

drop policy if exists "Authenticated admins can upload works media" on storage.objects;
create policy "Authenticated admins can upload works media"
on storage.objects for insert to authenticated with check (bucket_id = 'works-media');

drop policy if exists "Authenticated admins can update works media" on storage.objects;
create policy "Authenticated admins can update works media"
on storage.objects for update to authenticated using (bucket_id = 'works-media') with check (bucket_id = 'works-media');

drop policy if exists "Authenticated admins can delete works media" on storage.objects;
create policy "Authenticated admins can delete works media"
on storage.objects for delete to authenticated using (bucket_id = 'works-media');

-- ================================================================
-- 3. HOME VIDEOS TABLE & STORAGE (6 ACTIVE SLOTS ONLY)
-- ================================================================
create table if not exists public.home_videos (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  section_label text not null,
  media_url text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists home_videos_published_sort_order_idx
  on public.home_videos (published, sort_order, section_key);

drop trigger if exists set_home_videos_updated_at on public.home_videos;
create trigger set_home_videos_updated_at
before update on public.home_videos
for each row execute function public.set_updated_at();

alter table public.home_videos enable row level security;

drop policy if exists "Home videos are publicly readable" on public.home_videos;
create policy "Home videos are publicly readable"
on public.home_videos for select to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert home videos" on public.home_videos;
create policy "Authenticated admins can insert home videos"
on public.home_videos for insert to authenticated with check (true);

drop policy if exists "Authenticated admins can update home videos" on public.home_videos;
create policy "Authenticated admins can update home videos"
on public.home_videos for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated admins can delete home videos" on public.home_videos;
create policy "Authenticated admins can delete home videos"
on public.home_videos for delete to authenticated using (true);

insert into storage.buckets (id, name, public)
values ('home-videos-media', 'home-videos-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Home videos media is publicly readable" on storage.objects;
create policy "Home videos media is publicly readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'home-videos-media');

drop policy if exists "Authenticated admins can upload home videos media" on storage.objects;
create policy "Authenticated admins can upload home videos media"
on storage.objects for insert to authenticated with check (bucket_id = 'home-videos-media');

drop policy if exists "Authenticated admins can update home videos media" on storage.objects;
create policy "Authenticated admins can update home videos media"
on storage.objects for update to authenticated using (bucket_id = 'home-videos-media') with check (bucket_id = 'home-videos-media');

drop policy if exists "Authenticated admins can delete home videos media" on storage.objects;
create policy "Authenticated admins can delete home videos media"
on storage.objects for delete to authenticated using (bucket_id = 'home-videos-media');

-- Insert the 6 active home video sections
insert into public.home_videos (section_key, section_label, sort_order, published) values
  ('hero', 'Hero Background (Section 1)', 1, true),
  ('hero_secondary', 'Hero Secondary Banner (Section 3)', 2, true),
  ('chromatic_matte_1', 'Chromatic Matte — Left (Section 4)', 3, true),
  ('chromatic_matte_2', 'Chromatic Matte — Right (Section 4)', 4, true),
  ('video_intercept', 'Full-bleed Parallax Intercept (Section 8)', 5, true),
  ('asymmetric_block', 'Asymmetric Grid Overlay (Section 10)', 6, true)
on conflict (section_key) do nothing;

-- ================================================================
-- 4. SERVICES VIDEOS TABLE & STORAGE (SEKRIAC PAGE)
-- ================================================================
create table if not exists public.services_videos (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  section_label text not null,
  media_url text,
  title text,
  description text,
  metrics jsonb default '[]'::jsonb,
  button_label text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_videos_published_sort_order_idx
  on public.services_videos (published, sort_order, section_key);

drop trigger if exists set_services_videos_updated_at on public.services_videos;
create trigger set_services_videos_updated_at
before update on public.services_videos
for each row execute function public.set_updated_at();

alter table public.services_videos enable row level security;

drop policy if exists "Services videos are publicly readable" on public.services_videos;
create policy "Services videos are publicly readable"
on public.services_videos for select to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert services videos" on public.services_videos;
create policy "Authenticated admins can insert services videos"
on public.services_videos for insert to authenticated with check (true);

drop policy if exists "Authenticated admins can update services videos" on public.services_videos;
create policy "Authenticated admins can update services videos"
on public.services_videos for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated admins can delete services videos" on public.services_videos;
create policy "Authenticated admins can delete services videos"
on public.services_videos for delete to authenticated using (true);

insert into storage.buckets (id, name, public)
values ('services-videos-media', 'services-videos-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Services videos media is publicly readable" on storage.objects;
create policy "Services videos media is publicly readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'services-videos-media');

drop policy if exists "Authenticated admins can upload services videos media" on storage.objects;
create policy "Authenticated admins can upload services videos media"
on storage.objects for insert to authenticated with check (bucket_id = 'services-videos-media');

drop policy if exists "Authenticated admins can update services videos media" on storage.objects;
create policy "Authenticated admins can update services videos media"
on storage.objects for update to authenticated using (bucket_id = 'services-videos-media') with check (bucket_id = 'services-videos-media');

drop policy if exists "Authenticated admins can delete services videos media" on storage.objects;
create policy "Authenticated admins can delete services videos media"
on storage.objects for delete to authenticated using (bucket_id = 'services-videos-media');

insert into public.services_videos (section_key, section_label, title, description, metrics, sort_order, published) values
  ('service_1', 'Cinematic Direction & Architecture', 'VISION DEFINES EVERYTHING', 'Creative excellence begins with a clear vision. Every decision we make is guided by purpose, originality, and craftsmanship.', '["ANAMORPHIC PIPELINES", "SPATIAL BLOCKING", "16MM / 35MM EMBEDDED ENGINE"]'::jsonb, 1, true),
  ('service_2', 'Chromatic Grade & Spectral Depth', 'PRECISION IN EVERY DETAIL', 'Lighting, movement, composition, and sound work together to create immersive cinematic experiences that elevate every story.', '["LUT SPECULATION", "HIGH-GLOW CONTRAST ISOLATION", "REDUCED NOISE COMPRESSION"]'::jsonb, 2, true),
  ('service_3', 'Editorial Fashion & Silhouette Capture', 'BUILT FOR TIMELESS IMPACT', 'We don''t create content for the moment. We create visual experiences designed to inspire, engage, and endure.', '["DRAPE/VELOCITY SYNC", "TEXTURE RETENTION ENGINE", "ASYMMETRIC FRAMING"]'::jsonb, 3, true),
  ('service_4', 'Sonic Landscapes & Audio Texturing', 'COLLABORATION DRIVES CREATIVITY', 'Great storytelling is never a solo effort. We partner closely with our clients, combining ideas, expertise, and creativity to transform ambitious visions into unforgettable cinematic experiences.', '["SUB-FREQUENCY CALIBRATION", "RHYTHMIC INTERVAL SYNCHRONIZATION", "ATMOSPHERIC GAIN DESIGN"]'::jsonb, 4, true),
  ('services_cta', 'Services CTA Background Reel', 'READY TO CALIBRATE YOUR SEQUENCES?', 'Every remarkable film begins with a conversation. Whether you''re launching a brand, producing a campaign, or telling a story that matters, we''re here to craft visuals with purpose, precision, and lasting impact.', '[]'::jsonb, 5, true)
on conflict (section_key) do nothing;

-- ================================================================
-- 5. CATEGORIES, ARTISTS & ARTIST WORKS
-- ================================================================
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

create index if not exists artists_category_id_idx
  on public.artists (category_id);

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_artists_updated_at on public.artists;
create trigger set_artists_updated_at
before update on public.artists
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.artists enable row level security;

-- Categories RLS
drop policy if exists "Published categories are publicly readable" on public.categories;
create policy "Published categories are publicly readable"
on public.categories for select to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert categories" on public.categories;
create policy "Authenticated admins can insert categories"
on public.categories for insert to authenticated with check (true);

drop policy if exists "Authenticated admins can update categories" on public.categories;
create policy "Authenticated admins can update categories"
on public.categories for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated admins can delete categories" on public.categories;
create policy "Authenticated admins can delete categories"
on public.categories for delete to authenticated using (true);

-- Artists RLS
drop policy if exists "Published artists are publicly readable" on public.artists;
create policy "Published artists are publicly readable"
on public.artists for select to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert artists" on public.artists;
create policy "Authenticated admins can insert artists"
on public.artists for insert to authenticated with check (true);

drop policy if exists "Authenticated admins can update artists" on public.artists;
create policy "Authenticated admins can update artists"
on public.artists for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated admins can delete artists" on public.artists;
create policy "Authenticated admins can delete artists"
on public.artists for delete to authenticated using (true);

-- Artist Works Table
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

drop trigger if exists set_artist_works_updated_at on public.artist_works;
create trigger set_artist_works_updated_at
before update on public.artist_works
for each row execute function public.set_updated_at();

alter table public.artist_works enable row level security;

drop policy if exists "Published artist works are publicly readable" on public.artist_works;
create policy "Published artist works are publicly readable"
on public.artist_works for select to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert artist works" on public.artist_works;
create policy "Authenticated admins can insert artist works"
on public.artist_works for insert to authenticated with check (true);

drop policy if exists "Authenticated admins can update artist works" on public.artist_works;
create policy "Authenticated admins can update artist works"
on public.artist_works for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated admins can delete artist works" on public.artist_works;
create policy "Authenticated admins can delete artist works"
on public.artist_works for delete to authenticated using (true);

-- Artists Media Storage Bucket
insert into storage.buckets (id, name, public)
values ('artists-media', 'artists-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Artists media is publicly readable" on storage.objects;
create policy "Artists media is publicly readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'artists-media');

drop policy if exists "Authenticated admins can upload artists media" on storage.objects;
create policy "Authenticated admins can upload artists media"
on storage.objects for insert to authenticated with check (bucket_id = 'artists-media');

drop policy if exists "Authenticated admins can update artists media" on storage.objects;
create policy "Authenticated admins can update artists media"
on storage.objects for update to authenticated using (bucket_id = 'artists-media') with check (bucket_id = 'artists-media');

drop policy if exists "Authenticated admins can delete artists media" on storage.objects;
create policy "Authenticated admins can delete artists media"
on storage.objects for delete to authenticated using (bucket_id = 'artists-media');

-- Seed default category
insert into public.categories (name, sort_order, published) values
  ('Direction & Motion', 1, true),
  ('Photography & Stills', 2, true),
  ('Creative & Styling', 3, true)
on conflict (name) do nothing;

-- ================================================================
-- 6. JOURNAL VIDEOS TABLE & STORAGE
-- ================================================================
create table if not exists public.journal_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  director text default 'SEKRICK ARCHIVE',
  runtime text default '03:00 MIN',
  desc_text text,
  media_url text,
  sort_order integer not null default 1,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists journal_videos_sort_order_idx
  on public.journal_videos (sort_order, created_at);

drop trigger if exists set_journal_videos_updated_at on public.journal_videos;
create trigger set_journal_videos_updated_at
before update on public.journal_videos
for each row execute function public.set_updated_at();

alter table public.journal_videos enable row level security;

drop policy if exists "Journal videos are publicly readable" on public.journal_videos;
create policy "Journal videos are publicly readable"
on public.journal_videos for select to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert journal videos" on public.journal_videos;
create policy "Authenticated admins can insert journal videos"
on public.journal_videos for insert to authenticated with check (true);

drop policy if exists "Authenticated admins can update journal videos" on public.journal_videos;
create policy "Authenticated admins can update journal videos"
on public.journal_videos for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated admins can delete journal videos" on public.journal_videos;
create policy "Authenticated admins can delete journal videos"
on public.journal_videos for delete to authenticated using (true);

-- Reload PostgREST API schema cache
notify pgrst, 'reload schema';
