-- MangoRemote: run this whole file once in the Supabase SQL Editor.

-- Adds the fields the ATS sync needs. Run once in the Supabase SQL editor. Safe to re-run.
alter table jobs add column if not exists external_source text;
alter table jobs add column if not exists external_id text;
alter table jobs add column if not exists last_seen_at timestamptz;
alter table jobs add column if not exists link_status text;

create unique index if not exists jobs_external_unique
  on jobs (external_source, external_id)
  where external_id is not null;

alter table jobs add column if not exists link_checked_at timestamptz;
alter table jobs add column if not exists link_fail_count integer not null default 0;

-- Records each paid job listing. Run once in the Supabase SQL editor. Safe to re-run.
create table if not exists employer_postings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  job_id uuid references jobs(id) on delete set null,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  stripe_payment_id text,
  created_at timestamptz not null default now()
);

alter table employer_postings enable row level security;
drop policy if exists "Users read own postings" on employer_postings;
create policy "Users read own postings" on employer_postings for select
  using (user_id = auth.uid());
revoke insert, update, delete on employer_postings from anon, authenticated;


-- Make the admin account(s) admin before the security rules apply.
update public.users set role = 'admin' where email in ('bradmatthewsuk@mail.com', 'hello@mangoremote.com');

-- MangoRemote security fixes. Run once in the Supabase SQL editor. Safe to re-run.
-- Runs as one transaction: either everything applies or nothing does.

-- 1. Remove every existing row policy on the sensitive tables (including any created outside this project).
do $$
declare r record;
begin
  for r in select schemaname, tablename, policyname from pg_policies
           where schemaname = 'public' and tablename in ('jobs', 'users', 'subscriptions', 'saved_jobs', 'employer_postings')
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

alter table jobs enable row level security;
alter table users enable row level security;
alter table subscriptions enable row level security;
alter table saved_jobs enable row level security;

-- 2. Jobs: free live jobs are public; premium live jobs only for active premium members; admins manage everything.
create policy "Public read free live jobs" on jobs for select
  using (status = 'live' and is_premium = false);
create policy "Premium members read premium jobs" on jobs for select
  using (status = 'live' and is_premium = true and exists (
    select 1 from subscriptions s
    where s.user_id = auth.uid() and s.plan = 'premium' and s.status = 'active'
  ));
create policy "Admins manage jobs" on jobs for all
  using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'))
  with check (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'));

-- 3. Users: each user reads and updates only their own row. Role is never user-writable (see grants below).
create policy "Users read own record" on users for select
  using (id = auth.uid());
create policy "Users update own record" on users for update
  using (id = auth.uid()) with check (id = auth.uid());

-- 4. Subscriptions: users read their own row only. Only the server (service role, used by the Stripe webhook) writes.
create policy "Users read own subscription" on subscriptions for select
  using (user_id = auth.uid());

-- 5. Saved jobs: each user manages only their own rows.
create policy "Users manage own saved jobs" on saved_jobs for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 6. Employer postings (only if the table exists): users read their own; only the server writes.
do $$
begin
  if to_regclass('public.employer_postings') is not null then
    alter table employer_postings enable row level security;
    create policy "Users read own postings" on employer_postings for select
      using (user_id = auth.uid());
    revoke insert, update, delete on employer_postings from anon, authenticated;
  end if;
end $$;

-- 7. Grants: remove write rights a user should not have.
revoke insert, update, delete on subscriptions from anon, authenticated;
revoke insert, update, delete on users from anon, authenticated;
grant insert (id, email, name) on users to authenticated;
grant update (name) on users to authenticated;
revoke all on saved_jobs from anon;
revoke insert, update, delete on jobs from anon;
revoke insert, update, delete on companies from anon, authenticated;


-- Scheduled cleanup of jobs 35 days old. Run the expiry section last.
-- Removes jobs 35 days after publishing, every night at 03:00 UTC, inside the database.
-- Run once in the Supabase SQL editor (after enabling the pg_cron extension in Database → Extensions if the first line errors).

create extension if not exists pg_cron;

do $$ begin
  perform cron.unschedule('expire-jobs');
exception when others then null;
end $$;

select cron.schedule(
  'expire-jobs',
  '0 3 * * *',
  $$
    delete from public.saved_jobs where job_id in (
      select id from public.jobs where published_at < now() - interval '35 days'
    );
    delete from public.jobs where published_at < now() - interval '35 days';
  $$
);

-- Check it is scheduled and see the last runs:
-- select jobname, schedule, active from cron.job where jobname = 'expire-jobs';
-- select status, return_message, start_time from cron.job_run_details order by start_time desc limit 5;
