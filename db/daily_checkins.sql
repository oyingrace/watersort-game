-- Daily check-ins and streak tracking
create table if not exists public.daily_checkins (
  user_id uuid not null references public.users(id) on delete cascade,
  day date not null,
  completed boolean not null default false,
  game_result text, -- 'win' | 'loss' | 'draw'
  xp integer not null default 0,
  bonus_claimed boolean not null default false,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_checkins_pkey primary key (user_id, day)
);

create index if not exists daily_checkins_user_idx on public.daily_checkins(user_id, day desc);
create index if not exists daily_checkins_completed_idx on public.daily_checkins(day, completed);

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_daily_checkins_touch') then
    create trigger trg_daily_checkins_touch before update on public.daily_checkins
      for each row execute function public.touch_updated_at();
  end if;
end $$;

alter table public.daily_checkins enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'checkins_select') then
    create policy checkins_select on public.daily_checkins for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'checkins_upsert') then
    create policy checkins_insert on public.daily_checkins for insert with check (true);
    create policy checkins_update on public.daily_checkins for update using (true) with check (true);
  end if;
end $$;



