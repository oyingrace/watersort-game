-- Each play attempt for analytics/history
create table if not exists public.level_runs (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  level_number integer not null,
  seed integer,
  moves integer not null default 0,
  hints_used integer not null default 0,
  result text check (result in ('win','quit','in_progress')),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint level_runs_pkey primary key (id)
);

create index if not exists level_runs_user_idx on public.level_runs(user_id, created_at desc);
create index if not exists level_runs_level_idx on public.level_runs(level_number);

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_level_runs_touch') then
    create trigger trg_level_runs_touch before update on public.level_runs
      for each row execute function public.touch_updated_at();
  end if;
end $$;

alter table public.level_runs enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'level_runs_select_all') then
    create policy level_runs_select_all on public.level_runs for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'level_runs_upsert') then
    create policy level_runs_insert on public.level_runs for insert with check (true);
    create policy level_runs_update on public.level_runs for update using (true) with check (true);
  end if;
end $$;



