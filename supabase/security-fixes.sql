-- MangoRemote security fixes. Run once in the Supabase SQL editor. Safe to re-run.
-- Runs as one transaction: either everything applies or nothing does.
begin;

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

commit;
