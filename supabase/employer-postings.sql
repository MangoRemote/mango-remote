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
