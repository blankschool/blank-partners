

# Ajustar Governanca de Novos Usuarios

## Resumo

Novos usuarios que se cadastram via `/register` devem receber a role `agency` (em vez de nenhuma role no `user_roles`) e ver apenas **Dashboard** e **Relatorios** na sidebar. Admins continuam vendo tudo como hoje.

## Mudancas

### 1. Migracao: Trigger para atribuir role `agency` automaticamente

Criar um trigger no banco que, ao inserir um novo usuario no `auth.users`, insira automaticamente uma entrada na tabela `user_roles` com role `agency`. Isso garante que todo novo cadastro via `/register` ja tenha a permissao correta.

```text
-- Funcao que insere role agency para novos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'agency')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger no auth.users
CREATE TRIGGER on_auth_user_created_add_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();
```

### 2. Sidebar: Mostrar itens conforme o role do usuario

Atualizar `src/components/layout/AppSidebar.tsx` para ter 3 niveis de navegacao:

- **Todos os usuarios autenticados** (incluindo agency): Dashboard
- **Agency ou Admin** (`is_admin_or_agency`): Relatorios
- **Apenas Admin** (`is_admin`): Clients, Contents, Team, Healthscore, Users, Admin, Controle de Escopo

A sidebar vai usar o hook `useIsAgencyOrAdmin` (ja existente) alem do `useCurrentUserRole` para determinar quais itens mostrar.

### 3. Protecao de rotas

As rotas que nao devem ser acessiveis por usuarios agency puro (Clients, Contents, Team, Healthscore, Users) ja estao como `ProtectedRoute` -- precisaremos troca-las para `AdminRoute` para que apenas admins acessem. Isso garante que mesmo digitando a URL diretamente, o usuario agency nao consiga entrar.

Rotas que mudam:
- `/clients` -> de `ProtectedRoute` para `AdminRoute`
- `/contents` -> de `ProtectedRoute` para `AdminRoute`
- `/team` -> de `ProtectedRoute` para `AdminRoute`
- `/healthscore` -> de `ProtectedRoute` para `AdminRoute`
- `/users` -> de `ProtectedRoute` para `AdminRoute`
- `/profile` -> permanece `ProtectedRoute` (todos podem editar perfil)
- `/` (Dashboard) -> permanece `ProtectedRoute`
- `/reports` -> permanece `AgencyRoute` (agency + admin)

### 4. Arquivos modificados

| Arquivo | Mudanca |
|---|---|
| Migracao SQL | Trigger para atribuir role `agency` a novos usuarios |
| `src/components/layout/AppSidebar.tsx` | Reorganizar itens de menu por nivel de acesso |
| `src/App.tsx` | Trocar ProtectedRoute por AdminRoute em 5 rotas |

