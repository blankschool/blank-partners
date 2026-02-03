

# Correção: Permitir valor 0 no Controle de Escopo

## Problema Identificado

O campo de input não mantém o valor "0" visível porque a lógica de exibição trata `0` como valor "falsy".

**Código atual (linha 120):**
```typescript
const displayValue = localValue !== undefined ? localValue : (actual || "");
```

Quando `actual = 0`, a expressão `actual || ""` retorna `""` (string vazia), porque `0` é considerado "falsy" em JavaScript.

## Solução

Alterar a lógica para verificar explicitamente se o valor é `null` ou `undefined`, em vez de usar o operador `||`:

**Código corrigido:**
```typescript
const displayValue = localValue !== undefined 
  ? localValue 
  : (actual !== null && actual !== undefined ? actual : "");
```

Ou de forma mais limpa usando o operador nullish coalescing (`??`):
```typescript
const displayValue = localValue !== undefined ? localValue : (actual ?? "");
```

O operador `??` só retorna o valor da direita se o valor da esquerda for `null` ou `undefined`, **não** quando for `0`.

## Arquivo a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/scope/ScopeControlTable.tsx` | Linha 120: trocar `actual \|\| ""` por `actual ?? ""` |

## Resultado Esperado

- O valor `0` será exibido corretamente no input
- O usuário poderá digitar, salvar e visualizar `0` sem problemas
- A cor de status continuará funcionando corretamente (verde quando real = planejado)

