-- Synchronize Active Home Videos to match current Home.jsx layout
-- Active sections: hero, hero_secondary, chromatic_matte_1, chromatic_matte_2, video_intercept, asymmetric_block

-- 1. Ensure hero_secondary exists
insert into public.home_videos (section_key, section_label, sort_order, published)
values ('hero_secondary', 'Hero Secondary Banner (Section 3)', 2, true)
on conflict (section_key) do update set
  section_label = 'Hero Secondary Banner (Section 3)',
  sort_order = 2;

-- 2. Update labels and order for active sections
update public.home_videos set section_label = 'Hero Background (Section 1)', sort_order = 1 where section_key = 'hero';
update public.home_videos set section_label = 'Chromatic Matte — Left (Section 4)', sort_order = 3 where section_key = 'chromatic_matte_1';
update public.home_videos set section_label = 'Chromatic Matte — Right (Section 4)', sort_order = 4 where section_key = 'chromatic_matte_2';
update public.home_videos set section_label = 'Full-bleed Parallax Intercept (Section 8)', sort_order = 5 where section_key = 'video_intercept';
update public.home_videos set section_label = 'Asymmetric Grid Overlay (Section 10)', sort_order = 6 where section_key = 'asymmetric_block';

-- 3. Remove obsolete phantom sections that are no longer used on the Home page
delete from public.home_videos
where section_key not in (
  'hero',
  'hero_secondary',
  'chromatic_matte_1',
  'chromatic_matte_2',
  'video_intercept',
  'asymmetric_block'
);
