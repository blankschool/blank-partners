
# Corrigir Sobreposição da Sidebar

## Problema Identificado

A sidebar tem posicionamento `fixed` com `z-10` que causa sobreposição no conteúdo quando a tela está em tamanhos intermediários (próximo ao breakpoint de 768px). Isso acontece porque:

1. A sidebar usa `position: fixed` com `z-10`
2. O header usa `z-50` para ficar acima da sidebar
3. O conteúdo principal não tem z-index definido, ficando abaixo da sidebar

## Solução

Ajustar os z-indexes para criar uma hierarquia visual correta e garantir que o conteúdo principal fique ao lado (não abaixo) da sidebar.

## Alterações

### 1. Aumentar z-index da Sidebar

**Arquivo:** `src/components/ui/sidebar.tsx`

Alterar a sidebar de `z-10` para `z-30` para ficar abaixo do header mas acima de elementos de background:

```tsx
// Linha ~195
"fixed inset-y-0 z-30 hidden h-svh w-[--sidebar-width]..."
```

### 2. Ajustar z-index do Conteúdo Principal

**Arquivo:** `src/components/layout/AppLayout.tsx`

O conteúdo já está corretamente posicionado com `SidebarInset`, mas precisamos garantir que o z-index esteja correto:

```tsx
<main className="flex-1 overflow-auto p-6 bg-muted/30 relative z-0">
```

### 3. Garantir Header Acima de Tudo

**Arquivo:** `src/components/layout/AppHeader.tsx`

O header já está com `z-50`, o que está correto.

## Hierarquia de Z-Index Final

| Elemento | Z-Index | Descrição |
|----------|---------|-----------|
| Background gradients | 0 | Elementos decorativos |
| Main content | 10 | Conteúdo principal |
| Sidebar | 30 | Menu lateral |
| Header | 50 | Barra superior (sempre visível) |
| Dropdowns/Modals | 50+ | Elementos flutuantes |

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/ui/sidebar.tsx` | Aumentar z-index de `z-10` para `z-30` |
| `src/components/layout/AppLayout.tsx` | Adicionar `z-0` ao main content para clareza |

## Resultado Esperado

Após as alterações:
- A sidebar ficará corretamente posicionada ao lado do conteúdo
- O header sempre ficará acima da sidebar
- Não haverá mais sobreposição visual entre sidebar e conteúdo
