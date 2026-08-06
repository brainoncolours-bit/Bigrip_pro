alter table public.services_videos
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists metrics jsonb default '[]'::jsonb,
  add column if not exists button_label text;

update public.services_videos set
  title = 'VISION DEFINES EVERYTHING',
  description = 'Creative excellence begins with a clear vision. Every decision we make is guided by purpose, originality, and craftsmanship.',
  metrics = '["ANAMORPHIC PIPELINES", "SPATIAL BLOCKING", "16MM / 35MM EMBEDDED ENGINE"]'::jsonb
where section_key = 'service_1' and title is null;

update public.services_videos set
  title = 'PRECISION IN EVERY DETAIL',
  description = 'Lighting, movement, composition, and sound work together to create immersive cinematic experiences that elevate every story.',
  metrics = '["LUT SPECULATION", "HIGH-GLOW CONTRAST ISOLATION", "REDUCED NOISE COMPRESSION"]'::jsonb
where section_key = 'service_2' and title is null;

update public.services_videos set
  title = 'BUILT FOR TIMELESS IMPACT',
  description = 'We don''t create content for the moment. We create visual experiences designed to inspire, engage, and endure.',
  metrics = '["DRAPE/VELOCITY SYNC", "TEXTURE RETENTION ENGINE", "ASYMMETRIC FRAMING"]'::jsonb
where section_key = 'service_3' and title is null;

update public.services_videos set
  title = 'COLLABORATION DRIVES CREATIVITY',
  description = 'Great storytelling is never a solo effort. We partner closely with our clients, combining ideas, expertise, and creativity to transform ambitious visions into unforgettable cinematic experiences.',
  metrics = '["SUB-FREQUENCY CALIBRATION", "RHYTHMIC INTERVAL SYNCHRONIZATION", "ATMOSPHERIC GAIN DESIGN"]'::jsonb
where section_key = 'service_4' and title is null;

update public.services_videos set
  title = 'READY TO CALIBRATE YOUR SEQUENCES?',
  description = 'Every remarkable film begins with a conversation. Whether you''re launching a brand, producing a campaign, or telling a story that matters, we''re here to craft visuals with purpose, precision, and lasting impact.',
  button_label = 'ENGAGE PRODUCTION ROUTER'
where section_key = 'services_cta' and title is null;
