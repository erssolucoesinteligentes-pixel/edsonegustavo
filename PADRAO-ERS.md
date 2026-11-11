# Padrão ERS • Identificação de bancos

Decisão de Edson: todo aplicativo novo deve ter prefixo exclusivo no início dos nomes das tabelas. O prefixo identifica o aplicativo, agrupa seus objetos e facilita inventário, backup e futura migração.

Para ERS Finanças, o prefixo no Supabase é `fin_`: fin_accounts, fin_categories, fin_credit_cards, fin_recurrences, fin_transactions, fin_budgets, fin_goals e fin_goal_entries. Índices, função e gatilhos deste aplicativo também usam fin_. Outros aplicativos terão seu próprio prefixo definido antes de criar o banco. Não aplicar fin_ indiscriminadamente aos outros sistemas ERS.

As tabelas internas do SQLite permanecem com os nomes originais para preservar compatibilidade com dados locais e backups existentes; o adaptador remoto faz o mapeamento para fin_. O SQLite é um banco isolado por instalação. auth.users é uma tabela da infraestrutura Supabase Auth e não é renomeada.

Prefixo não substitui dependências: uma migração deve incluir tabelas, dados, índices, políticas RLS, funções, gatilhos e a estratégia de autenticação. O pacote mantém SQL e gerador da estrutura sincronizados com o código.
