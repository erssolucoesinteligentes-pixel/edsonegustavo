> Revisão fin_: se você já aplicou o SQL anterior ers_fin_*, faça backup e execute primeiro supabase/migrar-prefixo.sql. Em instalação nova, execute somente supabase/schema.sql. Nunca execute os dois schemas antigos e novos lado a lado para o mesmo aplicativo.

# Configuração Supabase • ERS Finanças

## 1. Preparar o banco

Use um projeto de testes primeiro. Abra SQL Editor → New query, cole todo o conteúdo de supabase/schema.sql (ou ERS-Financas-Supabase.sql, são idênticos) e clique em Run. O script pode ser executado novamente. Não apaga nem migra tabelas antigas. Não use o SQL genérico da documentação original.

As tabelas criadas são:

| Tabela | Uso |
| --- | --- |
| fin_accounts | Contas e saldo inicial |
| fin_categories | Categorias e subcategorias |
| fin_credit_cards | Cartões, limites e ciclo de fatura |
| fin_recurrences | Regras de lançamentos recorrentes |
| fin_transactions | Receitas, despesas, transferências, parcelas e pagamentos |
| fin_budgets | Limites por categoria |
| fin_goals | Metas |
| fin_goal_entries | Aportes e retiradas das metas |

Cada linha pertence a auth.users por user_id. A chave primária é (user_id,id). RLS permite ao usuário autenticado ler, criar e alterar somente suas próprias linhas. anon não lê nem grava. O app faz exclusão lógica por deleted_at; exclusão física não é liberada a authenticated.

O prefixo fin_ evita colisão com outros sistemas. Não há dados de exemplo financeiros inseridos na nuvem; categorias e conta padrão são criadas no aparelho e enviadas no primeiro login.

### Tipos importantes

Dinheiro é bigint em CENTAVOS: 12345 = R$ 123,45, nunca decimal de moeda. Os campos de data do negócio são texto ISO AAAA-MM-DD e os carimbos locais são texto ISO UTC com milissegundos (ex.: 2026-11-11T12:00:00.000Z), preservando compatibilidade com SQLite e o motor existente. server_updated_at é timestamptz calculado pelo servidor. Não converta as colunas de texto para date/timestamptz isoladamente: isso altera a representação usada pelo comparador do sincronizador. Campos booleanos locais são 0/1.

O banco da nuvem é uma réplica de sincronização. Relações de negócio são validadas no aplicativo/SQLite; o SQL não adiciona FKs entre todas as tabelas financeiras para permitir receber pais e filhos em rodadas diferentes. Não edite linhas manualmente sem considerar esse contrato. O trigger recusa gravações sem uma identidade auth.uid válida.

## 2. Authentication

O projeto original já usa Supabase Auth para a sincronização e isso foi preservado. Este pacote não usa funUser, as credenciais do Plenitude ou um login próprio da ERS.

Em Authentication, habilite o provedor Email e os cadastros se quiser autocadastro. Mantenha confirmação de e-mail ativa. Nos modelos de e-mail de confirmação e recuperação, inclua o token {{ .Token }} para que o usuário possa digitá-lo nas telas do app. Há modelos em supabase/email-confirmacao.html e supabase/email-recuperacao.html. Não remova configurações de outros aplicativos que compartilhem o mesmo projeto; alterar templates e políticas de Auth afeta todo o projeto.

Configure Site URL com seu endereço HTTPS de publicação e os redirecionamentos que você efetivamente usar. O fluxo principal deste aplicativo é senha + código de e-mail, não callback OAuth. Configure SMTP de produção e teste os limites de envio do seu projeto antes da distribuição. O código valida senha com pelo menos oito caracteres; recomenda-se ajustar a política de senha no painel também.

## 3. Variáveis de ambiente

Crie .env na raiz (não dentro de src ou dist):

```env
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=COLE_A_CHAVE_PUBLICA_PUBLISHABLE_OU_ANON
```

A URL e a chave pública ficam no painel de conexão/API do projeto. Este app usa HTTPS/REST, portanto não precisa de DATABASE_URL, senha de Postgres nem chave service_role. Não use as credenciais temporárias de outros projetos sem verificar o destino.

Execute npm ci e npm run build:web após preencher o arquivo. Em hospedagem, as mesmas variáveis devem existir no ambiente de BUILD. Só reiniciar o servidor não altera a configuração embutida.

## 4. Conferir segurança e funcionamento

1. Cadastre o usuário A, confirme o e-mail, entre e crie uma receita de R$ 100,00 e uma despesa de R$ 20,00. Confira o saldo conforme a conta selecionada.
2. Entre como A em outro navegador/aparelho. Sincronize e confira valores, categorias e status.
3. Edite uma descrição, depois exclua o lançamento. Sincronize nos dois lados e confira a convergência.
4. Cadastre o usuário B em outro perfil de navegador. Ele deve começar sem os lançamentos de A.
5. Não crie políticas USING(true). Mantenha RLS em todas as oito tabelas. Não compartilhe uma conta de login entre pessoas que precisem de isolamento.
6. Desligue a conexão, crie um lançamento local, reabra o aplicativo após o cache estar pronto e confirme sua permanência. Religue a rede e sincronize.
7. Exporte um backup, faça uma alteração e restaure o arquivo em ambiente de teste. Confirme que a restauração é enviada aos outros aparelhos. Não faça esse teste pela primeira vez sobre seu único conjunto de dados reais.
8. Teste recuperação de senha, saída com pendências e reentrada.
9. Valide em Windows/Chrome e nos modelos de Android/iPhone usados pelos seus clientes.

## 5. Observações de operação

Sair da conta apaga o banco local depois da confirmação; pendências não enviadas podem ser perdidas se você confirmar mesmo assim. A nuvem precisa receber os dados antes, ou guarde um backup. A RLS protege o acesso pela API, mas não criptografa o arquivo local ou o backup JSON. O app pode ser usado localmente sem login. Esta versão não é uma plataforma multiempresa com usuários/permissões compartilhados; o isolamento é pessoal por auth.users.id.

Se você já usou o projeto original com tabelas accounts/categories/etc., essas tabelas não são migradas automaticamente. Preserve o original, sincronize e exporte um backup; teste a importação na nova versão antes de desativar o anterior. Mudar o identificador nativo/domínio cria um novo armazenamento local.

Referências oficiais verificadas durante a auditoria:
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://docs.expo.dev/versions/v58.0.0/sdk/sqlite/
- https://docs.expo.dev/versions/v58.0.0/config/app/
- https://docs.expo.dev/guides/progressive-web-apps/
