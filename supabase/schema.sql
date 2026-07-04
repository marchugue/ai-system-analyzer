-- ---------------------------------------------------------------------------
-- AI System Analyzer — Supabase schema
-- Run this in the Supabase SQL Editor (or via the CLI: supabase db push).
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto"; -- provides gen_random_uuid()

create table if not exists public.client_analyses (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),
  client_name             text not null,
  company_name            text not null,
  industry                text not null default '',
  employee_count          text not null default '',
  questionnaire_data      jsonb not null default '{}'::jsonb,
  ai_summary              text not null default '',
  recommended_system      text not null default '',
  recommended_features    jsonb not null default '[]'::jsonb,
  full_ai_response        text not null default '',
  pdf_generated           boolean not null default false
);

create index if not exists client_analyses_created_at_idx on public.client_analyses (created_at desc);
create index if not exists client_analyses_industry_idx on public.client_analyses (industry);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- This app has no login: any visitor can submit the questionnaire and the
-- browser writes straight to this table using the public anon key. That
-- means RLS has to do double duty:
--   1. Let anyone INSERT a new row (the whole point of a public intake form).
--   2. Let NO ONE read, update, or delete existing rows using the anon key —
--      otherwise any visitor could browse every other client's submissions
--      simply by opening devtools and calling the Supabase client directly.
--
-- RLS denies by default once enabled, so simply not writing SELECT/UPDATE/
-- DELETE policies for `anon` is sufficient — but the explicit deny policies
-- below are kept as documentation of that intent for the next developer.
-- ---------------------------------------------------------------------------

alter table public.client_analyses enable row level security;

create policy "Public can insert analyses"
  on public.client_analyses
  for insert
  to anon
  with check (true);

create policy "Public cannot read analyses"
  on public.client_analyses
  for select
  to anon
  using (false);

create policy "Public cannot update analyses"
  on public.client_analyses
  for update
  to anon
  using (false);

create policy "Public cannot delete analyses"
  on public.client_analyses
  for delete
  to anon
  using (false);

-- ---------------------------------------------------------------------------
-- Future admin dashboard (see README.md → "Future Admin Dashboard")
-- ---------------------------------------------------------------------------
-- When you add Supabase Auth for staff, create a matching `authenticated`
-- policy that allows SELECT (and, if needed, UPDATE/DELETE) so signed-in
-- analysts can browse submissions while the public anon key stays
-- insert-only. Something like:
--
--   create policy "Staff can read analyses"
--     on public.client_analyses
--     for select
--     to authenticated
--     using (true);
