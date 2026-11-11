# Auditoria técnica • ERS Finanças 3.0.2

Data: 11/11/2026. Entrada: personal-finance-main.zip, projeto Expo SDK 58/React Native, TypeScript, SQLite/Drizzle e Supabase. Foi mantida a arquitetura e o conjunto de módulos. Esta é uma adaptação do código fornecido, não uma reescrita em Node/Express.

## Achados e tratamento

| Prioridade | Achado no projeto recebido | Tratamento |
| --- | --- | --- |
| Alta | Configuração Expo/EAS e atualizações OTA apontavam para o projeto do autor original | Removidos owner, projectId e updates.url originais; novos IDs br.dev.ers.financas; é necessário vincular um EAS da ERS antes de distribuir nativamente |
| Alta | Restaurar um backup antigo reaplicava timestamps antigos e podia perder para edições mais recentes da nuvem | Restauração vinculada passa a ser uma nova edição; teste com backup, edição posterior, restauração e segundo aparelho |
| Alta | Datas de edição iguais em dois aparelhos eram ignoradas no recebimento, mesmo com conteúdo divergente | Comparação do conteúdo no empate; aceita a versão do servidor quando não há alteração local pendente; teste específico de mesmo milissegundo |
| Alta | O motor permitia vincular diretamente o mesmo banco a outro usuário se chamado fora da camada de serviço | Guarda no motor contra reassociação sem limpeza explícita e teste de não vazamento |
| Alta | Falha ao remover a sessão era ignorada antes de apagar o banco local | Saída agora verifica o erro de Auth antes de limpar o SQLite |
| Média | npm ci recusava o lockfile recebido por dependências opcionais ausentes | Lockfile regenerado e instalação limpa validada em dry-run; patch expo-sqlite aplicado com sucesso |
| Média | Tabelas da nuvem tinham nomes genéricos que poderiam colidir com outros projetos ERS | Prefixo fin_ no SQL, cliente remoto, índices e testes; sem renomear o SQLite existente |
| Média | Service worker apenas acrescentava isolamento, sem cache de arquivos para primeira carga offline | Cache versionado de todo o build, incluindo fontes, telas, worker e WASM; manifest, ícones, aviso de atualização e testes automatizados |
| Média | Descrições exportadas podiam iniciar fórmulas de planilha | Neutralização de prefixos de fórmula no CSV, preservando valores negativos; teste de regressão |
| Média | Conversão de dinheiro não recusava inteiros além da precisão do JavaScript | Number.isSafeInteger e teste com valor fora do limite |
| Média | Seletor web de backup não resolvia cancelamento nem tratava falha de leitura | Tratamento de cancelamento/erro e limite de 20 MB antes da leitura |
| Baixa | Identidade visual não seguia ERS; cabeçalho rolava junto; sem ajuda geral | Paleta ERS claro/escuro, marca e ícones próprios, área de conteúdo adaptável, cabeçalho/rodapé fixos e ajuda modal |
| Baixa | Versões de backup fracionárias/negativas podiam passar pela validação inicial | Verificação de versões inteiras e formato de tabelas antes da restauração |

## Verificações executadas

- Suite original: 126 testes passaram antes das alterações.
- Suite após correções: 132 testes passaram em 17 arquivos. Inclui receitas/despesas/transferências, cartões e ciclo de faturas, recorrências, metas, relatórios, migrations, backups, sincronização entre aparelhos, paginação, RLS e regressões acima.
- O SQL de supabase/schema.sql foi executado em PostgreSQL em memória (PGlite), com auth.users/auth.uid e papéis simulados. Verificados reexecução, isolamento entre dois usuários, bloqueio de anon e ausência de exclusão física por authenticated.
- TypeScript: sem erros. Lint: sem erros ou avisos no resultado final.
- Exportação web de produção concluída. Cache inclui 73 arquivos nesta compilação.
- Dois testes adicionais web passaram: cache/shell/telas/fontes/WASM e resposta de navegação offline simulada sem interceptar Supabase; servidor SPA com cabeçalhos COOP/COEP e bloqueio de travessia de diretório e métodos de escrita.
- Servidor e recursos entregues localmente nos testes; service worker verificado sintaticamente.

## Limites da auditoria

Não foi acessado ou modificado um projeto Supabase real. Cadastro, envio de e-mail, credenciais e sincronização pela API REST precisam ser homologados no destino. O teste de RLS usa PostgreSQL real em memória com um esboço de Auth, não a infraestrutura completa do Supabase.

Não foi possível iniciar o navegador gráfico neste ambiente: o Chromium foi bloqueado ao criar o socket interno. Portanto os testes web não substituem inspeção visual e instalação PWA em aparelhos reais. APK/IPA, biometria e notificações não foram compilados/testados em hardware.

O SQLite web depende do navegador, WASM, SharedArrayBuffer, armazenamento persistente e cabeçalhos de isolamento. O projeto original usa essa tecnologia; ela foi preservada. Não há garantia universal para todo navegador/iPhone antigo.

A política de conflito continua baseada no relógio local, com a última edição vencendo; no empate de milissegundo os aparelhos convergem ao conteúdo aceito pelo servidor. A janela de sobreposição de download de dois minutos do projeto original foi mantida: gravações externas ou transações extremamente longas precisam de atenção operacional. Não há ledger contábil imutável nem histórico de revisões.

O banco e backups locais não têm criptografia do aplicativo; o token nativo continua no armazenamento SQLite usado pelo original. A biometria é uma barreira visual local, não criptografia do banco. Na web, o app local abre sem login; autenticação só é exigida para sincronizar. A RLS não protege alguém que tenha acesso ao aparelho desbloqueado e aos seus arquivos.

O isolamento é por usuário, não por empresa compartilhada. A integridade relacional remota depende do contrato de sincronização e validações do aplicativo; não foram adicionadas FKs financeiras remotas que impediriam receber mudanças fora de ordem. O SQL não recupera/migra dados existentes do esquema genérico original.

O npm audit retornou cinco entradas moderadas na cadeia Expo/CLI/fingerprint/glob/minimatch, relacionadas a dois avisos transitivos de processamento de arquivos. Não houve entrada alta ou crítica nesse retorno. Permanecem abertas nesta entrega; o downgrade automático sugerido para Expo 52 quebraria a base SDK 58. Consulte npm-audit-producao.json e VERIFICACOES.txt para planejar a atualização compatível das ferramentas. Não é correto interpretar testes passados como garantia de ausência de falhas ou vulnerabilidades.

## Próximo passo obrigatório para produção

Aplicar o SQL em homologação, configurar .env e Auth, recompilar e executar o roteiro de dois usuários/dois aparelhos de CONFIGURAR-SUPABASE.md. Só depois publicar para clientes. A compilação inclusa pode ser aberta e usada localmente sem essas etapas.

## Revisão 3.0.2 • Prefixo definido por Edson

Código remoto, gerador SQL, RLS, índices, função e gatilhos atualizados para fin_. Reexecutados os 132 testes da aplicação e dois testes web, com aprovação, e um teste adicional de migração do prefixo com preservação de registros. Incluído supabase/migrar-prefixo.sql para instalações que já possuem ers_fin_*. A configuração de armazenamento SQLite local foi mantida para preservar compatibilidade.
