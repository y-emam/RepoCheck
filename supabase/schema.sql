-- RepoCheck schema. Run this in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.repos (
  id               uuid primary key default gen_random_uuid(),
  owner            text not null,
  name             text not null,
  full_name        text not null unique,
  description      text,
  language         text,
  stars            integer,
  last_analyzed_at timestamptz,
  created_at       timestamptz not null default now()
);

create table if not exists public.reports (
  id                   uuid primary key default gen_random_uuid(),
  repo_id              uuid not null references public.repos (id) on delete cascade,
  health_grade         text,
  health_score         integer,
  score_note           text,
  subscores            jsonb,
  activity_assessment  text,
  top_concerns         jsonb,
  suggested_priorities jsonb,
  raw_data             jsonb,
  ai_summary           text,
  generated_at         timestamptz not null default now()
);

-- AI scoring columns, added after the initial Day 2 schema. The if-not-exists
-- guards let this file double as an idempotent migration for existing tables.
alter table public.reports add column if not exists health_score integer;
alter table public.reports add column if not exists score_note  text;
alter table public.reports add column if not exists subscores   jsonb;

create index if not exists reports_repo_id_generated_at_idx
  on public.reports (repo_id, generated_at desc);

-- The app talks to Supabase only through the secret/service-role key on the
-- server, which bypasses RLS. Enable RLS so the anon key has no access.
alter table public.repos enable row level security;
alter table public.reports enable row level security;
