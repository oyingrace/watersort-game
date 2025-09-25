-- Users table
create table if not exists public.users (
  id uuid not null default gen_random_uuid(),
  address text unique,
  fid integer unique,
  username text,
  pfp_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_pkey primary key (id)
);

-- Trigger to keep updated_at fresh
do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_users_touch') then
    create trigger trg_users_touch before update on public.users
      for each row execute function public.touch_updated_at();
  end if;
end $$;

-- RLS
alter table public.users enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'users_select_all') then
    create policy users_select_all on public.users for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'users_upsert_open') then
    create policy users_insert on public.users for insert with check (true);
    create policy users_update on public.users for update using (true) with check (true);
  end if;
end $$;



