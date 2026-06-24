create extension if not exists "pgcrypto";

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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_works_updated_at on public.works;
create trigger set_works_updated_at
before update on public.works
for each row
execute function public.set_updated_at();

alter table public.works enable row level security;

drop policy if exists "Published works are publicly readable" on public.works;
create policy "Published works are publicly readable"
on public.works
for select
to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert works" on public.works;
create policy "Authenticated admins can insert works"
on public.works
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update works" on public.works;
create policy "Authenticated admins can update works"
on public.works
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can delete works" on public.works;
create policy "Authenticated admins can delete works"
on public.works
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('works-media', 'works-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Works media is publicly readable" on storage.objects;
create policy "Works media is publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'works-media');

drop policy if exists "Authenticated admins can upload works media" on storage.objects;
create policy "Authenticated admins can upload works media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'works-media');

drop policy if exists "Authenticated admins can update works media" on storage.objects;
create policy "Authenticated admins can update works media"
on storage.objects
for update
to authenticated
using (bucket_id = 'works-media')
with check (bucket_id = 'works-media');

drop policy if exists "Authenticated admins can delete works media" on storage.objects;
create policy "Authenticated admins can delete works media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'works-media');
