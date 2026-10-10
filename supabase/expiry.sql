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
