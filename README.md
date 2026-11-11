# ERS Finanças 3.0.2

Controle financeiro pessoal adaptado do projeto enviado, mantendo Expo/React Native, SQLite local, Drizzle e a sincronização Supabase. Interface ERS preto/laranja, tema claro/escuro, cabeçalho e rodapé fixos, navegação por abas e ajuda modal. Leia AUDITORIA.md e CONFIGURAR-SUPABASE.md.

## Abrir imediatamente a versão web

A pasta dist já contém uma compilação funcional em modo local, sem credenciais de nuvem.

1. Tenha Node.js 22.13 ou superior (os testes foram executados com Node 24).
2. Extraia o ZIP inteiro.
3. Abra INICIAR-WEB.bat no Windows, ou execute `node scripts/serve-web.mjs` no terminal da pasta raiz.
4. Acesse http://localhost:3000.

Não é necessário instalar dependências para servir a versão já compilada. Não abra dist/index.html com duplo clique. O banco web precisa de WASM/SharedArrayBuffer e isolamento COOP/COEP: use o servidor incluído ou uma hospedagem que envie os mesmos cabeçalhos, sempre HTTPS em produção.

**Atenção:** a compilação inclusa funciona apenas localmente até você inserir as variáveis e recompilar. Definir .env depois do build não altera os arquivos JavaScript já compilados. As variáveis EXPO_PUBLIC são públicas por definição; use somente publishable/anon, nunca service_role, secret key ou senha PostgreSQL.

## Configurar nuvem e recompilar

1. Execute supabase/schema.sql no SQL Editor do seu Supabase. Também há uma cópia ERS-Financas-Supabase.sql na raiz.
2. Configure Authentication conforme CONFIGURAR-SUPABASE.md.
3. Copie .env.example para .env e preencha a URL e a chave pública do projeto.
4. Execute `npm ci` (aplica automaticamente o patch necessário do expo-sqlite).
5. Execute `npm run build:web`.
6. Execute `npm run serve:web`, abra o aplicativo e entre em Mais → Sincronização na nuvem.
7. Valide cadastro, confirmação de e-mail e sincronização em dois aparelhos antes de usar dados reais.

Sem nuvem configurada o aplicativo continua funcionando localmente, com backup JSON e CSV.

## Desenvolver e testar

- `npm start`: desenvolvimento Expo.
- `npm run web`: desenvolvimento web.
- `npm run android` / `npm run ios`: iniciar desenvolvimento da plataforma.
- `npm run typecheck`: TypeScript.
- `npm run lint`: análise estática.
- `npm test`: testes financeiros, migrations, backup e sincronização com PostgreSQL em memória.
- `npm run build:web`: exportar SPA e preparar cache completo com hash da versão.
- `npm run test:web`: verificar recursos do cache, respostas offline simuladas, cabeçalhos e rotas do servidor, após build.
- `npm run supabase:sql`: regenerar schema SQL se alterar as migrations locais.

O original usa Expo SDK 58. A versão foi preservada. A correção expo-sqlite está em patches/. Não apague esse patch nem use instalação que ignore postinstall.

## Android e iOS

Os identificadores foram separados do autor original: br.dev.ers.financas. A propriedade Expo/EAS e o endereço de atualizações do autor foram removidos. Antes de gerar APK/AAB/IPA, crie/vincule um projeto EAS da ERS (`npx eas-cli@latest init`) e configure suas próprias credenciais. Para distribuir use `npx eas-cli@latest build --platform android --profile preview` ou o perfil de produção. iOS requer as credenciais apropriadas. Nenhum APK/IPA é incluído ou foi certificado nesta entrega.

## PWA e offline

A compilação guarda no cache todas as telas, scripts, fontes, ícones, worker e WASM. Não guarda requisições do Supabase ou cotações. A primeira abertura exige conexão e armazenamento permitido; aguarde “Aplicativo disponível offline”. Instale pelo menu do navegador (no Safari iOS: Compartilhar → Adicionar à Tela de Início).

O cache guarda o aplicativo; o SQLite mantém os dados financeiros. Limpar os dados do site/navegador remove ambos. Cotações, cadastro/login e sincronização exigem internet. Biometria e lembretes locais são funções do aplicativo nativo, não da PWA. Compatibilidade de SQLite web depende do suporte do navegador a WASM, SharedArrayBuffer e armazenamento persistente. Deve ser validada nos aparelhos de destino.

Mantenha o mesmo domínio, protocolo e porta para conservar os dados locais. O pacote é servido na raiz do domínio, não em subpastas. Atualizações apresentam aviso para recarregar; o cache tem hash do conteúdo. Não renomeie arquivos do dist manualmente.

## Backup e conflitos

Em Mais, exporte JSON regularmente. CSV é para planilha, não é um backup completo. Backups não são criptografados. A importação é transacional; com a conta vinculada ela substitui o estado da conta na nuvem após sincronização, inclusive excluindo registros que não estão no backup. A interface pede confirmação.

A sincronização isola os dados por usuário, não cria uma empresa compartilhada por vários logins. A mesma conta pode usar vários aparelhos. A edição mais recente pelo relógio do aparelho vence; mantenha data/hora automáticas. No mesmo milissegundo, o último conteúdo aceito pelo servidor converge na próxima rodada. Não há histórico completo de revisões para recuperar conflitos.

## Publicar a versão web

O render.yaml permite build `npm ci && npm run build:web` e start `npm run serve:web`. Cadastre as duas variáveis EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_KEY no serviço ANTES do build. Não use segredos privilegiados. O servidor lê PORT e envia os cabeçalhos exigidos. O sistema não foi publicado por esta entrega.

## Arquivos importantes

- CONFIGURAR-SUPABASE.md: roteiro e testes de homologação.
- AUDITORIA.md: achados, correções e limites do que foi verificado.
- supabase/schema.sql: oito tabelas isoladas por usuário, índices, RLS e trigger.
- README-ORIGINAL.md: documentação de origem, preservada como referência histórica. Para esta versão, prevalecem este README e os dois documentos acima.

## Prefixo de tabelas desta revisão

Na nuvem todas as tabelas financeiras agora começam com fin_. Veja PADRAO-ERS.md. Se já aplicou o SQL anterior com ers_fin_, execute primeiro supabase/migrar-prefixo.sql, depois supabase/schema.sql. A migração renomeia as tabelas sem apagar os registros e aborta se houver colisão de nomes. Faça backup antes de aplicá-la. Nenhum SQL é executado automaticamente por esta entrega.
