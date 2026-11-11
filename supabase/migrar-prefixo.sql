-- OPCIONAL: somente para quem já executou a versão anterior ers_fin_*.
-- Faça backup. Execute este arquivo antes de schema.sql da nova versão.
-- Renomeia tabelas existentes sem copiar nem apagar os registros.
-- Aborta integralmente se os dois nomes coexistirem; não tenta mesclar dados.
begin;
do $$
declare
  t text;
  tables text[] := array['accounts','categories','credit_cards','recurrences','transactions','budgets','goals','goal_entries'];
  old_name text;
  new_name text;
begin
  -- Confere todas as colisões antes de alterar qualquer objeto.
  foreach t in array tables loop
    if to_regclass('public.ers_fin_' || t) is not null and to_regclass('public.fin_' || t) is not null then
      raise exception 'Colisão: ers_fin_% e fin_% coexistem. Revise os dados antes da migração.', t, t;
    end if;
  end loop;
  foreach t in array tables loop
    old_name := 'ers_fin_' || t;
    new_name := 'fin_' || t;
    if to_regclass('public.' || old_name) is not null then
      execute format('alter table public.%I rename to %I', old_name, new_name);
    end if;
    if to_regclass('public.' || new_name) is not null then
      execute format('drop trigger if exists %I on public.%I', t || '_sync', new_name);
      execute format('drop trigger if exists %I on public.%I', 'fin_' || t || '_sync', new_name);
      execute format('drop policy if exists %I on public.%I', t || ': ler as próprias', new_name);
      execute format('drop policy if exists %I on public.%I', t || ': criar as próprias', new_name);
      execute format('drop policy if exists %I on public.%I', t || ': alterar as próprias', new_name);
      if to_regclass('public.' || old_name || '_pull_idx') is not null and to_regclass('public.' || new_name || '_pull_idx') is null then
        execute format('alter index public.%I rename to %I', old_name || '_pull_idx', new_name || '_pull_idx');
      end if;
    end if;
  end loop;
end $$;
-- Nenhum CASCADE: dependências externas inesperadas fazem a transação abortar.
drop function if exists public.ers_fin_sync_row();
commit;
-- Aplique schema.sql imediatamente depois: ele recria gatilhos/políticas fin_*.
