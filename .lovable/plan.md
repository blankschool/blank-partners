

# Edição de Escopo Realizado - Local e Experiência Ideal

## Análise do Contexto

O usuário precisa editar os valores **realizados** (actuals) de cada canal para um cliente específico em um mês específico. Atualmente:

- O hook `useScopeControl` já possui a mutation `upsertActual` implementada
- Os dados são exibidos na tabela expansível `ScopeChannelBreakdown`
- O padrão de dialogs do projeto usa tema claro (como o `ChannelPendingDialog`)

## Opções de UX Avaliadas

| Opção | Prós | Contras |
|-------|------|---------|
| **A) Inline Editing na Tabela** | Rápido, contextual, menos cliques | Pode ser acidental, menos espaço visual |
| **B) Dialog ao Clicar na Linha** | Separação clara, mais espaço | Mais cliques, perde contexto |
| **C) Botão de Edição + Dialog** | Ação explícita, controle total | Mais cliques |
| **D) Painel Lateral (Sheet)** | Contextual, mantém visão da tabela | Complexidade adicional |

## Recomendação: Opção C - Botão de Edição + Dialog

Melhor equilíbrio entre **clareza de intenção** e **eficiência operacional**:

1. **Botão de edição visível** na expansão de cada cliente
2. **Dialog dedicado** para editar todos os canais de uma vez
3. **Tema claro** seguindo o padrão do projeto

## Design da Solução

### Fluxo do Usuário

```text
1. Usuário expande linha do cliente na Decision Table
   ↓
2. Vê o breakdown por canal + botão "Editar Realizado" (ícone Pencil)
   ↓
3. Clica no botão → abre Dialog
   ↓
4. Dialog mostra nome do cliente + mês selecionado
   ↓
5. Inputs para cada canal (Planejado read-only | Realizado editável)
   ↓
6. Salvar → atualiza todos os valores alterados
```

### Layout do Dialog

```text
┌─────────────────────────────────────────────────────────┐
│  Editar Realizado                               [X]     │
│  Cliente: Agroadvance | Janeiro 2026                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┬──────────────┬──────────────────┐  │
│  │ Canal           │ Planejado    │ Realizado        │  │
│  ├─────────────────┼──────────────┼──────────────────┤  │
│  │ 📸 Instagram    │     45       │ [___43___]       │  │
│  │ 🎬 TikTok       │     20       │ [___18___]       │  │
│  │ 💼 LinkedIn     │     15       │ [___15___]       │  │
│  │ 📱 YT Shorts    │     30       │ [___28___]       │  │
│  │ 🎥 YT Videos    │      5       │ [____5___]       │  │
│  │ 🎤 Gravações    │      8       │ [____6___]       │  │
│  └─────────────────┴──────────────┴──────────────────┘  │
│                                                         │
│                          [Cancelar]  [Salvar Alterações]│
└─────────────────────────────────────────────────────────┘
```

## Componentes a Criar/Modificar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/components/scope/EditActualsDialog.tsx` | CRIAR | Dialog para edição dos valores realizados |
| `src/components/scope/ScopeChannelBreakdown.tsx` | MODIFICAR | Adicionar botão de edição |
| `src/components/scope/ScopeClientRow.tsx` | MODIFICAR | Passar props para edição |
| `src/components/scope/ScopeDecisionTable.tsx` | MODIFICAR | Passar função de edição |
| `src/pages/ScopeControl.tsx` | MODIFICAR | Gerenciar estado do dialog |

## Detalhes Técnicos

### 1. EditActualsDialog.tsx

```typescript
interface EditActualsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientScope;
  month: Date;
  onSave: (clientId: string, values: Record<ChannelCode, number>) => void;
  isLoading: boolean;
}
```

**Características:**
- Tema claro (`bg-white text-gray-900`)
- Tabela com 3 colunas: Canal | Planejado (disabled) | Realizado (editável)
- Ícones coloridos para cada canal
- Inputs numéricos com validação (min 0)
- Estado local para edição, salva tudo de uma vez

### 2. ScopeChannelBreakdown.tsx - Alterações

Adicionar botão no header da tabela de breakdown:

```tsx
<div className="flex items-center justify-between mb-2">
  <span className="text-sm font-medium text-muted-foreground">
    Detalhes por Canal
  </span>
  <Button 
    variant="outline" 
    size="sm" 
    onClick={onEditClick}
  >
    <Pencil className="h-3.5 w-3.5 mr-1.5" />
    Editar Realizado
  </Button>
</div>
```

### 3. Fluxo de Props

```text
ScopeControl (gerencia dialog state)
  ↓
ScopeDecisionTable (recebe onEditClient)
  ↓
ScopeClientRow (recebe onEditClient)
  ↓
ScopeChannelBreakdown (recebe onEditClick)
```

### 4. Lógica de Salvamento

O hook `useScopeControl` já tem a mutation `upsertActual`. Para otimizar:

1. Ao salvar, comparar valores antigos vs novos
2. Só chamar mutation para campos alterados
3. Usar Promise.all para paralelizar
4. Invalidar query após sucesso

```typescript
const handleSave = async (clientId: string, values: Record<ChannelCode, number>) => {
  const changes = Object.entries(values).filter(
    ([code, value]) => originalValues[code as ChannelCode] !== value
  );
  
  await Promise.all(
    changes.map(([code, value]) => 
      upsertActual({ clientId, field: code as ChannelCode, value })
    )
  );
};
```

## Considerações de UX

### Feedback Visual
- Loading state no botão "Salvar" durante salvamento
- Toast de sucesso após salvar
- Valores alterados destacados visualmente (opcional)

### Acessibilidade
- Labels associados aos inputs
- Focus trap no dialog
- Escape fecha o dialog

### Validação
- Apenas números inteiros positivos
- Não permitir valores negativos
- Campo vazio = 0

## Resultado Esperado

1. Usuário clica para expandir linha do cliente
2. Vê botão "Editar Realizado" no breakdown
3. Abre dialog com todos os canais
4. Edita valores desejados
5. Salva → feedback visual → dialog fecha
6. Tabela atualiza automaticamente com novos valores

