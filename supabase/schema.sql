-- Finanças: tabelas da nuvem para a sincronização.
-- GERADO AUTOMATICAMENTE por src/features/sync/remoteSchema.ts (não edite à mão;
-- rode `npm run supabase:sql` depois de mudar as tabelas do app).
--
-- Como usar: Supabase > SQL Editor > New query > cole este arquivo inteiro > Run.
-- Pode rodar de novo a cada versão nova do app: só cria o que falta.

-- "A última edição vence": se a nuvem já tem uma versão mais nova do registro,
-- a gravação mais antiga é ignorada. Toda gravação aceita ganha um carimbo novo do servidor.
create or replace function public.fin_sync_row() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.user_id is distinct from auth.uid() then
    raise exception 'Registro pertence a outro usuário' using errcode = '42501';
  end if;
  if tg_op = 'UPDATE' then
    if new.updated_at < old.updated_at then
      return null;
    end if;
    new.user_id := old.user_id;
  end if;
  new.server_updated_at := clock_timestamp();
  return new;
end;
$$;

-- accounts
create table if not exists public.fin_accounts (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null,
  server_updated_at timestamptz not null default clock_timestamp(),
  primary key (user_id, id)
);
alter table public.fin_accounts add column if not exists "name" text not null;
alter table public.fin_accounts add column if not exists "type" text not null;
alter table public.fin_accounts add column if not exists "institution" text;
alter table public.fin_accounts add column if not exists "color" text not null;
alter table public.fin_accounts add column if not exists "icon" text not null;
alter table public.fin_accounts add column if not exists "initial_balance_cents" bigint default 0 not null;
alter table public.fin_accounts add column if not exists "include_in_total" bigint default 1 not null;
alter table public.fin_accounts add column if not exists "sort_order" bigint default 0 not null;
alter table public.fin_accounts add column if not exists "archived_at" text;
alter table public.fin_accounts add column if not exists "created_at" text not null;
alter table public.fin_accounts add column if not exists "updated_at" text not null;
alter table public.fin_accounts add column if not exists "deleted_at" text;
create index if not exists fin_accounts_pull_idx on public.fin_accounts (user_id, server_updated_at, id);
alter table public.fin_accounts enable row level security;
drop policy if exists "fin_accounts: ler as próprias" on public.fin_accounts;
create policy "fin_accounts: ler as próprias" on public.fin_accounts
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "fin_accounts: criar as próprias" on public.fin_accounts;
create policy "fin_accounts: criar as próprias" on public.fin_accounts
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "fin_accounts: alterar as próprias" on public.fin_accounts;
create policy "fin_accounts: alterar as próprias" on public.fin_accounts
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
revoke all on public.fin_accounts from public, anon;
grant select, insert, update on public.fin_accounts to authenticated;
drop trigger if exists fin_accounts_sync on public.fin_accounts;
create trigger fin_accounts_sync before insert or update on public.fin_accounts
  for each row execute function public.fin_sync_row();

-- categories
create table if not exists public.fin_categories (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null,
  server_updated_at timestamptz not null default clock_timestamp(),
  primary key (user_id, id)
);
alter table public.fin_categories add column if not exists "name" text not null;
alter table public.fin_categories add column if not exists "kind" text not null;
alter table public.fin_categories add column if not exists "icon" text not null;
alter table public.fin_categories add column if not exists "color" text not null;
alter table public.fin_categories add column if not exists "parent_id" text;
alter table public.fin_categories add column if not exists "sort_order" bigint default 0 not null;
alter table public.fin_categories add column if not exists "archived_at" text;
alter table public.fin_categories add column if not exists "created_at" text not null;
alter table public.fin_categories add column if not exists "updated_at" text not null;
alter table public.fin_categories add column if not exists "deleted_at" text;
alter table public.fin_categories add column if not exists "is_system" bigint default 0 not null;
create index if not exists fin_categories_pull_idx on public.fin_categories (user_id, server_updated_at, id);
alter table public.fin_categories enable row level security;
drop policy if exists "fin_categories: ler as próprias" on public.fin_categories;
create policy "fin_categories: ler as próprias" on public.fin_categories
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "fin_categories: criar as próprias" on public.fin_categories;
create policy "fin_categories: criar as próprias" on public.fin_categories
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "fin_categories: alterar as próprias" on public.fin_categories;
create policy "fin_categories: alterar as próprias" on public.fin_categories
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
revoke all on public.fin_categories from public, anon;
grant select, insert, update on public.fin_categories to authenticated;
drop trigger if exists fin_categories_sync on public.fin_categories;
create trigger fin_categories_sync before insert or update on public.fin_categories
  for each row execute function public.fin_sync_row();

-- credit_cards
create table if not exists public.fin_credit_cards (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null,
  server_updated_at timestamptz not null default clock_timestamp(),
  primary key (user_id, id)
);
alter table public.fin_credit_cards add column if not exists "name" text not null;
alter table public.fin_credit_cards add column if not exists "brand" text not null;
alter table public.fin_credit_cards add column if not exists "last_digits" text;
alter table public.fin_credit_cards add column if not exists "color" text not null;
alter table public.fin_credit_cards add column if not exists "limit_cents" bigint not null;
alter table public.fin_credit_cards add column if not exists "closing_day" bigint not null;
alter table public.fin_credit_cards add column if not exists "due_day" bigint not null;
alter table public.fin_credit_cards add column if not exists "payment_account_id" text;
alter table public.fin_credit_cards add column if not exists "sort_order" bigint default 0 not null;
alter table public.fin_credit_cards add column if not exists "archived_at" text;
alter table public.fin_credit_cards add column if not exists "created_at" text not null;
alter table public.fin_credit_cards add column if not exists "updated_at" text not null;
alter table public.fin_credit_cards add column if not exists "deleted_at" text;
create index if not exists fin_credit_cards_pull_idx on public.fin_credit_cards (user_id, server_updated_at, id);
alter table public.fin_credit_cards enable row level security;
drop policy if exists "fin_credit_cards: ler as próprias" on public.fin_credit_cards;
create policy "fin_credit_cards: ler as próprias" on public.fin_credit_cards
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "fin_credit_cards: criar as próprias" on public.fin_credit_cards;
create policy "fin_credit_cards: criar as próprias" on public.fin_credit_cards
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "fin_credit_cards: alterar as próprias" on public.fin_credit_cards;
create policy "fin_credit_cards: alterar as próprias" on public.fin_credit_cards
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
revoke all on public.fin_credit_cards from public, anon;
grant select, insert, update on public.fin_credit_cards to authenticated;
drop trigger if exists fin_credit_cards_sync on public.fin_credit_cards;
create trigger fin_credit_cards_sync before insert or update on public.fin_credit_cards
  for each row execute function public.fin_sync_row();

-- recurrences
create table if not exists public.fin_recurrences (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null,
  server_updated_at timestamptz not null default clock_timestamp(),
  primary key (user_id, id)
);
alter table public.fin_recurrences add column if not exists "kind" text not null;
alter table public.fin_recurrences add column if not exists "amount_cents" bigint not null;
alter table public.fin_recurrences add column if not exists "variable_amount" bigint default 0 not null;
alter table public.fin_recurrences add column if not exists "description" text not null;
alter table public.fin_recurrences add column if not exists "category_id" text;
alter table public.fin_recurrences add column if not exists "account_id" text;
alter table public.fin_recurrences add column if not exists "card_id" text;
alter table public.fin_recurrences add column if not exists "frequency" text not null;
alter table public.fin_recurrences add column if not exists "interval_n" bigint default 1 not null;
alter table public.fin_recurrences add column if not exists "start_on" text not null;
alter table public.fin_recurrences add column if not exists "end_on" text;
alter table public.fin_recurrences add column if not exists "max_count" bigint;
alter table public.fin_recurrences add column if not exists "auto_pay" bigint default 0 not null;
alter table public.fin_recurrences add column if not exists "notes" text;
alter table public.fin_recurrences add column if not exists "paused_at" text;
alter table public.fin_recurrences add column if not exists "generated_until" text;
alter table public.fin_recurrences add column if not exists "created_at" text not null;
alter table public.fin_recurrences add column if not exists "updated_at" text not null;
alter table public.fin_recurrences add column if not exists "deleted_at" text;
create index if not exists fin_recurrences_pull_idx on public.fin_recurrences (user_id, server_updated_at, id);
alter table public.fin_recurrences enable row level security;
drop policy if exists "fin_recurrences: ler as próprias" on public.fin_recurrences;
create policy "fin_recurrences: ler as próprias" on public.fin_recurrences
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "fin_recurrences: criar as próprias" on public.fin_recurrences;
create policy "fin_recurrences: criar as próprias" on public.fin_recurrences
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "fin_recurrences: alterar as próprias" on public.fin_recurrences;
create policy "fin_recurrences: alterar as próprias" on public.fin_recurrences
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
revoke all on public.fin_recurrences from public, anon;
grant select, insert, update on public.fin_recurrences to authenticated;
drop trigger if exists fin_recurrences_sync on public.fin_recurrences;
create trigger fin_recurrences_sync before insert or update on public.fin_recurrences
  for each row execute function public.fin_sync_row();

-- transactions
create table if not exists public.fin_transactions (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null,
  server_updated_at timestamptz not null default clock_timestamp(),
  primary key (user_id, id)
);
alter table public.fin_transactions add column if not exists "kind" text not null;
alter table public.fin_transactions add column if not exists "amount_cents" bigint not null;
alter table public.fin_transactions add column if not exists "description" text not null;
alter table public.fin_transactions add column if not exists "account_id" text;
alter table public.fin_transactions add column if not exists "to_account_id" text;
alter table public.fin_transactions add column if not exists "category_id" text;
alter table public.fin_transactions add column if not exists "occurred_on" text not null;
alter table public.fin_transactions add column if not exists "status" text default 'paid' not null;
alter table public.fin_transactions add column if not exists "notes" text;
alter table public.fin_transactions add column if not exists "origin" text default 'app' not null;
alter table public.fin_transactions add column if not exists "card_id" text;
alter table public.fin_transactions add column if not exists "invoice_month" text;
alter table public.fin_transactions add column if not exists "installment_group_id" text;
alter table public.fin_transactions add column if not exists "installment_number" bigint;
alter table public.fin_transactions add column if not exists "installment_count" bigint;
alter table public.fin_transactions add column if not exists "created_at" text not null;
alter table public.fin_transactions add column if not exists "updated_at" text not null;
alter table public.fin_transactions add column if not exists "deleted_at" text;
alter table public.fin_transactions add column if not exists "due_on" text;
alter table public.fin_transactions add column if not exists "recurrence_id" text;
create index if not exists fin_transactions_pull_idx on public.fin_transactions (user_id, server_updated_at, id);
alter table public.fin_transactions enable row level security;
drop policy if exists "fin_transactions: ler as próprias" on public.fin_transactions;
create policy "fin_transactions: ler as próprias" on public.fin_transactions
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "fin_transactions: criar as próprias" on public.fin_transactions;
create policy "fin_transactions: criar as próprias" on public.fin_transactions
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "fin_transactions: alterar as próprias" on public.fin_transactions;
create policy "fin_transactions: alterar as próprias" on public.fin_transactions
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
revoke all on public.fin_transactions from public, anon;
grant select, insert, update on public.fin_transactions to authenticated;
drop trigger if exists fin_transactions_sync on public.fin_transactions;
create trigger fin_transactions_sync before insert or update on public.fin_transactions
  for each row execute function public.fin_sync_row();

-- budgets
create table if not exists public.fin_budgets (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null,
  server_updated_at timestamptz not null default clock_timestamp(),
  primary key (user_id, id)
);
alter table public.fin_budgets add column if not exists "category_id" text not null;
alter table public.fin_budgets add column if not exists "amount_cents" bigint not null;
alter table public.fin_budgets add column if not exists "created_at" text not null;
alter table public.fin_budgets add column if not exists "updated_at" text not null;
alter table public.fin_budgets add column if not exists "deleted_at" text;
create index if not exists fin_budgets_pull_idx on public.fin_budgets (user_id, server_updated_at, id);
alter table public.fin_budgets enable row level security;
drop policy if exists "fin_budgets: ler as próprias" on public.fin_budgets;
create policy "fin_budgets: ler as próprias" on public.fin_budgets
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "fin_budgets: criar as próprias" on public.fin_budgets;
create policy "fin_budgets: criar as próprias" on public.fin_budgets
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "fin_budgets: alterar as próprias" on public.fin_budgets;
create policy "fin_budgets: alterar as próprias" on public.fin_budgets
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
revoke all on public.fin_budgets from public, anon;
grant select, insert, update on public.fin_budgets to authenticated;
drop trigger if exists fin_budgets_sync on public.fin_budgets;
create trigger fin_budgets_sync before insert or update on public.fin_budgets
  for each row execute function public.fin_sync_row();

-- goals
create table if not exists public.fin_goals (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null,
  server_updated_at timestamptz not null default clock_timestamp(),
  primary key (user_id, id)
);
alter table public.fin_goals add column if not exists "name" text not null;
alter table public.fin_goals add column if not exists "target_cents" bigint not null;
alter table public.fin_goals add column if not exists "target_date" text;
alter table public.fin_goals add column if not exists "color" text not null;
alter table public.fin_goals add column if not exists "icon" text not null;
alter table public.fin_goals add column if not exists "account_id" text;
alter table public.fin_goals add column if not exists "archived_at" text;
alter table public.fin_goals add column if not exists "created_at" text not null;
alter table public.fin_goals add column if not exists "updated_at" text not null;
alter table public.fin_goals add column if not exists "deleted_at" text;
create index if not exists fin_goals_pull_idx on public.fin_goals (user_id, server_updated_at, id);
alter table public.fin_goals enable row level security;
drop policy if exists "fin_goals: ler as próprias" on public.fin_goals;
create policy "fin_goals: ler as próprias" on public.fin_goals
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "fin_goals: criar as próprias" on public.fin_goals;
create policy "fin_goals: criar as próprias" on public.fin_goals
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "fin_goals: alterar as próprias" on public.fin_goals;
create policy "fin_goals: alterar as próprias" on public.fin_goals
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
revoke all on public.fin_goals from public, anon;
grant select, insert, update on public.fin_goals to authenticated;
drop trigger if exists fin_goals_sync on public.fin_goals;
create trigger fin_goals_sync before insert or update on public.fin_goals
  for each row execute function public.fin_sync_row();

-- goal_entries
create table if not exists public.fin_goal_entries (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null,
  server_updated_at timestamptz not null default clock_timestamp(),
  primary key (user_id, id)
);
alter table public.fin_goal_entries add column if not exists "goal_id" text not null;
alter table public.fin_goal_entries add column if not exists "amount_cents" bigint not null;
alter table public.fin_goal_entries add column if not exists "occurred_on" text not null;
alter table public.fin_goal_entries add column if not exists "note" text;
alter table public.fin_goal_entries add column if not exists "created_at" text not null;
alter table public.fin_goal_entries add column if not exists "updated_at" text not null;
alter table public.fin_goal_entries add column if not exists "deleted_at" text;
create index if not exists fin_goal_entries_pull_idx on public.fin_goal_entries (user_id, server_updated_at, id);
alter table public.fin_goal_entries enable row level security;
drop policy if exists "fin_goal_entries: ler as próprias" on public.fin_goal_entries;
create policy "fin_goal_entries: ler as próprias" on public.fin_goal_entries
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "fin_goal_entries: criar as próprias" on public.fin_goal_entries;
create policy "fin_goal_entries: criar as próprias" on public.fin_goal_entries
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "fin_goal_entries: alterar as próprias" on public.fin_goal_entries;
create policy "fin_goal_entries: alterar as próprias" on public.fin_goal_entries
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
revoke all on public.fin_goal_entries from public, anon;
grant select, insert, update on public.fin_goal_entries to authenticated;
drop trigger if exists fin_goal_entries_sync on public.fin_goal_entries;
create trigger fin_goal_entries_sync before insert or update on public.fin_goal_entries
  for each row execute function public.fin_sync_row();
