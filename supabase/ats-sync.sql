-- Adds the fields the ATS sync needs. Run once in the Supabase SQL editor. Safe to re-run.
alter table jobs add column if not exists external_source text;
alter table jobs add column if not exists external_id text;
alter table jobs add column if not exists last_seen_at timestamptz;
alter table jobs add column if not exists link_status text;

create unique index if not exists jobs_external_unique
  on jobs (external_source, external_id)
  where external_id is not null;
