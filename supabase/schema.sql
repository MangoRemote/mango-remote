-- MangoRemote Database Schema

-- Enable pg_cron extension (run as superuser in Supabase dashboard)
-- create extension if not exists pg_cron;

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

-- Companies
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  website text,
  industry text,
  description text,
  verified boolean not null default false
);

-- Jobs
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  company_id uuid not null references companies(id) on delete cascade,
  description text not null default '',
  salary_min integer,
  salary_max integer,
  salary_currency text default 'USD',
  apply_url text not null,
  category_id uuid not null references categories(id),
  employment_type text not null check (employment_type in ('full-time', 'contract', 'part-time')),
  tags text[] not null default '{}',
  region_tags text[] not null default '{}',
  is_premium boolean not null default false,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'pending', 'live', 'expired')),
  source text not null default 'manual' check (source in ('manual', 'employer')),
  asia_friendly boolean not null default false,
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- Users (extends Supabase auth.users)
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'jobseeker' check (role in ('jobseeker', 'employer', 'admin'))
);

-- Subscriptions
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due')),
  current_period_end timestamptz
);

-- Employer postings
create table if not exists employer_postings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  job_id uuid references jobs(id) on delete set null,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  stripe_payment_id text,
  created_at timestamptz not null default now()
);

-- RLS policies
alter table categories enable row level security;
alter table companies enable row level security;
alter table jobs enable row level security;
alter table users enable row level security;
alter table subscriptions enable row level security;
alter table employer_postings enable row level security;

-- Public read on categories, companies, live jobs
create policy "Public read categories" on categories for select using (true);
create policy "Public read companies" on companies for select using (true);
create policy "Public read live jobs" on jobs for select using (status = 'live');
create policy "Admin full access jobs" on jobs for all using (
  exists (select 1 from users where id = auth.uid() and role = 'admin')
);

-- Users can read/update their own record
create policy "Users read own" on users for select using (id = auth.uid());
create policy "Users update own" on users for update using (id = auth.uid());
create policy "Users insert own" on users for insert with check (id = auth.uid());

-- Subscriptions
create policy "Users read own subscription" on subscriptions for select using (user_id = auth.uid());
create policy "Service role manages subscriptions" on subscriptions for all using (true);

-- Employer postings
create policy "Users read own postings" on employer_postings for select using (user_id = auth.uid());
create policy "Users insert own postings" on employer_postings for insert with check (user_id = auth.uid());
create policy "Admin manage postings" on employer_postings for all using (
  exists (select 1 from users where id = auth.uid() and role = 'admin')
);

-- Function to auto-create user record on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, 'jobseeker')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- pg_cron job to expire old jobs (run after enabling pg_cron extension)
-- select cron.schedule('expire-jobs', '0 2 * * *', $$
--   update jobs set status = 'expired'
--   where status = 'live' and expires_at < now();
-- $$);
