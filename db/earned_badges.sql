-- Badges unlocked per user
create table if not exists public.earned_badges (
  user_id uuid not null references public.users(id) on delete cascade,
  badge text not null,
  earned_at timestamptz not null default now(),
  constraint earned_badges_pkey primary key (user_id, badge)
);

create index if not exists earned_badges_user_idx on public.earned_badges(user_id);

alter table public.earned_badges enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'badges_select_all') then
    create policy badges_select_all on public.earned_badges for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'badges_upsert') then
    create policy badges_insert on public.earned_badges for insert with check (true);
    create policy badges_update on public.earned_badges for update using (true) with check (true);
  end if;
end $$;



