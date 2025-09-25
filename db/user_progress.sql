-- User progress (per user single row)
create table if not exists public.user_progress (
  user_id uuid not null references public.users(id) on delete cascade,
  current_level integer not null default 1,
  highest_unlocked_level integer not null default 1,
  coins integer not null default 0,
  updated_at timestamptz not null default now(),
  inserted_at timestamptz not null default now(),
  constraint user_progress_pkey primary key (user_id)
);

create index if not exists user_progress_user_idx on public.user_progress(user_id);

-- Trigger
do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_user_progress_touch') then
    create trigger trg_user_progress_touch before update on public.user_progress
      for each row execute function public.touch_updated_at();
  end if;
end $$;

-- RLS policies
alter table public.user_progress enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'progress_select_all') then
    create policy progress_select_all on public.user_progress for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'progress_upsert') then
    create policy progress_insert on public.user_progress for insert with check (true);
    create policy progress_update on public.user_progress for update using (true) with check (true);
  end if;
end $$;



