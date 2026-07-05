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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_home_videos_updated_at on public.home_videos;
create trigger set_home_videos_updated_at
before update on public.home_videos
for each row
execute function public.set_updated_at();

alter table public.home_videos enable row level security;

drop policy if exists "Home videos are publicly readable" on public.home_videos;
create policy "Home videos are publicly readable"
on public.home_videos
for select
to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert home videos" on public.home_videos;
create policy "Authenticated admins can insert home videos"
on public.home_videos
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update home videos" on public.home_videos;
create policy "Authenticated admins can update home videos"
on public.home_videos
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can delete home videos" on public.home_videos;
create policy "Authenticated admins can delete home videos"
on public.home_videos
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('home-videos-media', 'home-videos-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Home videos media is publicly readable" on storage.objects;
create policy "Home videos media is publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'home-videos-media');

drop policy if exists "Authenticated admins can upload home videos media" on storage.objects;
create policy "Authenticated admins can upload home videos media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'home-videos-media');

drop policy if exists "Authenticated admins can update home videos media" on storage.objects;
create policy "Authenticated admins can update home videos media"
on storage.objects
for update
to authenticated
using (bucket_id = 'home-videos-media')
with check (bucket_id = 'home-videos-media');

drop policy if exists "Authenticated admins can delete home videos media" on storage.objects;
create policy "Authenticated admins can delete home videos media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'home-videos-media');

insert into public.home_videos (section_key, section_label, sort_order) values
  ('hero', 'Hero Background', 1),
  ('aperture', 'Expanding Aperture Frame', 2),
  ('chromatic_matte_1', 'Chromatic Matte (Slow Layer)', 3),
  ('chromatic_matte_2', 'Chromatic Matte (Fast Layer)', 4),
  ('line_video_reveal', 'Horizontal Line Reveal', 5),
  ('vivid_matrix_1', 'Matrix Grid — Column 1', 6),
  ('vivid_matrix_2', 'Matrix Grid — Column 2', 7),
  ('vivid_matrix_3', 'Matrix Grid — Column 3', 8),
  ('video_intercept', 'Full-bleed Parallax Intercept', 9),
  ('vivid_focus', 'Cinematic Focal Wall', 10),
  ('asymmetric_block', 'Asymmetric Grid Overlay', 11),
  ('angle_strip_1', 'Multi-angle Strip — CAM 01', 12),
  ('angle_strip_2', 'Multi-angle Strip — CAM 02', 13),
  ('angle_strip_3', 'Multi-angle Strip — CAM 03', 14),
  ('angle_strip_4', 'Multi-angle Strip — CAM 04', 15),
  ('inverted_aperture', 'Inverted Aperture', 16)
on conflict (section_key) do nothing;
