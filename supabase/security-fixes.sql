-- MangoRemote security fixes. Run once in the Supabase SQL editor. Safe to re-run.

-- 1. Premium job content: only readable through the public API by active premium members or admins.
drop policy if exists "Public read live jobs" on jobs;
drop policy if exists "Public read free live jobs" on jobs;
drop policy if exists "Premium members read premium jobs" on jobs;
create policy "Public read free live jobs" on jobs for select
  using (status = 'live' and is_premium = false);
create policy "Premium members read premium jobs" on jobs for select
  using (status = 'live' and is_premium = true and exists (
    select 1 from subscriptions s
    where s.user_id = auth.uid() and s.plan = 'premium' and s.status = 'active'
  ));

-- 2. Subscriptions: users can read their own row only. Only the server (service role, used by the Stripe webhook) can write.
drop policy if exists "Service role manages subscriptions" on subscriptions;
revoke insert, update, delete on subscriptions from anon, authenticated;

-- 3. Users: remove table-wide write rights, then grant back only the columns a user may change.
--    role is never granted, so it cannot be set by a user.
revoke insert, update, delete on users from anon, authenticated;
grant insert (id, email, name) on users to authenticated;
grant update (name) on users to authenticated;

-- 4. Saved jobs: each user sees and changes only their own rows.
alter table saved_jobs enable row level security;
drop policy if exists "Users manage own saved jobs" on saved_jobs;
create policy "Users manage own saved jobs" on saved_jobs for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke all on saved_jobs from anon;

-- 5. Jobs and companies: anonymous and signed-in users cannot write. Admin writes go through the admin policy.
revoke insert, update, delete on jobs from anon;
revoke insert, update, delete on companies from anon, authenticated;
