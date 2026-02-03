

# Correção: Tema Claro para Popup de Clientes Pendentes

## Problema

O popup de clientes pendentes está usando o tema escuro padrão do projeto, resultando em baixo contraste e difícil leitura, conforme mostrado na imagem.

## Solução

Aplicar um tema claro (light theme) ao `DialogContent` e aos cards internos, seguindo o padrão de outros dialogs administrativos do projeto.

## Alterações

| Arquivo | Alteração |
|---------|-----------|
| `src/components/scope/ChannelPendingDialog.tsx` | Aplicar classes de tema claro |

## Detalhes Técnicos

### DialogContent (linha 64)

Adicionar classes para fundo branco e texto escuro:

```typescript
// De:
<DialogContent className="max-w-md">

// Para:
<DialogContent className="max-w-md bg-white text-gray-900 border-gray-200">
```

### Cards de Cliente (linha 87)

Ajustar cores para contrastar com o fundo branco:

```typescript
// De:
className="rounded-lg border border-border bg-muted/30 p-4 space-y-2"

// Para:
className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2"
```

### Barra de Progresso (linha 96)

Ajustar cor de fundo da barra:

```typescript
// De:
className="flex-1 relative h-2 w-full overflow-hidden rounded-full bg-secondary"

// Para:
className="flex-1 relative h-2 w-full overflow-hidden rounded-full bg-gray-200"
```

### Textos Secundários (linhas 91, 114)

Usar cores de texto adequadas para o tema claro:

```typescript
// De:
className="text-sm text-muted-foreground"

// Para:
className="text-sm text-gray-500"
```

### Borda do Rodapé (linha 114)

```typescript
// De:
className="pt-2 border-t border-border text-sm text-muted-foreground"

// Para:
className="pt-2 border-t border-gray-200 text-sm text-gray-500"
```

## Resultado Esperado

- Fundo branco no dialog
- Cards com fundo cinza claro (`bg-gray-50`)
- Bordas em cinza suave (`border-gray-200`)
- Texto principal em preto/cinza escuro
- Melhor legibilidade e contraste geral

