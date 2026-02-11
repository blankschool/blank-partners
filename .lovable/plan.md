
# Criar Pagina de Cadastro de Contas

## Resumo

Criar uma pagina `/register` para cadastro de novas contas, restrita a emails `@blankschool.com.br`. O fluxo sera similar ao login (OTP por email), mas com `shouldCreateUser: true` e validacao do dominio do email.

## Mudancas

### 1. Adicionar funcao `signUpWithOtp` no `useAuth.tsx`

Adicionar uma nova funcao ao contexto de autenticacao que chama `supabase.auth.signInWithOtp` com `shouldCreateUser: true` (ao contrario do login que usa `false`).

### 2. Criar pagina `src/pages/Register.tsx`

Nova pagina com o mesmo visual da pagina de Auth (branding Blank, card centralizado, gradiente), mas com:
- Validacao client-side: aceitar apenas emails terminados em `@blankschool.com.br`
- Mensagem de erro clara se o dominio for diferente
- Fluxo: email -> verificacao OTP -> redirect ao dashboard
- Texto adaptado: "Criar conta" em vez de "Welcome back"

### 3. Atualizar `src/App.tsx`

Adicionar rota publica `/register` apontando para a nova pagina.

### 4. Adicionar link na pagina de login

Adicionar um link discreto na pagina `Auth.tsx`: "Primeira vez? Criar conta" apontando para `/register`.

## Detalhes Tecnicos

- A validacao do dominio sera feita no client (`email.endsWith("@blankschool.com.br")`) antes de enviar o OTP
- A funcao `signUpWithOtp` usara `shouldCreateUser: true` para permitir criacao de conta
- O trigger `handle_new_user` ja existente no banco criara automaticamente o registro na tabela `users` com role `client`
- Nenhuma migracao de banco necessaria
- A pagina de registro nao precisa de `ProtectedRoute` (e publica, como `/auth`)
