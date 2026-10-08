-- Premium job content: only readable by active premium members (or admins via the existing admin policy)
drop policy if exists "Public read live jobs" on jobs;
create policy "Public read free live jobs" on jobs for select
  using (status = 'live' and is_premium = false);
create policy "Premium members read premium jobs" on jobs for select
  using (status = 'live' and is_premium = true and exists (
    select 1 from subscriptions s
    where s.user_id = auth.uid() and s.plan = 'premium' and s.status = 'active'
  ));

-- Users must not be able to grant themselves a subscription
drop policy if exists "Service role manages subscriptions" on subscriptions;

-- Users must not be able to make themselves admin
revoke update (role) on users from authenticated, anon;
revoke insert (role) on users from authenticated, anon;
