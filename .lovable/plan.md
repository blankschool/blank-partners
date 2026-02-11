

# Liberar Pagina de Relatorios para Todo o Time Interno (agency)

## Resumo

Atualmente a rota `/reports` esta protegida por `AdminRoute`, permitindo acesso apenas a admins. Vamos trocar para `ProtectedRoute` com uma verificacao que permita usuarios com role `admin` ou `agency`. Nao e necessario alterar nada no banco de dados, pois as RLS policies da tabela `client_reports` ja permitem ALL para `is_admin_or_agency()`.

## Mudancas

### 1. Criar componente `AgencyRoute`

Novo arquivo: `src/components/AgencyRoute.tsx`

Similar ao `AdminRoute`, mas usando `is_admin_or_agency()` -- ou seja, verificando se o usuario tem role `admin` OU `agency`. Usaremos o hook `useCurrentUserRole` adaptado ou criaremos uma verificacao direta via `supabase.rpc("is_admin_or_agency")`.

### 2. Criar hook `useIsAgencyOrAdmin`

Novo hook simples que chama `supabase.rpc("is_admin_or_agency")` para verificar se o usuario logado tem permissao de agency ou admin.

### 3. Atualizar `src/App.tsx`

Trocar o wrapper da rota `/reports` de `AdminRoute` para `AgencyRoute`:

```text
// De:
<AdminRoute><Reports /></AdminRoute>

// Para:
<AgencyRoute><Reports /></AgencyRoute>
```

### 4. Sem mudancas no banco de dados

As RLS policies da tabela `client_reports` ja usam `is_admin_or_agency()` para ALL operations, entao usuarios com role `agency` ja podem ler, inserir, atualizar e deletar relatorios. Nenhuma migracao e necessaria.

## Detalhes Tecnicos

- O componente `AgencyRoute` segue o mesmo padrao do `AdminRoute` existente (loading state, redirect para `/auth` se nao logado, redirect para `/` se sem permissao)
- A funcao `is_admin_or_agency()` ja existe no banco e verifica ambos os roles
- Usuarios com role `client` continuarao sem acesso a esta pagina
