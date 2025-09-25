-- Farcaster Mini App notifications tokens
create table if not exists public.notification_tokens (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  fid integer not null,
  notification_token text not null,
  notification_url text not null,
  is_active boolean not null default true,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notification_tokens_pkey primary key (id),
  constraint notification_tokens_unique unique (user_id, fid)
);

create index if not exists notification_tokens_user_idx on public.notification_tokens(user_id);
create index if not exists notification_tokens_fid_idx on public.notification_tokens(fid);
create index if not exists notification_tokens_active_idx on public.notification_tokens(is_active);

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_notification_tokens_touch') then
    create trigger trg_notification_tokens_touch before update on public.notification_tokens
      for each row execute function public.touch_updated_at();
  end if;
end $$;

alter table public.notification_tokens enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'notifications_select') then
    create policy notifications_select on public.notification_tokens for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'notifications_upsert') then
    create policy notifications_insert on public.notification_tokens for insert with check (true);
    create policy notifications_update on public.notification_tokens for update using (true) with check (true);
  end if;
end $$;



