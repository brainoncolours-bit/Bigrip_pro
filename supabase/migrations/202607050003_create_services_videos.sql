create table if not exists public.services_videos (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  section_label text not null,
  media_url text,
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
for each row
execute function public.set_updated_at();

alter table public.services_videos enable row level security;

drop policy if exists "Services videos are publicly readable" on public.services_videos;
create policy "Services videos are publicly readable"
on public.services_videos
for select
to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert services videos" on public.services_videos;
create policy "Authenticated admins can insert services videos"
on public.services_videos
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update services videos" on public.services_videos;
create policy "Authenticated admins can update services videos"
on public.services_videos
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can delete services videos" on public.services_videos;
create policy "Authenticated admins can delete services videos"
on public.services_videos
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('services-videos-media', 'services-videos-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Services videos media is publicly readable" on storage.objects;
create policy "Services videos media is publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'services-videos-media');

drop policy if exists "Authenticated admins can upload services videos media" on storage.objects;
create policy "Authenticated admins can upload services videos media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'services-videos-media');

drop policy if exists "Authenticated admins can update services videos media" on storage.objects;
create policy "Authenticated admins can update services videos media"
on storage.objects
for update
to authenticated
using (bucket_id = 'services-videos-media')
with check (bucket_id = 'services-videos-media');

drop policy if exists "Authenticated admins can delete services videos media" on storage.objects;
create policy "Authenticated admins can delete services videos media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'services-videos-media');

insert into public.services_videos (section_key, section_label, sort_order) values
  ('service_1', 'Cinematic Direction & Architecture', 1),
  ('service_2', 'Chromatic Grade & Spectral Depth', 2),
  ('service_3', 'Editorial Fashion & Silhouette Capture', 3),
  ('service_4', 'Sonic Landscapes & Audio Texturing', 4),
  ('services_cta', 'Services CTA Background Reel', 5)
on conflict (section_key) do nothing;
