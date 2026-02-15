

# Ajuste de Contraste na Barra de Progresso

## Problema

A barra de progresso nos cards semanais esta com fundo preto e indicador preto, sem contraste visual. O usuario so consegue ver o progresso pela porcentagem escrita, nao pela barra em si.

## Solucao

Alterar o componente `Progress` (`src/components/ui/progress.tsx`) para usar um fundo cinza claro (`bg-muted`) em vez de `bg-secondary`. No tema atual, `--secondary` e muito escuro (oklch 0.08), enquanto `--muted` e um cinza claro (oklch 0.96 no light, 0.15 no dark), criando o contraste necessario com o indicador preto.

### Arquivo: `src/components/ui/progress.tsx`

Trocar `bg-secondary` por `bg-muted` na classe do `ProgressPrimitive.Root`:

```text
// De:
className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}

// Para:
className={cn("relative h-4 w-full overflow-hidden rounded-full bg-muted", className)}
```

## Escopo

- 1 arquivo alterado: `progress.tsx`
- Mudanca de uma unica classe CSS

