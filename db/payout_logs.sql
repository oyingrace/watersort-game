-- Payout logs (future rewards, faucet caps)
create table if not exists public.payout_logs (
  user_id uuid not null references public.users(id) on delete cascade,
  day date not null,
  count integer not null default 0,
  total_amount numeric not null default 0,
  updated_at timestamptz not null default now(),
  inserted_at timestamptz not null default now(),
  constraint payout_logs_pkey primary key (user_id, day)
);

create index if not exists payout_logs_day_idx on public.payout_logs(day);

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_payout_logs_touch') then
    create trigger trg_payout_logs_touch before update on public.payout_logs
      for each row execute function public.touch_updated_at();
  end if;
end $$;

alter table public.payout_logs enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'payout_select') then
    create policy payout_select on public.payout_logs for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'payout_upsert') then
    create policy payout_insert on public.payout_logs for insert with check (true);
    create policy payout_update on public.payout_logs for update using (true) with check (true);
  end if;
end $$;



